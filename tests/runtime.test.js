import { it, expect } from "vitest";
import { catalogRuntime, durationSeconds, runtimeLabel } from "../runtime.js";
import { series } from "../catalog.js";
import { seasonTrailers } from "../trailers.js";
it("parses supported times without silently treating ranges as exact", () => {
  expect(durationSeconds("2:04:22")).toBe(7462);
  expect(durationSeconds("4:20")).toBe(260);
  expect(durationSeconds("26 min")).toBe(1560);
  for (const value of ["Prime Video", "ok. 12–24 min", "1:99", undefined]) expect(durationSeconds(value)).toBeNull();
  expect(runtimeLabel(3599)).toBe("1 godz. 0 min");
});
it("counts the entire catalog once, separating external episodes and unique trailers", () => {
  const stats = catalogRuntime(series, seasonTrailers);
  expect(stats.seriesCount).toBe(5);
  expect(stats.unknown).toBe(0);
  expect(stats.total).toBe(105343);
  expect(stats.external).toBe(136 * 60);
  expect(stats.trailerSeconds).toBe(416);
  expect(stats.total).toBe(stats.embedded + stats.external + stats.trailerSeconds);
  expect(stats.breakdown.reduce((sum, row) => sum + row.seconds, 0) + stats.trailerSeconds).toBe(stats.total);
});
it("deduplicates uploads and ignores alternate language versions", () => {
 const shows = [{key:"test",title:"Test",episodes:[{id:"one",time:"10 min",polishAudio:[{video:"dub"}]},{id:"one",time:"10 min"}]}];
 expect(catalogRuntime(shows,{test:{1:{id:"two",duration:"1:00"},2:{id:"two",duration:"1:00"}}}).total).toBe(660);
 expect(catalogRuntime([{key:"missing",episodes:[{id:"unknown",time:"unknown"}]}]).unknown).toBe(1);
});
