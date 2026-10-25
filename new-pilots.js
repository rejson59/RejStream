// Official creator uploads checked 2026-10-25; see SOURCES.md.
const episode = (season, number, id, time, polishTitle, originalTitle, desc) => ({
  season, number, id, time, polishTitle, originalTitle, titleTranslation: "editorial",
  title: `${polishTitle} / ${originalTitle}`, desc,
});
export const lackadaisy = {
  key: "lackadaisy", title: "Lackadaisy", short: "Lackadaisy",
  subtitle: "Koty, jazz i przemyt w czasach prohibicji.",
  creator: "Tracy Butler · Iron Circus Animation", year: "2023–",
  age: "Dla starszych widzów", genre: "Kryminał · czarna komedia · jazz",
  color: "#d8ae68", art: "vffu6FG4YP4", hero: "vffu6FG4YP4",
  label: "PILOT + WYBRANE KRÓTKIE ANIMACJE", cardBadge: "PILOT + 5 KRÓTKICH ANIMACJI",
  description: "St. Louis, prohibicja i podziemny lokal, którego kocia ekipa walczy o przetrwanie wśród przemytników. Zacznij od pełnego pilota, potem poznaj krótkie historie bohaterów. To pilot i dodatki — nie kompletny sezon serialu.",
  availabilityNote: "Dostępne: pilot i 5 wybranych krótkich animacji. Pełny sezon 1 jest w produkcji; nie dodajemy zapowiedzi jako odcinków.",
  catalogNote: "Stan na 25.10.2026: pilot (27:35) oraz wybrane Ingenue, Breakthrough, Naptime Rag, Stratagem i Infestation. To nie pełny sezon ani komplet wszystkich filmów kanału. Pomijamy teledyski, pętle, zwiastuny, fragmenty i materiały produkcyjne.",
  languageNote: "Oryginalne audio angielskie. Nie potwierdzono dostępnego pełnego polskiego dubbingu do tych materiałów. Napisy PL są preferencją, nie gwarancją — sprawdź ustawienia źródła.",
  channel: "https://www.youtube.com/@LackadaisyComic",
  episodes: [
    episode(1, 1, "vffu6FG4YP4", "27:35", "Pilot", "Pilot", "Pełny odcinek pilotażowy z oficjalnego kanału Lackadaisy. Wprowadzenie do świata kocich przemytników; nie odcinek pełnego sezonu 1."),
    episode("shorts", 1, "GqkUy8M-GfQ", "5:17", "Debiutantka", "Ingenue", "Oficjalny mini-odcinek. Dodatek do świata Lackadaisy, nie regularny odcinek sezonu."),
    episode("shorts", 2, "KcTJynGpWgI", "0:45", "Przełom", "Breakthrough", "Krótka animacja z oficjalnego kanału Lackadaisy."),
    episode("shorts", 3, "59VoZIe9tzE", "1:00", "Pora na drzemkę", "Naptime Rag", "Krótka winieta z oficjalnego kanału Lackadaisy."),
    episode("shorts", 4, "IvuuHLoYomk", "1:38", "Fortel", "Stratagem", "Krótka animacja z oficjalnego kanału Lackadaisy."),
    episode("shorts", 5, "2p4OX9-YXVk", "1:04", "Inwazja", "Infestation", "Krótka animacja z oficjalnego kanału Lackadaisy."),
  ],
  seasons: [
    { key: "1", label: "Pilot", note: "1 pełny pilot · to nie sezon 1" },
    { key: "shorts", label: "Krótkie animacje", note: "5 wybranych dodatków · nie odcinki sezonu" },
  ],
};
export const gameoverse = {
  key: "gameoverse", title: "Gameoverse", short: "Gameoverse",
  subtitle: "Żeby ocalić grę, trzeba pomóc złoczyńcy.",
  creator: "GLITCH · Ross O’Donovan", year: "2026–", age: "Dla starszych widzów",
  genre: "Akcja · przygoda · światy gier", color: "#a28bfa",
  art: "1jNk5tmjhpc", hero: "1jNk5tmjhpc", label: "DOSTĘPNY PILOT · SERIAL W ROZWOJU",
  cardBadge: "1 PILOT · POLSKI DUBBING",
  description: "Gdy bohater wygrywa grę, jej świat eksploduje. Kit i jej ekipa muszą więc ratować złoczyńców, by ocalić mieszkańców wirtualnych planet. Animacja Rossa O’Donovana i GLITCH. Obecnie dostępny jest jeden pełny pilot — nie cały sezon.",
  availabilityNote: "Dostępny 1 pilot (32:26). Kolejne odcinki nie zostały jeszcze opublikowane.",
  catalogNote: "Sprawdzono 25.10.2026: jedyny opublikowany odcinek nowej wersji GLITCH to pilot z 15.05.2026. Nie dodajemy zapowiedzianych odcinków, zwiastunów, reklam ani dawnej wersji z 2009 roku jako ciągu dalszego.",
  languageNote: "Oficjalny polski dubbing BruDolina Studios w materiale GLITCH. Wybierz ⚙ → Ścieżka dźwiękowa → Polski. RejStream nie może automatycznie przełączyć audio YouTube. Napisy PL tylko jeśli źródło je udostępnia.",
  channel: "https://www.youtube.com/@GLITCH",
  episodes: [episode(1, 1, "1jNk5tmjhpc", "32:26", "Pilot", "Pilot", "Kit, Składak i Żarłak próbują ocalić świat gry, w którym zwycięstwo bohatera oznacza zagładę. Pełny pilot z oficjalnego kanału GLITCH.")],
  seasons: [{ key: "1", label: "Pilot", note: "1 opublikowany pilot · pełny sezon jeszcze niedostępny" }],
};
