// Research log and limitations: SOURCES.md. IDs refer to creators' uploads, never rehosts.
const creators = {
  vox: ["VOX record", "VOXrecord"],
  pawlik: ["Pawlikowe Fanduby", "PawlikoweFanduby"],
  serhiej: ["Serhiej", "serhiejpl3321"],
  hells: ["HellsBroadcastStudio", "HellsBroadcastStudio"],
  brudolina: ["BruDolina Studios", "BruDolinaStudios"],
  unima: ["Dubbing Unima (Archiwum)", "Springbon_"],
  zacisze: ["Głośne Zacisze", "Glosne_Zacisze"],
  nanokarrin: ["NanoKarrin", "fandubbing"],
  keisuken: ["Keisuken", "Keisuken01"],
};
const source = (video, creator, kind = "fandub", externalOnly = false) => ({
  video,
  creator: creators[creator][0],
  channel: `https://www.youtube.com/@${creators[creator][1]}`,
  kind,
  externalOnly,
  checked: "2026-10-25",
});
export const helluvaPolishAudio = {
  "special:1": [source("ASibgNCZX3A", "brudolina")],
  "1:1": [
    source("4DjfKP5w8Ps", "nanokarrin"),
    source("QxXceYy-tbw", "brudolina"),
  ],
  "1:2": [source("jamGQ6oBo4w", "brudolina")],
  "1:3": [source("KqcHS-8YGEs", "brudolina")],
  "1:4": [source("F-MT37XoLyM", "brudolina")],
  "1:5": [source("dVSUDN4xD-4", "brudolina")],
  "1:6": [source("lNzXbM_lobc", "brudolina")],
  "1:7": [source("_t5pqlOqV3k", "brudolina")],
  "1:8": [source("iy5ArFC19lM", "brudolina")],
  // This upload explicitly requires YouTube age verification; do not promise an embed.
  "2:1": [source("SL6o757ljFM", "zacisze", "fandub", true)],
  "2:2": [source("9YvbfmfQTSY", "keisuken", "lektor")],
  "2:3": [source("kxcNb4GMNnE", "unima")],
  "2:4": [source("8giJehn0ud0", "unima")],
  "2:5": [source("orRKmifJWuY", "unima")],
  "2:7": [source("k29-gtuk_WQ", "unima")],
  "2:8": [source("XdK2NVnO7O0", "unima")],
  "2:9": [source("_XSTzYcOzD0", "unima")],
  "2:10": [source("HOQNnOJA-Dk", "unima")],
  "2:11": [source("swmSHRqLnEI", "unima")],
  "shorts:1": [source("g9Yyom9CcW8", "brudolina")],
  "shorts:2": [source("6UpLvD-5TOI", "unima")],
  "shorts:3": [source("G5_cxsKSN2Y", "unima")],
  "shorts:4": [source("7bkMzT8h5jE", "unima")],
};
export const metalFamilyPolishAudio = Object.fromEntries(
  ["Tis9tqJb4qA", "8LnhHwLaz60", "8K-soD5rU6Y", "F16yMJXM4vY", "vLFA51fD5fk"]
    .map((id, i) => [`1:${i + 1}`, [source(id, "brudolina")]]),
);
Object.assign(metalFamilyPolishAudio, {
  "1:7": [source("frbUzuwa6fU", "serhiej")],
  "1:8": [source("ZUWca9_fDJQ", "serhiej")],
  "1:9": [source("ScYy3QZIRHU", "serhiej")],
  "2:6": [source("ZgDr_d7gc_k", "hells")],
});
export const lackadaisyPolishAudio = {
  "1:1": [source("TOu1f4fnhDs", "vox")],
  "shorts:4": [source("hCDXd3a-tyM", "pawlik")],
};
export function addPolishAudio(shows) {
  for (const show of shows) {
    for (const ep of show.episodes) {
      ep.polishAudio =
        show.key === "helluva"
          ? helluvaPolishAudio[`${ep.season}:${ep.number}`] || []
          : show.key === "metal-family"
            ? metalFamilyPolishAudio[`${ep.season}:${ep.number}`] || []
            : show.key === "lackadaisy"
              ? lackadaisyPolishAudio[`${ep.season}:${ep.number}`] || []
              : [];
      // Keep the legacy fandub field accurate for existing catalog consumers.
      ep.pl = ep.polishAudio.find((s) => s.kind === "fandub")?.video;
      ep.polishTrack = ["circus", "drones", "gameoverse"].includes(show.key);
    }
  }
}
export function polishKind(ep) {
  if (ep.polishTrack || ep.polishInline) return "official";
  if (ep.polishAudio?.some((s) => s.kind === "fandub")) return "fandub";
  if (ep.polishAudio?.some((s) => s.kind === "lektor")) return "lektor";
  return "missing";
}
export function polishLabel(ep) {
  return {
    official: "PL DUBBING",
    fandub: "PL FANDUB",
    lektor: "PL LEKTOR",
    missing: "PL · BRAK POTWIERDZENIA",
  }[polishKind(ep)];
}
export function audioSource(ep, value) {
  if (value === "pl") return ep.polishAudio?.[0];
  if (value?.startsWith("pl:"))
    return ep.polishAudio?.find((s) => s.video === value.slice(3));
  return undefined;
}
