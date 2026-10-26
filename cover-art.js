// Series-level promotional art, separate from episode/video thumbnails.
// Provenance in SOURCES.md. GLITCH graphics come from its official show directory.
const wix = (file) => `https://static.wixstatic.com/media/${file}`;
export const coverArt = {
  circus: { src: wix("84ed6a_caa6001a446749c3b2f9598a1536b260~mv2.png/v1/fill/w_379,h_440,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/bg-char-19.png"), source: "https://www.glitchprod.com/our-shows", kind: "character" },
  helluva: { src: "./covers/helluva.jpg", source: "https://tvtropes.org/pmwiki/pmwiki.php/WebAnimation/HelluvaBoss", kind: "poster" },
  "metal-family": { src: "https://i.ytimg.com/vi/UHOIUzk6XF8/maxresdefault.jpg", source: "https://www.youtube.com/watch?v=UHOIUzk6XF8", kind: "promo" },
  gameoverse: { src: wix("b48361_548ccfa0602743059b02ede55fe9e578~mv2.png/v1/fill/w_379,h_440,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/kit-b2.png"), source: "https://www.glitchprod.com/our-shows", kind: "character" },
  drones: { src: wix("84ed6a_dbf3d54a3fda46be87d455eba6e5b907~mv2.png/v1/fill/w_379,h_440,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/bg-char-19.png"), source: "https://www.glitchprod.com/our-shows", kind: "character" },
  lackadaisy: { src: wix("1d8dbc_e3eb72d2c11f43ba9635f571d19f9468~mv2.png/v1/fill/w_379,h_440,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/rocky.png"), source: "https://www.glitchprod.com/our-shows", kind: "character" },
  "meta-runner": { src: wix("84ed6a_0de3782d523e4190a2f326bc64a4b127~mv2.png/v1/fill/w_379,h_440,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/bg-char-22.png"), source: "https://www.glitchprod.com/our-shows", kind: "character" },
};
