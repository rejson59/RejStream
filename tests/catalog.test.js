import { describe, it, expect } from "vitest";
import { helluvaEpisodes, selectEpisodes, escapeHTML } from "../catalog.js";
import { srtToVtt } from "../native-player.js";
describe("catalog", () => {
  it("has complete first and second seasons in order", () => {
    for (const [season, total] of [
      [1, 8],
      [2, 12],
    ]) {
      const items = selectEpisodes({ season });
      expect(items).toHaveLength(total);
      expect(items.map((e) => e.number)).toEqual(
        Array.from({ length: total }, (_, i) => i + 1),
      );
      expect(items.every((e) => /^[\w-]{11}$/.test(e.id))).toBe(true);
    }
  });
  it("combines search, season, saved and Polish filters", () => {
    expect(
      selectEpisodes({ season: 2, query: "seeing" }).map((e) => e.title),
    ).toEqual(["Patrząc w gwiazdy / Seeing Stars"]);
    expect(selectEpisodes({ season: 2, filter: "pl" })).toHaveLength(9);
    expect(
      selectEpisodes({ season: 1, filter: "pl" }).map((e) => e.number),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(selectEpisodes({ savedOnly: true, saved: false })).toHaveLength(0);
    expect(selectEpisodes({ savedOnly: true, saved: true })).toHaveLength(
      helluvaEpisodes.length,
    );
  });
  it("does not pretend external entries are streamable", () =>
    expect(
      selectEpisodes({ season: 3 }).every(
        (e) => !e.id && e.external.startsWith("https://www.primevideo.com/"),
      ),
    ).toBe(true));
  it("escapes filenames and metadata", () =>
    expect(escapeHTML('<img onerror="x">')).toBe(
      "&lt;img onerror=&quot;x&quot;&gt;",
    ));
  it("converts SRT timestamps and BOM", () =>
    expect(srtToVtt("\uFEFF1\r\n00:00:01,250 --> 00:00:03,000\r\nTest")).toBe(
      "WEBVTT\n\n1\n00:00:01.250 --> 00:00:03.000\nTest",
    ));
});

import {
  series,
  circusEpisodes,
  getSeries,
  libraryEpisodes,
  episodeKey,
} from "../catalog.js";
describe("series library", () => {
  it("contains a single complete Circus season of nine sequential official IDs", () => {
    expect(circusEpisodes).toHaveLength(9);
    expect(circusEpisodes.map((e) => e.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
    expect(
      circusEpisodes.every((e) => e.season === 1 && /^[\w-]{11}$/.test(e.id)),
    ).toBe(true);
    expect(new Set(circusEpisodes.map((e) => e.id)).size).toBe(9);
    expect(getSeries("circus").seasons).toHaveLength(1);
  });
  it("has no removed open movie and explicitly labels a partial Drones collection", () => {
    expect(series.map((s) => s.key)).toEqual(["circus", "helluva", "drones"]);
    expect(getSeries("drones").episodes).toHaveLength(8);
    expect(getSeries("drones").episodes.map((e) => e.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);
  });
  it("sorts numerically and combines query, watched status and season", () => {
    const show = getSeries("circus");
    expect(libraryEpisodes(show, { sort: "desc" })[0].number).toBe(9);
    expect(
      libraryEpisodes(show, { query: "mildenhall" }).map((e) => e.number),
    ).toEqual([3]);
    expect(
      libraryEpisodes(show, {
        watchedOnly: true,
        watched: [episodeKey("circus", circusEpisodes[2])],
      }).map((e) => e.number),
    ).toEqual([3]);
    expect(libraryEpisodes(getSeries("helluva"), { season: 2 })).toHaveLength(
      12,
    );
  });
  it("uses stable unique keys across all episodes and separates specials", () => {
    for (const show of series) {
      const keys = show.episodes.map((e) => episodeKey(show.key, e));
      expect(new Set(keys).size).toBe(keys.length);
    }
    expect(episodeKey("helluva", { season: "special", number: 1 })).not.toBe(
      episodeKey("helluva", { season: 1, number: 1 }),
    );
  });
});

it("gives every Circus and Helluva entry an editorial Polish title without losing original search", () => {
  for (const key of ["circus", "helluva"]) {
    const show = getSeries(key);
    for (const ep of show.episodes) {
      expect(ep.polishTitle).toBeTruthy();
      expect(ep.originalTitle).toBeTruthy();
      expect(ep.title).toBe(`${ep.polishTitle} / ${ep.originalTitle}`);
      expect(ep.titleTranslation).toBe("editorial");
      for (const query of [ep.polishTitle, ep.originalTitle]) {
        expect(
          libraryEpisodes(show, { season: String(ep.season), query }),
        ).toContain(ep);
      }
    }
  }
});
