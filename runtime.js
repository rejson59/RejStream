// Verified playlist runtimes for Meta Runner; remaining catalog times are
// rounded minutes or mm:ss, so the combined figure is explicitly approximate.
export const metaRunnerTimes = [
  "2:04:22", "13:02", "11:21", "18:47", "18:11", "16:53", "17:58",
  "15:22", "16:56", "15:16", "19:09", "14:30", "11:36", "15:10",
  "14:21", "14:27", "16:32", "15:29", "23:35",
];
export function durationSeconds(value) {
  if (typeof value !== "string") return null;
  if (/^\d+:\d{2}(?::\d{2})?$/.test(value)) {
    const parts = value.split(":").map(Number);
    if (parts.slice(1).some((n) => n >= 60)) return null;
    return parts.reduce((total, n) => total * 60 + n, 0);
  }
  const minutes = value.match(/^(\d+) min$/);
  return minutes ? Number(minutes[1]) * 60 : null;
}
export function runtimeLabel(seconds) {
  const minutes = Math.round(seconds / 60);
  return `${Math.floor(minutes / 60)} godz. ${minutes % 60} min`;
}
export function catalogRuntime(shows, trailerGroups = {}) {
  const seen = new Set();
  let embedded = 0, external = 0, unknown = 0, trailerSeconds = 0;
  const breakdown = shows.map((show) => {
    let seconds = 0;
    for (const ep of show.episodes) {
      const identity = ep.id ? `yt:${ep.id}` : `${show.key}:${ep.season}:${ep.number}`;
      if (seen.has(identity)) continue;
      seen.add(identity);
      const duration = ep.durationSeconds ?? durationSeconds(ep.time);
      if (duration === null) { unknown++; continue; }
      seconds += duration;
      if (ep.id) embedded += duration;
      else external += duration;
    }
    return { key: show.key, title: show.title, seconds };
  });
  for (const show of shows) {
    for (const trailer of Object.values(trailerGroups[show.key] || {})) {
      if (seen.has(`yt:${trailer.id}`)) continue;
      seen.add(`yt:${trailer.id}`);
      const duration = durationSeconds(trailer.duration);
      if (duration === null) { unknown++; continue; }
      trailerSeconds += duration;
    }
  }
  return { seriesCount: shows.length, embedded, external, trailerSeconds,
    total: embedded + external + trailerSeconds, unknown, breakdown };
}
