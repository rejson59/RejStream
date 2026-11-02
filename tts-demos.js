// Demo polskich napisów TTS dla Calling All Villains Pilot
// To jest proof-of-concept — prawdziwe napisy byłyby dodawane przez społeczność

export const ttsDemos = {
  "calling-all-villains": {
    1: {
      1: [
        { start: 0, end: 3.5, text: "Witajcie z powrotem w moim świecie." },
        { start: 4, end: 7, text: "Tak, wiem, minęło trochę czasu." },
        { start: 7.5, end: 11, text: "Ale jestem tutaj i mam nowy plan." },
        { start: 12, end: 15.5, text: "Byłem złoczyńcą. Jestem złoczyńcą." },
        { start: 16, end: 19, text: "Ale teraz jestem kimś więcej." },
        { start: 20, end: 23.5, text: "Nazywam się Pan Puzzles." },
        { start: 24, end: 27, text: "I to jest moja historia." },
        { start: 28, end: 31, text: "Zaczęło się od telewizora." },
        { start: 32, end: 35.5, text: "Mały ekran, wielkie możliwości." },
        { start: 36, end: 39, text: "Każdy program, każda reklama." },
        { start: 40, end: 43, text: "Wszystko było pod moją kontrolą." },
        { start: 44, end: 47.5, text: "Ale potem pojawił się on." },
        { start: 48, end: 51, text: "Mario. Ten irytujący hydraulik." },
        { start: 52, end: 55, text: "Myślał że może mnie pokonać." },
        { start: 56, end: 59, text: "Myślał że może zniszczyć mój świat." },
        { start: 60, end: 63, text: "Ale ja jestem niezniszczalny." },
        { start: 64, end: 67, text: "Jestem ideą. Jestem koncepcją." },
        { start: 68, end: 71, text: "Jestem telewizją samą w sobie." },
      ],
    },
  },
};

// Funkcja pomocnicza do pobierania napisów dla konkretnego odcinka
export function getTTSCues(seriesKey, season, episode) {
  const series = ttsDemos[seriesKey];
  if (!series) return null;
  
  const seasons = series[season];
  if (!seasons) return null;
  
  return seasons[episode] || null;
}

// Sprawdź czy demo TTS jest dostępne dla danego odcinka
export function hasTTSDemo(seriesKey, season, episode) {
  return getTTSCues(seriesKey, season, episode) !== null;
}
