// Polish-language uploads, not a guessed YouTube audio-track selection. See SOURCES.md.
export const trailers = {
  circus: {
    id: "rrz4UYIs8h4",
    title: "Oficjalny polski zwiastun",
    creator: "BruDolina Studios",
    channel: "https://www.youtube.com/@BruDolinaStudios",
    kind: "official",
    duration: "1:19",
  },
  helluva: {
    id: "DUD6S1XBVUI",
    title: "Zwiastun sezonu 2 · polski fandub",
    creator: "Głośne Zacisze",
    channel: "https://www.youtube.com/@Glosne_Zacisze",
    kind: "fandub",
    duration: "2:13",
  },
  drones: {
    id: "TvayzJG0BS8",
    title: "Polski zwiastun dubbingu",
    creator: "BruDolina Studios",
    channel: "https://www.youtube.com/@BruDolinaStudios",
    kind: "official",
    duration: "1:13",
  },
};
export function embedURL(id, subtitles = "pl") {
  const params = new URLSearchParams({ rel: "0", hl: "pl" });
  if (subtitles) {
    params.set("cc_load_policy", "1");
    params.set("cc_lang_pref", subtitles);
  }
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`;
}
