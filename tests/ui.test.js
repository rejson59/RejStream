// @vitest-environment jsdom
import { it, expect, vi, beforeAll } from "vitest";
const navigate = async (path) => {
  location.hash = path;
  await new Promise((r) => setTimeout(r, 15));
};
beforeAll(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  window.scrollTo = vi.fn();
  await import("../src.js");
});
it("starts with a series catalog and no removed movie", () => {
  expect(document.querySelectorAll(".series-card")).toHaveLength(3);
  expect(document.body.textContent).not.toContain("Big Buck Bunny");
  expect(document.querySelector(".bottom-nav")).not.toBeNull();
});
it("opens circus as a complete numbered season, not a mixed homepage", async () => {
  await navigate("series/circus");
  expect(document.querySelectorAll("[data-episode]")).toHaveLength(9);
  expect(document.querySelectorAll(".series-card")).toHaveLength(0);
  expect(document.querySelector(".episode h3").textContent).toBe("PILOT");
});
it("sorts episodes descending and preserves audio filter across re-renders", () => {
  const sort = document.querySelector("#episode-sort");
  sort.value = "desc";
  sort.dispatchEvent(new Event("change"));
  expect(document.querySelector(".episode h3").textContent).toBe("Remember");
  const audio = document.querySelector("#audio-filter");
  audio.value = "fandub";
  audio.dispatchEvent(new Event("change"));
  expect(document.querySelectorAll("[data-episode]")).toHaveLength(0);
  document.querySelector('[data-go="reset/circus"]').click();
  expect(document.querySelectorAll("[data-episode]")).toHaveLength(9);
});
it("switches Helluva seasons without mixing pilot numbering", async () => {
  await navigate("series/helluva");
  expect(document.querySelectorAll("[data-episode]")).toHaveLength(8);
  document.querySelector('[data-season="2"]').click();
  expect(document.querySelectorAll("[data-episode]")).toHaveLength(12);
  document.querySelector('[data-season="special"]').click();
  expect(document.querySelectorAll("[data-episode]")).toHaveLength(2);
});
it("saves series and shows a dedicated favorites collection", async () => {
  await navigate("series/circus");
  document.querySelector('[data-save="circus"]').click();
  await navigate("saved");
  expect(document.querySelectorAll(".series-card")).toHaveLength(1);
  expect(document.querySelector(".series-card h3").textContent).toBe(
    "The Amazing Digital Circus",
  );
});
it("offers the actual Polish fandub and source link", async () => {
  await navigate("watch/helluva/1/1");
  const audio = document.querySelector("#audio");
  audio.value = "pl";
  audio.dispatchEvent(new Event("change"));
  expect(document.querySelector("iframe").src).toContain("4DjfKP5w8Ps");
  expect(document.querySelector("#youtube-link").href).toContain("4DjfKP5w8Ps");
  const sub = document.querySelector("#subs");
  sub.value = "pl";
  sub.dispatchEvent(new Event("change"));
  expect(document.querySelector("iframe").src).toContain("cc_lang_pref=pl");
});
it("does not reload player when marking watched; persists manual status", () => {
  const frame = document.querySelector("iframe");
  document.querySelector("[data-watched]").click();
  expect(document.querySelector("iframe")).toBe(frame);
  expect(JSON.parse(localStorage.getItem("rej-watched"))).toContain(
    "helluva:1:1",
  );
});
it("shows all nine episodes alongside circus player with working next link", async () => {
  await navigate("watch/circus/1/1");
  expect(document.querySelectorAll(".queue-item")).toHaveLength(9);
  expect(document.querySelector(".episode-navigation a:last-child").hash).toBe(
    "#watch/circus/1/2",
  );
  expect(document.querySelector('#audio option[value="pl"]')).toBeNull();
});
it("shows external-only episodes without a fake stream", async () => {
  await navigate("watch/helluva/3/1");
  expect(document.querySelector("iframe")).toBeNull();
  expect(document.querySelector(".external-player a").href).toContain(
    "primevideo.com",
  );
});
it("opens local player and disposes it when navigating away", async () => {
  await navigate("local");
  expect(document.querySelector("video")).not.toBeNull();
  expect(document.querySelector(".local-subs").accept).toBe(".vtt,.srt");
  await navigate("home");
  expect(document.querySelector("video")).toBeNull();
  expect(document.querySelector(".recent-card")).not.toBeNull();
});
it("clears catalog search when moving to a series, so its episodes remain visible", async () => {
  await navigate("library");
  const input = document.querySelector("#search");
  input.value = "digital";
  input.dispatchEvent(new Event("input"));
  expect(document.querySelectorAll(".series-card")).toHaveLength(1);
  await navigate("series/circus");
  expect(document.querySelectorAll("[data-episode]")).toHaveLength(9);
  expect(input.value).toBe("");
});
it("displays and closes audio guidance and returns focus", () => {
  const trigger = document.querySelector('[data-info="languages"]');
  trigger.focus();
  trigger.click();
  expect(document.querySelector("#dialog").hidden).toBe(false);
  expect(document.querySelector('[role="dialog"]').textContent).toContain(
    "Ścieżkę dźwiękową",
  );
  document.querySelector(".dialog-close").click();
  expect(document.querySelector("#dialog").hidden).toBe(true);
  expect(document.activeElement).toBe(trigger);
});
it("handles unknown routes and unknown episodes gracefully", async () => {
  await navigate("watch/circus/1/999");
  expect(document.querySelector(".empty-state")).not.toBeNull();
  await navigate("unknown");
  expect(document.querySelector(".empty-state")).not.toBeNull();
});
