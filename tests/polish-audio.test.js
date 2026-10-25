import { describe, it, expect } from "vitest";
import { series, getSeries, libraryEpisodes } from "../catalog.js";
import {
  helluvaPolishAudio,
  polishKind,
  audioSource,
} from "../polish-audio.js";
const hb = getSeries("helluva");
const ep = (season, number) =>
  hb.episodes.find((e) => e.season === season && e.number === number);
describe("researched Polish sources", () => {
  it("has valid, credited source IDs and no orphaned episode mappings", () => {
    for (const [key, sources] of Object.entries(helluvaPolishAudio)) {
      const episode = hb.episodes.find(
        (e) => `${e.season}:${e.number}` === key,
      );
      expect(episode, key).toBeDefined();
      expect(episode.id).toBeTruthy();
      for (const s of sources) {
        expect(s.video).toMatch(/^[\w-]{11}$/);
        expect(s.creator).toBeTruthy();
        expect(s.channel).toMatch(/^https:\/\/www.youtube.com\/@/);
        expect(s.checked).toBe("2026-10-25");
        expect(["fandub", "lektor"]).toContain(s.kind);
      }
    }
  });
  it("covers eight first-season episodes and nine second-season episodes with fandubs", () => {
    expect(libraryEpisodes(hb, { season: 1, language: "fandub" })).toHaveLength(
      8,
    );
    expect(
      libraryEpisodes(hb, { season: 2, language: "fandub" }).map(
        (e) => e.number,
      ),
    ).toEqual([1, 3, 4, 5, 7, 8, 9, 10, 11]);
  });
  it("distinguishes the full Seeing Stars voice-over from a complete dub", () => {
    expect(polishKind(ep(2, 2))).toBe("lektor");
    expect(ep(2, 2).pl).toBeUndefined();
    expect(libraryEpisodes(hb, { season: 2, language: "polish" })).toHaveLength(
      10,
    );
    expect(audioSource(ep(2, 2), "pl").video).toBe("9YvbfmfQTSY");
  });
  it("keeps genuine gaps rather than replacing them with trailers or partial dubs", () => {
    for (const item of [ep(2, 6), ep(2, 12), ep("special", 2)]) {
      expect(polishKind(item)).toBe("missing");
      expect(item.polishAudio).toEqual([]);
    }
    expect(
      hb.episodes
        .filter((e) => e.season === 3)
        .every((e) => !e.id && polishKind(e) === "missing"),
    ).toBe(true);
  });
  it("matches shorts to their real episode numbers, not playlist positions", () => {
    expect(ep("shorts", 1).polishAudio[0].video).toBe("g9Yyom9CcW8");
    expect(ep("shorts", 3).polishAudio[0].video).toBe("G5_cxsKSN2Y");
    expect(ep("shorts", 4).polishAudio[0].video).toBe("7bkMzT8h5jE");
  });
  it("supports both credited S1E1 versions and refuses unknown source selectors", () => {
    expect(audioSource(ep(1, 1), "pl").creator).toBe("NanoKarrin");
    expect(audioSource(ep(1, 1), "pl:QxXceYy-tbw").creator).toBe(
      "BruDolina Studios",
    );
    expect(audioSource(ep(1, 1), "pl:xxxxxxxxxxx")).toBeUndefined();
    expect(audioSource(ep(1, 1), "original")).toBeUndefined();
  });
  it("marks GLITCH official Polish tracks without manufacturing separate uploads", () => {
    for (const show of series.filter((s) => ["circus", "drones"].includes(s.key))) {
      expect(libraryEpisodes(show, { language: "polish" })).toHaveLength(
        show.episodes.length,
      );
      expect(libraryEpisodes(show, { language: "fandub" })).toHaveLength(0);
      expect(
        show.episodes.every(
          (e) => polishKind(e) === "official" && e.polishAudio.length === 0,
        ),
      ).toBe(true);
    }
  });
  it("keeps age-restricted Polish uploads external rather than promising playback", () => {
    expect(audioSource(ep(2, 1), "pl").externalOnly).toBe(true);
  });
});
