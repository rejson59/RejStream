// Editorial Polish translations, not claimed to be distributor/fandub titles.
const polish = {
  "Mission: Antarctica": "Misja: Antarktyda",
  "Mission: Orphan Time": "Misja: Czas sierot",
  "Mission: Bad Drivezo": "Misja: Drogowy wariat",
  "Mission: Whacked Off": "Misja: Mafijne porachunki",
  "Mission: Big Boss": "Misja: Wielka szycha",
  "Mission: Bigfoot": "Misja: Wielka Stopa",
  "Mission: It's Chaz Funeral": "Misja: Pogrzeb Chaza",
  "Barbie's Bad Day": "Zły dzień Barbie",
  "IMP Training Video": "Film szkoleniowy I.M.P.",
  "Mission: Book Report": "Misja: Powieściowy raport",
  "The Princess & the Pupper": "Księżniczka i psinka",
  "Murder Family": "Mordercza rodzinka",
  "Loo Loo Land": "Kraina Loo Loo",
  "Spring Broken": "Wiosenne rozstanie",
  "C.H.E.R.U.B.": "Cherubiny",
  "The Harvest Moon Festival": "Święto Księżyca Żniw",
  "Truth Seekers": "Poszukiwacze prawdy",
  "Ozzie’s": "U Ozziego",
  "Queen Bee": "Królowa roju",
  "The Circus": "Cyrk",
  "Seeing Stars": "Patrząc w gwiazdy",
  "Exes and Oohs": "Byli i westchnienia",
  "Western Energy": "Dzika energia Zachodu",
  "Unhappy Campers": "Nieszczęśliwi obozowicze",
  Oops: "Ups",
  "Mammon’s Magnificent Musical Mid-Season Special":
    "Wspaniały muzyczny odcinek specjalny Mammona",
  "The Full Moon": "Pełnia księżyca",
  "Apology Tour": "Trasa przeprosin",
  "Ghostf**kers": "Pieprzone duchy",
  Mastermind: "Mózg operacji",
  Sinsmas: "Grzeszne Święta",
  "Turtle Emoji": "Żółwiowe emoji",
  "Bad Reputation": "Zła reputacja",
  "Gimpy Gimpy": "Gimpy razy dwa",
  "A Trial of Errors": "Proces pełen błędów",
  "The Auction": "Aukcja",
  "Pilot (2019)": "Odcinek pilotowy (2019)",
  "Mission: Zero": "Misja: Zero",
  "Hell’s Belles": "Piekielne piękności",
  "Mission: Weeaboo-boo": "Misja: Mangowa wpadka",
  "Mission: Chupacabras": "Misja: Chupacabry",
  PILOT: "Pilot",
  "Candy Carrier Chaos!": "Cukierkowy konwój chaosu!",
  "The Mystery of Mildenhall Manor": "Tajemnica posiadłości Mildenhall",
  "Fast Food Masquerade": "Fastfoodowa maskarada",
  Untitled: "Bez tytułu",
  "They All Get Guns": "Wszyscy dostają broń",
  "Beach Episode": "Odcinek na plaży",
  hjsakldfhl: "Tytuł nie do wymówienia",
  Remember: "Pamiętaj",
};
export function localizeEpisodeTitles(shows) {
  for (const show of shows) {
    if (show.key === "drones") continue;
    for (const ep of show.episodes) {
      const original = ep.originalTitle || ep.title;
      if (!polish[original]) continue;
      ep.originalTitle = original;
      ep.polishTitle = polish[original];
      ep.titleTranslation = "editorial";
      ep.title = `${ep.polishTitle} / ${original}`;
    }
  }
}
