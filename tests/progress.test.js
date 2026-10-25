// @vitest-environment jsdom
import { it, expect, vi, beforeEach, afterEach } from "vitest";
vi.mock("../account.js", () => ({
  account: {
    state: () => ({ username: "Test viewer", error: "" }),
    storage: () => localStorage,
    subscribe: () => () => {},
    init: async () => {},
    flush: async () => {},
  },
}));
import {
  createProgress,
  records,
  position,
  trackYouTube,
} from "../progress.js";
beforeEach(() => localStorage.clear());
afterEach(() => vi.useRealTimers());
function setup() {
  let now = 0;
  const tracker = createProgress(
    "test",
    { episode: "show:1:1", label: "Episode" },
    { clock: () => now },
  );
  return {
    sample: (time, playing = true, extras = {}) => {
      now += 1000;
      return tracker.sample({ time, duration: 200, playing, ...extras });
    },
    tracker,
  };
}
it("counts only moving playback and preserves fractional-second position", () => {
  const t = setup();
  t.sample(12.25);
  t.sample(13.25);
  t.sample(14.25);
  expect(records().test.seconds).toBe(2);
  expect(position("test")).toBe(14.25);
});
it("does not count seeking, stalled playback or idle page time", () => {
  const t = setup();
  t.sample(1);
  t.sample(90);
  t.sample(90);
  t.sample(90, false);
  t.sample(90, false);
  expect(records().test.seconds).toBe(0);
  expect(position("test")).toBe(90);
});
it("counts rate-adjusted wall time instead of adding skipped content", () => {
  const t = setup();
  t.sample(10, true, { rate: 2 });
  t.sample(12, true, { rate: 2 });
  expect(records().test.seconds).toBe(1);
});
it("does not overwrite a saved point before playback starts", () => {
  const t = setup();
  t.sample(99.75);
  const tracker = createProgress("test");
  tracker.sample({ time: 0, duration: 200, playing: false });
  expect(position("test")).toBe(99.75);
});
it("retains completion across idle polling and starts completed uploads at zero", () => {
  const t = setup();
  t.sample(199);
  t.sample(200, false, { ended: true });
  t.sample(200, false);
  expect(records().test.completed).toBe(true);
  expect(position("test")).toBe(0);
});
it("ignores malformed storage and survives disabled localStorage", () => {
  localStorage.setItem("rej-playback-v1", '{"bad":{"seconds":-5}}');
  expect(records()).toEqual({});
  const storage = {
    getItem() {
      throw Error("denied");
    },
    setItem() {
      throw Error("denied");
    },
  };
  expect(() =>
    createProgress("x", {}, { storage }).sample({
      time: 1,
      duration: 10,
      playing: true,
    }),
  ).not.toThrow();
});
it("isolates different uploads of the same episode", () => {
  createProgress("original").sample({ time: 23, duration: 100, playing: true });
  expect(position("fandub")).toBe(0);
});
it("resumes through the official API, samples paused/playing state, and destroys timers on disposal", async () => {
  vi.useFakeTimers();
  createProgress("yt").sample({ time: 45.75, duration: 100, playing: true });
  let events,
    t = 45.75;
  const player = {
    getCurrentTime: () => t,
    getDuration: () => 100,
    getPlaybackRate: () => 1,
    seekTo: vi.fn(),
    destroy: vi.fn(),
  };
  const api = () =>
    Promise.resolve({
      Player: function (frame, options) {
        events = options.events;
        return player;
      },
    });
  const stop = trackYouTube(
    document.createElement("iframe"),
    "yt",
    { label: "YT" },
    { api },
  );
  await Promise.resolve();
  const baselineTimers = vi.getTimerCount();
  events.onReady({ target: player });
  expect(player.seekTo).not.toHaveBeenCalled();
  events.onStateChange({ data: 1 });
  t = 46.75;
  vi.advanceTimersByTime(1000);
  expect(position("yt")).toBe(46.75);
  events.onStateChange({ data: 2 });
  stop();
  expect(player.destroy).toHaveBeenCalledOnce();
  expect(vi.getTimerCount()).toBeLessThanOrEqual(baselineTimers);
});
it("never creates a player after route disposal while API is pending", async () => {
  let resolve;
  const Player = vi.fn();
  const stop = trackYouTube(
    document.createElement("iframe"),
    "yt",
    {},
    { api: () => new Promise((r) => (resolve = r)) },
  );
  stop();
  resolve({ Player });
  await Promise.resolve();
  expect(Player).not.toHaveBeenCalled();
});
it("reports API failure rather than inventing progress", async () => {
  const unavailable = vi.fn();
  const stop = trackYouTube(
    document.createElement("iframe"),
    "yt",
    {},
    { api: () => Promise.reject(Error()), onUnavailable: unavailable },
  );
  await Promise.resolve();
  await Promise.resolve();
  expect(unavailable).toHaveBeenCalledOnce();
  expect(records()).toEqual({});
  stop();
});

it("persists an explicit paused seek without counting it as viewing", () => {
  const tracker = createProgress("seek");
  tracker.sample({ time: 76.5, duration: 100, playing: false, force: true });
  expect(position("seek")).toBe(76.5);
  expect(records().seek.seconds).toBe(0);
});
