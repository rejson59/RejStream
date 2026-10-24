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

it("defaults to credited Polish material and remembers an explicit original preference", async () => {
  localStorage.removeItem("rej-prefer-polish");
  await navigate("watch/helluva/1/2");
  expect(document.querySelector("#audio").value).toBe("pl");
  expect(document.querySelector("iframe").src).toContain("jamGQ6oBo4w");
  expect(document.querySelector("#audio-credit a").href).toContain(
    "@BruDolinaStudios",
  );
  const audio = document.querySelector("#audio");
  audio.value = "original";
  audio.dispatchEvent(new Event("change"));
  expect(document.querySelector("#playback-source").textContent).toContain(
    "SpindleHorse",
  );
  await navigate("watch/helluva/1/3");
  expect(document.querySelector("#audio").value).toBe("original");
  document.querySelector("#audio").value = "pl";
  document.querySelector("#audio").dispatchEvent(new Event("change"));
  await navigate("watch/helluva/1/4");
  expect(document.querySelector("#audio").value).toBe("pl");
  expect(document.querySelector("iframe").src).toContain("F-MT37XoLyM");
});
it("lets the viewer choose an alternate credited Polish fandub", async () => {
  await navigate("watch/helluva/1/1");
  const audio = document.querySelector("#audio");
  audio.value = "pl:QxXceYy-tbw";
  audio.dispatchEvent(new Event("change"));
  expect(document.querySelector("iframe").src).toContain("QxXceYy-tbw");
  expect(document.querySelector("#playback-source").textContent).toContain(
    "BruDolina",
  );
  expect(document.querySelector("#youtube-link").href).toContain("QxXceYy-tbw");
});
it("labels lektor separately and gives genuine gaps no Polish source option", async () => {
  await navigate("watch/helluva/2/2");
  expect(document.querySelector(".polish-notice.lektor")).not.toBeNull();
  expect(
    document.querySelector('#audio option[value="pl"]').textContent,
  ).toContain("lektor (nie dubbing)");
  expect(document.querySelector("#playback-source").textContent).toContain(
    "Keisuken",
  );
  expect(document.querySelector("iframe").src).toContain("9YvbfmfQTSY");
  await navigate("watch/helluva/2/12");
  expect(document.querySelector(".polish-notice.missing")).not.toBeNull();
  expect(document.querySelector('#audio option[value="pl"]')).toBeNull();
  expect(document.querySelector(".polish-notice a").href).toContain(
    "primevideo.com",
  );
});
it("shows age-restricted Polish audio as an external link with original fallback", async () => {
  await navigate("watch/helluva/2/1");
  expect(document.querySelector("iframe")).toBeNull();
  expect(document.querySelector(".external-player a").href).toContain(
    "SL6o757ljFM",
  );
  expect(document.querySelector(".external-player").textContent).toContain(
    "ograniczenie wieku",
  );
  document.querySelector("#audio").value = "original";
  document.querySelector("#audio").dispatchEvent(new Event("change"));
  expect(document.querySelector("iframe")).not.toBeNull();
});
it("explains official Polish audio without claiming to control YouTube tracks", async () => {
  await navigate("watch/drones/1/1");
  expect(
    document.querySelector(".polish-notice.official").textContent,
  ).toContain("nie przełącza tej ścieżki automatycznie");
  expect(document.querySelectorAll("#audio option")).toHaveLength(1);
  expect(document.querySelector("iframe").src).toContain("mImFz8mkaHo");
  await navigate("series/circus");
  expect(document.querySelectorAll(".pl-label")).toHaveLength(9);
  const filter = document.querySelector("#audio-filter");
  filter.value = "polish";
  filter.dispatchEvent(new Event("change"));
  expect(document.querySelectorAll("[data-episode]")).toHaveLength(9);
  expect(document.querySelector("#audio-filter").value).toBe("polish");
});
