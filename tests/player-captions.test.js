// @vitest-environment jsdom
import { it, expect, vi, afterEach } from "vitest";
import {
  captionPreference,
  createProgress,
  trackYouTube,
} from "../progress.js";
afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
});
it("requests Polish captions on a loaded module and confirms only through readback", () => {
  let track = { languageCode: "en" };
  const player = {
    getOption: () => track,
    loadModule: vi.fn(),
    setOption: vi.fn((m, o, v) => (track = v)),
  };
  const report = vi.fn();
  const captions = captionPreference(() => player, report);
  captions.apply();
  expect(player.setOption).toHaveBeenCalledWith("captions", "track", {
    languageCode: "pl",
  });
  expect(report).toHaveBeenLastCalledWith(
    expect.stringContaining("potwierdzone"),
  );
  const requests = player.setOption.mock.calls.length;
  captions.apply();
  expect(player.setOption).toHaveBeenCalledTimes(requests);
  captions.set("en");
  expect(track.languageCode).toBe("en");
});
it("bounds retry attempts and never falsely confirms a missing Polish track", () => {
  const player = {
    getOption: () => ({ languageCode: "en" }),
    loadModule: vi.fn(),
    setOption: vi.fn(),
  };
  const report = vi.fn();
  const captions = captionPreference(() => player, report);
  for (let i = 0; i < 20; i++) captions.apply();
  expect(player.setOption).toHaveBeenCalledTimes(4);
  expect(report.mock.calls.every(([s]) => !s.includes("potwierdzone"))).toBe(
    true,
  );
});
it("handles unsupported captions and source-default preference without throwing or reloading", () => {
  const report = vi.fn();
  const captions = captionPreference(
    () => ({
      setOption() {
        throw Error();
      },
    }),
    report,
  );
  expect(() => captions.apply()).not.toThrow();
  captions.set("");
  expect(report).toHaveBeenLastCalledWith(
    expect.stringContaining("Ustawienia napisów"),
  );
});
it("corrects resume drift once after cueing, not during readiness or every play", async () => {
  vi.useFakeTimers();
  createProgress("resume").sample({
    time: 123.75,
    duration: 300,
    playing: true,
  });
  let events,
    time = 0;
  const player = {
    getDuration: () => 300,
    getCurrentTime: () => time,
    getPlaybackRate: () => 1,
    seekTo: vi.fn((t) => (time = t)),
    destroy: vi.fn(),
  };
  const stop = trackYouTube(
    document.createElement("iframe"),
    "resume",
    {},
    {
      api: () =>
        Promise.resolve({
          Player: function (f, o) {
            events = o.events;
            return player;
          },
        }),
    },
  );
  await Promise.resolve();
  events.onReady({ target: player });
  expect(player.seekTo).not.toHaveBeenCalled();
  events.onStateChange({ data: 5 });
  expect(player.seekTo).toHaveBeenCalledWith(123.75, true);
  time = 200;
  events.onStateChange({ data: 1 });
  expect(player.seekTo).toHaveBeenCalledTimes(1);
  stop();
});
it("uses the existing player for caption changes and reacts to late captions module availability", async () => {
  vi.useFakeTimers();
  let events,
    track = { languageCode: "en" };
  const player = {
    getDuration: () => 100,
    getCurrentTime: () => 5,
    getPlaybackRate: () => 1,
    getOption: () => track,
    loadModule: vi.fn(),
    setOption: vi.fn((m, o, v) => (track = v)),
    destroy: vi.fn(),
  };
  const Player = vi.fn(function (f, o) {
    events = o.events;
    return player;
  });
  const stop = trackYouTube(
    document.createElement("iframe"),
    null,
    {},
    { api: () => Promise.resolve({ Player }) },
  );
  await Promise.resolve();
  events.onReady({ target: player });
  expect(track.languageCode).toBe("pl");
  stop.setSubtitles("en");
  expect(track.languageCode).toBe("en");
  events.onApiChange();
  expect(Player).toHaveBeenCalledTimes(1);
  expect(player.destroy).not.toHaveBeenCalled();
  stop();
});
it("reports a stuck buffer without automatic destructive reloads and clears the watchdog", async () => {
  vi.useFakeTimers();
  let events;
  const status = vi.fn();
  const player = { destroy: vi.fn() };
  const stop = trackYouTube(
    document.createElement("iframe"),
    null,
    {},
    {
      onStatus: status,
      api: () =>
        Promise.resolve({
          Player: function (f, o) {
            events = o.events;
            return player;
          },
        }),
    },
  );
  await Promise.resolve();
  events.onReady({ target: player });
  events.onStateChange({ data: 3 });
  vi.advanceTimersByTime(12000);
  expect(status).toHaveBeenLastCalledWith("slow");
  expect(player.destroy).not.toHaveBeenCalled();
  events.onStateChange({ data: 1 });
  expect(status).toHaveBeenLastCalledWith("playing");
  stop();
});

it("does not overwrite a saved position with zero from an errored player", async () => {
  vi.useFakeTimers();
  createProgress("error").sample({ time: 90, duration: 300, playing: true });
  let events,
    time = 90;
  const player = {
    getDuration: () => 300,
    getCurrentTime: () => time,
    getPlaybackRate: () => 1,
    destroy: vi.fn(),
  };
  const stop = trackYouTube(
    document.createElement("iframe"),
    "error",
    {},
    {
      api: () =>
        Promise.resolve({
          Player: function (f, o) {
            events = o.events;
            return player;
          },
        }),
    },
  );
  await Promise.resolve();
  events.onReady({ target: player });
  events.onStateChange({ data: 1 });
  time = 0;
  events.onError();
  stop();
  const { position } = await import("../progress.js");
  expect(position("error")).toBe(90);
});
