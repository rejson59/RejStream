// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import { mountNativePlayer } from "../native-player.js";
import { records } from "../progress.js";
it("resumes the same reselected local file at the last fractional second", () => {
  localStorage.clear();
  const pause = vi
    .spyOn(HTMLMediaElement.prototype, "pause")
    .mockImplementation(() => {});
  const load = vi
    .spyOn(HTMLMediaElement.prototype, "load")
    .mockImplementation(() => {});
  URL.createObjectURL = vi.fn(() => "blob:test");
  URL.revokeObjectURL = vi.fn();
  const root = document.createElement("div");
  document.body.append(root);
  const file = new File(["video"], "example.mp4", {
    type: "video/mp4",
    lastModified: 1234,
  });
  const select = () => {
    const input = root.querySelector(".local-video");
    Object.defineProperty(input, "files", { value: [file] });
    input.dispatchEvent(new Event("change"));
  };
  let stop = mountNativePlayer(root, { title: "Local", local: true });
  select();
  let video = root.querySelector("video");
  Object.defineProperty(video, "duration", { value: 200, configurable: true });
  Object.defineProperty(video, "paused", { value: false, configurable: true });
  video.currentTime = 43.375;
  video.dispatchEvent(new Event("timeupdate"));
  stop();
  expect(Object.values(records())[0].position).toBe(43.375);
  stop = mountNativePlayer(root, { title: "Local", local: true });
  select();
  video = root.querySelector("video");
  Object.defineProperty(video, "duration", { value: 200, configurable: true });
  video.dispatchEvent(new Event("loadedmetadata"));
  expect(video.currentTime).toBe(43.375);
  expect(root.querySelector(".resume-note").textContent).toContain("0:43");
  stop();
  root.remove();
  pause.mockRestore();
  load.mockRestore();
});
