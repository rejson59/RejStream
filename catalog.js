// Sources and verification notes: SOURCES.md. Null IDs deliberately mean external-only.
const episode = (season, number, title, id, minutes, desc, pl) => ({
  season,
  number,
  title,
  id,
  time: `${minutes} min`,
  desc,
  pl,
});
export const helluvaEpisodes = [
  episode(
    1,
    1,
    "Murder Family",
    "el_PChGfJN8",
    13,
    "Pierwsze zlecenie, rodzinne sekrety i kompletny chaos.",
    "4DjfKP5w8Ps",
  ),
  episode(
    1,
    2,
    "Loo Loo Land",
    "kpnwRg268FQ",
    16,
    "Rodzinna wycieczka do parku rozrywki z ekipą I.M.P.",
  ),
  episode(
    1,
    3,
    "Spring Broken",
    "RghsgkZKedg",
    17,
    "Powrót byłej dziewczyny Blitzø kończy się rywalizacją.",
  ),
  episode(
    1,
    4,
    "C.H.E.R.U.B.",
    "1ZFseYPmkAk",
    15,
    "Anielska konkurencja wkracza do akcji.",
  ),
  episode(
    1,
    5,
    "The Harvest Moon Festival",
    "h2ZmVAdezF8",
    18,
    "Święto w Kręgu Gniewu i spotkanie ze Strikerem.",
  ),
  episode(
    1,
    6,
    "Truth Seekers",
    "yXErLiSbxXQ",
    22,
    "Blitzø i Moxxie wpadają w ręce łowców demonów.",
  ),
  episode(
    1,
    7,
    "Ozzie’s",
    "8zyGQquL8VM",
    17,
    "Wieczór w klubie Asmodeusza nie idzie zgodnie z planem.",
  ),
  episode(
    1,
    8,
    "Queen Bee",
    "D-2799Y07Zc",
    16,
    "Loona i Blitzø trafiają na piekielnie głośną imprezę.",
  ),
  episode(
    2,
    1,
    "The Circus",
    "_spuxXnul0U",
    23,
    "Powrót do dzieciństwa Stolasa i Blitzø.",
  ),
  episode(
    2,
    2,
    "Seeing Stars",
    "4J0xFUyz1nw",
    21,
    "Octavia zabiera grymuar i wyrusza do Los Angeles.",
  ),
  episode(
    2,
    3,
    "Exes and Oohs",
    "j1BfO7VlIw4",
    25,
    "Moxxie wraca do rodzinnego domu i swojej przeszłości.",
  ),
  episode(
    2,
    4,
    "Western Energy",
    "KJy7T24rhg0",
    19,
    "Stolas zostaje porwany. Ekipa rusza na ratunek.",
  ),
  episode(
    2,
    5,
    "Unhappy Campers",
    "lYu1ysDULwA",
    21,
    "Moxxie po raz pierwszy samodzielnie prowadzi misję.",
  ),
  episode(
    2,
    6,
    "Oops",
    "y1sF6ZeASU0",
    27,
    "Blitzø i Fizzarolli muszą wspólnie wydostać się z pułapki.",
  ),
  episode(
    2,
    7,
    "Mammon’s Magnificent Musical Mid-Season Special",
    "rRymSi8SmqA",
    30,
    "Fizzarolli staje na scenie konkursu organizowanego przez Mammona.",
  ),
  episode(
    2,
    8,
    "The Full Moon",
    "Fj9YRsV1pEw",
    23,
    "Spotkanie podczas pełni zmienia relację Blitzø i Stolasa.",
  ),
  episode(
    2,
    9,
    "Apology Tour",
    "tLD-OUkYtk4",
    22,
    "Nie każdą relację da się naprawić jednym przepraszam.",
  ),
  episode(
    2,
    10,
    "Ghostf**kers",
    "5DV4IIKwqRI",
    27,
    "Hotel, duchy i misja, która szybko staje się osobista.",
  ),
  episode(
    2,
    11,
    "Mastermind",
    "IoVB5Hn2m_k",
    22,
    "I.M.P. staje przed sądem, a stawka nigdy nie była wyższa.",
  ),
  episode(
    2,
    12,
    "Sinsmas",
    "GisSNuVpbkM",
    29,
    "Świąteczny finał drugiego sezonu.",
  ),
  ...[
    "Turtle Emoji",
    "Bad Reputation",
    "Gimpy Gimpy",
    "A Trial of Errors",
    "The Auction",
  ].map((title, i) => ({
    ...episode(
      3,
      i + 1,
      title,
      null,
      "—",
      "Odcinek katalogowy. Sprawdź dostępność i języki w Prime Video.",
    ),
    time: "Prime Video",
    external:
      "https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Helluva%20Boss",
  })),
  episode(
    "special",
    1,
    "Pilot (2019)",
    "OlahNrlcgS4",
    11,
    "Oryginalny pilot; osobny od aktualnego kanonu.",
    "Fv8Zld0d_Qg",
  ),
  episode(
    "special",
    2,
    "Mission: Zero",
    "Pu12or7uOHE",
    26,
    "Nowy punkt startowy historii I.M.P.",
  ),
  episode(
    "shorts",
    1,
    "Hell’s Belles",
    "_38dtqdR5V4",
    5,
    "Krótka historia z piekielnego uniwersum.",
  ),
  episode(
    "shorts",
    3,
    "Mission: Weeaboo-boo",
    "3-NrCcr8Bcg",
    4,
    "Krótka misja I.M.P.",
  ),
  episode(
    "shorts",
    4,
    "Mission: Chupacabras",
    "pngogrW4iC4",
    4,
    "Kolejne nietypowe zlecenie.",
  ),
];
export function selectEpisodes({
  season = "all",
  query = "",
  filter = "all",
  savedOnly = false,
  saved = false,
} = {}) {
  if (savedOnly && !saved) return [];
  return helluvaEpisodes.filter(
    (e) =>
      (season === "all" || String(e.season) === String(season)) &&
      `helluva boss ${e.title}`
        .toLocaleLowerCase("pl")
        .includes(query.toLocaleLowerCase("pl")) &&
      (filter !== "pl" || !!e.pl),
  );
}
export function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

