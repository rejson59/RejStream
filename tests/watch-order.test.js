import { it, expect } from "vitest";
import { series } from "../catalog.js";
import { startEpisode, adjacentEpisodes, watchGuide, watchPath, watchSequence } from "../watch-order.js";
const helluva = series.find((s) => s.key === "helluva");
it("starts Helluva at Mission Zero without renumbering stable episode routes", () => {
 expect(watchPath(helluva)).toBe("watch/helluva/special/2");
 expect(startEpisode(helluva).id).toBe("Pu12or7uOHE");
 expect(watchSequence(helluva).some((e) => e.season === "shorts" || e.season === "special" && e.number === 1)).toBe(false);
});
it("bridges intro and season boundaries in both directions", () => {
 const seq = watchSequence(helluva);
 for (let i = 0; i < seq.length; i++) {
  expect(adjacentEpisodes(helluva, seq[i])).toEqual({ previous: seq[i - 1] || null, next: seq[i + 1] || null });
 }
 expect(adjacentEpisodes(helluva, helluva.episodes.find((e) => e.season === "special" && e.number === 1))).toEqual({previous:null,next:null});
 const shorts = helluva.episodes.filter((e) => e.season === "shorts");
 expect(adjacentEpisodes(helluva, shorts.at(-1)).next).toBeNull();
 expect(adjacentEpisodes(helluva, shorts[0]).next).toBe(shorts[1]);
});
it("offers valid guide links for all shows and preserves integrated pilots", () => {
 for (const show of series) {
  for (const [season, number] of watchGuide(show).steps) expect(show.episodes.some((e) => e.season === season && e.number === number)).toBe(true);
  if (show.key !== "helluva") expect(watchPath(show)).toBe(`watch/${show.key}/1/1`);
 }
 const meta = series.find((s) => s.key === "meta-runner");
 expect(adjacentEpisodes(meta, startEpisode(meta)).next.season).toBe(2);
 expect(watchGuide(meta).note).toContain("nie 10 oryginalnych");
});
