import { it, expect } from "vitest";
import { getSeries, libraryEpisodes } from "../catalog.js";
import { polishKind } from "../polish-audio.js";
import { watchGuide, watchPath, adjacentEpisodes } from "../watch-order.js";
import { catalogRuntime } from "../runtime.js";
it("keeps the Lackadaisy pilot separate from selected shorts, not a complete season", () => {
 const show = getSeries("lackadaisy");
 expect(libraryEpisodes(show)).toHaveLength(1);
 expect(libraryEpisodes(show,{season:"shorts"})).toHaveLength(5);
 expect(show.episodes[0].id).toBe("vffu6FG4YP4");
 expect(show.catalogNote).toContain("nie pełny sezon");
 expect(show.episodes.map((e) => e.id)).not.toContain("BHq4ppmUPsA");
 expect(show.episodes.map((e) => e.id)).not.toContain("b2T3ywJ_y-8");
 expect(show.episodes.every((e) => polishKind(e) === "missing")).toBe(true);
 expect(catalogRuntime([show]).total).toBe(2239);
 expect(adjacentEpisodes(show, show.episodes[0]).next).toBeNull();
});
it("adds only the released Gameoverse pilot with a real Polish track", () => {
 const show = getSeries("gameoverse");
 expect(show.episodes).toHaveLength(1);
 expect(show.episodes[0].id).toBe("1jNk5tmjhpc");
 expect(polishKind(show.episodes[0])).toBe("official");
 expect(show.episodes[0].polishAudio).toEqual([]);
 expect(catalogRuntime([show]).total).toBe(1946);
 expect(watchPath(show)).toBe("watch/gameoverse/1/1");
 expect(watchGuide(show).note).toContain("jedyny opublikowany");
 expect(adjacentEpisodes(show,show.episodes[0])).toEqual({previous:null,next:null});
});
