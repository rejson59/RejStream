// Editorial first-watch recommendations, not an official chronology.
export function watchSequence(show) {
  const numbered = show.episodes.filter((e) => typeof e.season === "number")
    .sort((a, b) => a.season - b.season || a.number - b.number);
  if (show.key !== "helluva") return numbered;
  const intro = show.episodes.find((e) => e.season === "special" && e.number === 2);
  return intro ? [intro, ...numbered] : numbered;
}
export function startEpisode(show) {
  return watchSequence(show)[0] || show.episodes[0];
}
export function watchPath(show, episode = startEpisode(show)) {
  return `watch/${show.key}/${episode.season}/${episode.number}`;
}
export function adjacentEpisodes(show, current) {
  const main = watchSequence(show);
  const sequence = main.includes(current) ? main : show.episodes
    .filter((e) => e.season === current.season && (show.key !== "helluva" || current.season !== "special"))
    .sort((a, b) => a.number - b.number);
  const index = sequence.indexOf(current);
  return { previous: index > 0 ? sequence[index - 1] : null,
    next: index >= 0 ? sequence[index + 1] || null : null };
}
export function watchGuide(show) {
  if (show.key === "helluva") return {
    note: "Propozycja redakcji na pierwszy seans, nie ścisła chronologia wydarzeń. Mission: Zero to nowy punkt wejścia — nie zostawiaj go na koniec sezonów.",
    steps: [
      ["special", 2, "1. Mission: Zero — zacznij tutaj"],
      [1, 1, "2. Sezon 1 → sezon 2"],
      [3, 1, "3. Sezon 3 — tylko Prime Video, sezon trwa"],
      ["shorts", 1, "Dodatek: Shorts — najlepiej po sezonie 2"],
      ["special", 1, "Opcjonalnie: pilot 2019 — starsza wersja poza aktualnym kanonem"],
    ],
  };
  if (show.key === "lackadaisy") return {
    note: "Najpierw pełny pilot, potem opcjonalnie krótkie animacje. Kolejność dodatków jest propozycją redakcji, nie chronologią. Pełny sezon 1 nie jest jeszcze dostępny.",
    steps: [[1, 1, "1. Pilot — zacznij tutaj"], ["shorts", 1, "2. Opcjonalnie: Ingenue i pozostałe krótkie animacje"]],
  };
  if (show.key === "gameoverse") return {
    note: "Zacznij od pilota nowej wersji GLITCH z 2026 roku. Obecnie to jedyny opublikowany odcinek — dalszy sezon jeszcze nie jest dostępny. Nie mieszamy go z dawną wersją z 2009 roku.",
    steps: [[1, 1, "Pilot — jedyny dostępny odcinek"]],
  };
  if (show.key === "metal-family") return {
    note: "Zacznij od sezonu 1, odcinka 1, potem przejdź do sezonu 2. Kolejność numerów to propozycja na pierwszy seans. Prolog/teledysk jest opcjonalnym dodatkiem i nie znajduje się w tym katalogu. Sezon 2 nadal trwa.",
    steps: [[1, 1, "1. Sezon 1 — od odcinka 1 do 10"], [2, 1, "2. Sezon 2 — 7 opublikowanych odcinków"]],
  };
  if (show.key === "meta-runner") return {
    note: "Najpierw poznaj historię Tari z sezonu 1. Mamy jego skrócony Animated Movie Cut, nie 10 oryginalnych odcinków. Następnie oglądaj pełne sezony 2 i 3 po kolei.",
    steps: [[1, 1, "1. Sezon 1 — wersja montażowa"], [2, 1, "2. Sezon 2"], [3, 1, "3. Sezon 3 — finał"]],
  };
  return { note: "Oglądaj w kolejności numerów. Pilot jest już odcinkiem 1 — nie trzeba szukać go w dodatkach.",
    steps: [[1, 1, "Pilot / odcinek 1 → pozostałe odcinki sezonu 1"]] };
}