export const circusEpisodes = [
  [
    "PILOT",
    "HwAPLk_sQ3w",
    "2023-10-13",
    "26 min",
    "Pomni zakłada tajemniczy zestaw słuchawkowy. Witaj w cyrku, z którego nie ma wyjścia.",
  ],
  [
    "Candy Carrier Chaos!",
    "4ofJpOEXrZs",
    "2024-05-03",
    "25 min",
    "Słodkie królestwo, niebezpieczny konwój i przygoda, która zostawia ślad.",
  ],
  [
    "The Mystery of Mildenhall Manor",
    "bKjfw77cxeQ",
    "2024-10-04",
    "25 min",
    "Nawiedzona posiadłość skrywa coś więcej niż kolejną zagadkę Caine’a.",
  ],
  [
    "Fast Food Masquerade",
    "Q9KWcWKo2T8",
    "2024-12-13",
    "23 min",
    "Zmiana w Spudsy’s. Uśmiech do klienta obowiązkowy, nawet kiedy wszystko się sypie.",
  ],
  [
    "Untitled",
    "L4p2gN2CzsA",
    "2025-06-20",
    "26 min",
    "Kilka pomysłów na przygodę i ani chwili na nudę.",
  ],
  [
    "They All Get Guns",
    "mOvhHim78YA",
    "2025-08-15",
    "34 min",
    "Caine stawia na współpracę. I broń. Co mogłoby pójść nie tak?",
  ],
  [
    "Beach Episode",
    "oaOG1xOk7XY",
    "2025-12-12",
    "33 min",
    "Wypad nad cyfrowe jezioro okazuje się czymś więcej niż dniem wolnym.",
  ],
  [
    "hjsakldfhl",
    "DMNlzf8PiEM",
    "2026-03-20",
    "32 min",
    "Granice cyfrowego świata zaczynają pękać.",
  ],
  [
    "Remember",
    "PVy-bcTsO8A",
    "2026-06-19",
    "58 min",
    "Finał historii Pomni i mieszkańców cyfrowego cyrku.",
  ],
].map(([title, id, date, time, desc], i) => ({
  season: 1,
  number: i + 1,
  title,
  id,
  date,
  time,
  desc,
}));
export const series = [
  {
    key: "circus",
    title: "The Amazing Digital Circus",
    short: "Digital Circus",
    subtitle: "Obłędny Cyfrowy Cyrk",
    creator: "GLITCH · Gooseworx",
    year: "2023–2026",
    age: "13+",
    genre: "Surrealistyczna przygoda",
    color: "#a28cff",
    art: "HwAPLk_sQ3w",
    hero: "4ofJpOEXrZs",
    label: "CAŁY SEZON W KATALOGU",
    description:
      "Kolorowy świat. Niepokojące zasady. Żadnego wyjścia. Poznaj Pomni i ekipę uwięzioną w cyfrowym cyrku, gdzie każda przygoda jest odrobinę zbyt prawdziwa.",
    episodes: circusEpisodes,
    seasons: [
      { key: "1", label: "Sezon 1", note: "9 odcinków · od pilota do finału" },
    ],
    languageNote:
      "Wersje językowe, w tym polską, wybierzesz w ustawieniach YouTube → Ścieżka dźwiękowa. Napisy: Ustawienia → Napisy. Dostępność może różnić się między odcinkami i regionami.",
    channel: "https://www.youtube.com/@GLITCH",
    complete: true,
  },
  {
    key: "helluva",
    title: "Helluva Boss",
    short: "Helluva Boss",
    subtitle: "Piekielnie dobra robota.",
    creator: "SpindleHorse · Vivienne Medrano",
    year: "2019–",
    age: "18+",
    genre: "Czarna komedia",
    color: "#ff536c",
    art: "kpnwRg268FQ",
    hero: "kpnwRg268FQ",
    label: "SEZONY 1–2 + DODATKI",
    description:
      "Zlecenia z piekła rodem. Dosłownie. Blitzø i jego ekipa I.M.P. udowadniają, że prowadzenie firmy jest trudniejsze niż sama robota.",
    episodes: helluvaEpisodes,
    seasons: [
      { key: "1", label: "Sezon 1", note: "8 odcinków" },
      { key: "2", label: "Sezon 2", note: "12 odcinków" },
      {
        key: "3",
        label: "Sezon 3",
        note: "5 wpisów · tylko Prime Video · wybór, nie pełny sezon",
      },
      { key: "special", label: "Piloty", note: "Pilot 2019 i Mission: Zero" },
      {
        key: "shorts",
        label: "Shorts",
        note: "3 wybrane krótkie odcinki · lista niepełna",
      },
    ],
    languageNote:
      "Znalezione polskie fanduby: pilot 2019 i S1E1. To wersje nieoficjalne, nie dubbing całego serialu. Pozostałe ścieżki i napisy zależą od źródła.",
    channel: "https://www.youtube.com/@SpindleHorse",
  },
  {
    key: "drones",
    title: "Murder Drones",
    short: "Murder Drones",
    subtitle: "Przetrwanie to dopiero początek.",
    creator: "GLITCH · Liam Vickers",
    year: "2021",
    age: "16+",
    genre: "Science fiction · horror",
    color: "#e1b359",
    art: "mImFz8mkaHo",
    hero: "mImFz8mkaHo",
    label: "NA DOBRY POCZĄTEK · PILOT",
    description:
      "Zbuntowana robotka, opuszczona planeta i wyjątkowo zabójczy gość. Zajrzyj do mrocznego świata Murder Drones.",
    episodes: [
      {
        season: 1,
        number: 1,
        title: "PILOT",
        id: "mImFz8mkaHo",
        date: "2021-10-29",
        time: "27 min",
        desc: "Poznaj Uzi i N w pierwszym odcinku serialu GLITCH.",
      },
    ],
    seasons: [
      {
        key: "1",
        label: "Sezon 1",
        note: "W katalogu tylko pilot — to nie jest pełny sezon",
      },
    ],
    languageNote:
      "Ścieżki audio i napisy udostępnia autor w ustawieniach odtwarzacza. Nie potwierdzamy polskiego dubbingu dla tego wpisu.",
    channel: "https://www.youtube.com/@GLITCH",
  },
];
export function getSeries(key) {
  return series.find((s) => s.key === key);
}
export function episodeKey(show, ep) {
  return `${show}:${ep.season}:${ep.number}`;
}
export function libraryEpisodes(
  show,
  {
    season = "1",
    sort = "asc",
    query = "",
    language = "all",
    watchedOnly = false,
    watched = [],
  } = {},
) {
  const result = show.episodes.filter(
    (e) =>
      String(e.season) === String(season) &&
      e.title.toLocaleLowerCase("pl").includes(query.toLocaleLowerCase("pl")) &&
      (language !== "fandub" || !!e.pl) &&
      (!watchedOnly || watched.includes(episodeKey(show.key, e))),
  );
  return result.sort((a, b) =>
    sort === "desc" ? b.number - a.number : a.number - b.number,
  );
}
