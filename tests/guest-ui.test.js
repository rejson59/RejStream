// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import { createProgress, records, position } from "../progress.js";
it("never records/resumes guests and gates account features without blocking playback", async () => {
  document.body.innerHTML = '<div id="app"></div>';
  window.scrollTo = vi.fn();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  localStorage.setItem(
    "rej-playback-v1",
    JSON.stringify({
      x: { position: 99, seconds: 10, duration: 100, updated: 1 },
    }),
  );
  await import("../src.js");
  await Promise.resolve();
  expect(document.querySelector(".login-nudge")).not.toBeNull();
  expect(document.querySelector(".login-nudge").textContent).toContain(
    "zapisanej sekundy",
  );
  document.querySelector(".nudge-close").click();
  expect(document.querySelector(".login-nudge")).toBeNull();
  const t = createProgress("x");
  t.sample({ time: 30, duration: 100, playing: true });
  expect(records()).toEqual({});
  expect(position("x")).toBe(0);
  expect(localStorage.getItem("rej-playback-v1")).toBeNull();
  const navigate = async (p) => {
    location.hash = p;
    await new Promise((r) => setTimeout(r, 20));
  };
  await navigate("history");
  expect(document.querySelector("#content").textContent).toContain("Zaloguj");
  expect(document.querySelector(".history-item")).toBeNull();
  await navigate("saved");
  expect(document.querySelector("#content").textContent).toContain("Zaloguj");
  await navigate("watch/drones/1/8");
  expect(document.querySelector("#episode-player").src).toContain(
    "caR9ouipm8o",
  );
  expect(document.querySelector(".watch-main > .login-nudge")).not.toBeNull();
  const frame = document.querySelector("#episode-player");
  document.querySelector(".nudge-close").click();
  expect(document.querySelector("#episode-player")).toBe(frame);
  await navigate("watch/drones/1/7");
  expect(document.querySelector(".watch-main > .login-nudge")).not.toBeNull();
  await navigate("watch/drones/1/8");
  expect(document.querySelector(".login-nudge")).toBeNull();
  expect(document.querySelector("#episode-player").src).not.toContain(
    "start=99",
  );
  document.querySelector("[data-watched]").click();
  await new Promise((r) => setTimeout(r, 20));
  expect(location.hash).toBe("#account");
  expect(document.querySelector("#account-form")).not.toBeNull();
  expect(localStorage.getItem("rej-watched")).toBeNull();
});
