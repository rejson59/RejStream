import { it, expect } from "vitest";
import { getSeries, libraryEpisodes, episodeKey } from "../catalog.js";
import { polishKind } from "../polish-audio.js";
import { catalogRuntime } from "../runtime.js";
import { watchGuide } from "../watch-order.js";
const show = getSeries("metal-family");
it("adds all 17 verified official episodes in season order with runtimes", () => {
  expect(show.episodes).toHaveLength(17);
  for (const [season, count] of [[1, 10], [2, 7]]) {
    const episodes = libraryEpisodes(show, {season});
    expect(episodes.map((e) => e.number)).toEqual(Array.from({length:count}, (_, i) => i+1));
    for (const e of episodes) {
      expect(e.id).toMatch(/^[\w-]{11}$/);
      expect(e.time).toMatch(/^\d+:\d{2}$/);
      expect(e.title).toBe(`${e.polishTitle} / ${e.originalTitle}`);
      expect(e.titleTranslation).toBe("editorial");
      expect(episodeKey(show.key, e)).toBe(`metal-family:${season}:${e.number}`);
    }
  }
  expect(new Set(show.episodes.map((e) => e.id)).size).toBe(17);
  expect(catalogRuntime([show]).total).toBe(12799);
  expect(catalogRuntime([show]).unknown).toBe(0);
  expect(show.seasons[1].note).toContain("sezon trwa");
  expect(watchGuide(show).note).not.toContain("Pilot jest już odcinkiem 1");
});
it("offers five credited Polish fandubs, not fictional official Polish tracks", () => {
  expect(libraryEpisodes(show,{season:1,language:"fandub"})).toHaveLength(5);
  expect(libraryEpisodes(show,{season:2,language:"polish"})).toEqual([]);
  for (const e of show.episodes) {
    expect(e.polishTrack).toBe(false);
    if (e.season === 1 && e.number <= 5) {
      expect(polishKind(e)).toBe("fandub");
      expect(e.polishAudio[0].creator).toBe("BruDolina Studios");
      expect(e.polishAudio[0].channel).toBe("https://www.youtube.com/@BruDolinaStudios");
    } else expect(polishKind(e)).toBe("missing");
  }
});
