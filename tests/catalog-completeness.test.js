import { describe, it, expect } from "vitest";
import { getSeries, libraryEpisodes, episodeKey } from "../catalog.js";

// Snapshot of published episodes as of 2026-10-25. Not a live availability test.
const numbers = (n) => Array.from({ length: n }, (_, i) => i + 1);
describe("published catalog audit 2026-10-25", () => {
  it("includes every numbered Helluva Short, not the music video's playlist index", () => {
    const show = getSeries("helluva");
    const shorts = libraryEpisodes(show, { season: "shorts" });
    expect(shorts.map((e) => e.number)).toEqual(numbers(14));
    expect(shorts.map((e) => e.id)).toEqual([
      "_38dtqdR5V4",
      "uSDG4K1ycvc",
      "3-NrCcr8Bcg",
      "pngogrW4iC4",
      "-1b7uCyONb0",
      "52_V04weeC4",
      "dlThyclyHtw",
      "4obZtz2jEmo",
      "LPzQl8gwulw",
      "G3XORWJ2rQc",
      "PyICIy6fkDo",
      "4kJXWQWW-og",
      "ZAkGmkP9j5c",
      "qJuPDHE5jug",
    ]);
    expect(shorts.some((e) => e.id === "-mLSmR58ZaQ")).toBe(false);
    expect(new Set(shorts.map((e) => episodeKey(show.key, e))).size).toBe(14);
    for (const ep of shorts) {
      expect(ep.polishTitle).toBeTruthy();
      expect(ep.originalTitle).toBeTruthy();
      expect(ep.date <= "2026-10-25").toBe(true);
      expect(ep.time).toMatch(/^\d+:\d{2}$/);
    }
    // Existing account keys and verified fandubs must not move when filling gaps.
    expect(shorts[2].polishAudio[0].video).toBe("G5_cxsKSN2Y");
    expect(shorts[3].polishAudio[0].video).toBe("7bkMzT8h5jE");
    for (const ep of shorts.filter((e) => ![1, 3, 4].includes(e.number))) {
      expect(ep.polishAudio).toEqual([]);
      expect(ep.polishTrack).toBe(false);
    }
  });
  it.each([
    ["circus", "1", 9],
    ["drones", "1", 8],
    ["helluva", "1", 8],
    ["helluva", "2", 12],
    ["meta-runner", "2", 10],
    ["meta-runner", "3", 8],
  ])(
    "keeps %s season %s complete and consecutively numbered",
    (key, season, count) => {
      const entries = libraryEpisodes(getSeries(key), { season });
      expect(entries.map((ep) => ep.number)).toEqual(numbers(count));
      expect(entries.every((ep) => /^[\w-]{11}$/.test(ep.id))).toBe(true);
    },
  );
  it("lists only the five released Helluva S3 episodes, all external", () => {
    const show = getSeries("helluva");
    const entries = libraryEpisodes(show, { season: "3" });
    expect(entries.map((ep) => ep.number)).toEqual(numbers(5));
    expect(
      entries.every(
        (ep) =>
          ep.id === null && ep.external.includes("0GEB35CUYRCDVXUV0UXQY9FHIF"),
      ),
    ).toBe(true);
    expect(show.catalogNote).toContain("sezon trwa");
  });
  it("does not call the Meta Runner season-one edit ten separate episodes", () => {
    const show = getSeries("meta-runner");
    expect(libraryEpisodes(show, { season: "1" })).toHaveLength(1);
    expect(show.catalogNote).toContain("nie 10 osobnych odcinków");
  });
});
