import { createProgress, position, formatTime } from "./progress.js";
import { escapeHTML } from "./catalog.js";
export function srtToVtt(text) {
  return (
    "WEBVTT\n\n" +
    text
      .replace(/^\uFEFF/, "")
      .replace(/\r/g, "")
      .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2")
  );
}
const time = (n) =>
  !Number.isFinite(n)
    ? "0:00"
    : `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;
// Local files remain on-device. Every object URL and listener is released on close.
export function mountNativePlayer(
  root,
  { src, title, key, credit = "", license = "", local = false } = {},
) {
  let urls = [],
    disposed = false;
  let tracker = key ? createProgress(key, { label: title }) : null;
  function saveProgress(force = false) {
    return tracker?.sample({
      time: video.currentTime,
      duration: video.duration,
      playing: !video.paused && !video.seeking && !video.ended,
      rate: video.playbackRate,
      ended: video.ended,
      force: force === true,
    });
  }
  const controller = new AbortController();
  const on = (el, event, fn) =>
    el.addEventListener(event, fn, { signal: controller.signal });
  root.innerHTML = `<section class="native-player"><div class="native-screen"><video playsinline preload="metadata" aria-label="${escapeHTML(title)}"></video><button class="big-play" aria-label="Odtwórz">▶</button><div class="video-message" role="status">${local ? "Wybierz plik wideo z urządzenia." : "Ładowanie filmu…"}</div></div><div class="native-controls"><button data-action="play" aria-label="Odtwórz / pauza">▶</button><button data-action="back" aria-label="Cofnij 10 sekund">−10</button><button data-action="forward" aria-label="Przewiń 10 sekund">+10</button><output class="native-time">0:00 / 0:00</output><input class="native-seek" type="range" min="0" max="100" step="0.1" value="0" aria-label="Pozycja odtwarzania"><button data-action="mute" aria-label="Wycisz / włącz dźwięk">♪</button><input class="native-volume" type="range" min="0" max="1" step="0.05" value="1" aria-label="Głośność"><select class="native-speed" aria-label="Prędkość odtwarzania"><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select><button data-action="fullscreen" aria-label="Pełny ekran">⛶</button></div><div class="native-options">${local ? '<label class="file-button">Otwórz wideo<input type="file" class="local-video" accept="video/*,.mkv"></label>' : ""}<label class="file-button">Dodaj napisy VTT / SRT<input type="file" class="local-subs" accept=".vtt,.srt" multiple></label><select class="native-captions" aria-label="Ścieżka napisów"><option value="off">Napisy wyłączone</option></select><span class="resume-note"></span></div><p class="player-note">${local ? "Plik nie jest wysyłany na serwer. Format i kodek muszą być obsługiwane przez przeglądarkę. Aby użyć innego dubbingu, otwórz osobny plik wideo z tą wersją audio." : "Własny odtwarzacz HTML5 · oryginalna ścieżka audio. Napisy możesz dodać z urządzenia."} Skróty po kliknięciu playera: spacja / K — pauza, ← / → — 10 s, M — dźwięk, F — pełny ekran.</p>${credit ? `<p class="player-note">${escapeHTML(credit)} <a href="${license}" target="_blank" rel="noopener">Licencja i autorzy ↗</a></p>` : ""}</section>`;
  const player = root.querySelector(".native-player"),
    video = root.querySelector("video"),
    message = root.querySelector(".video-message"),
    seek = root.querySelector(".native-seek"),
    play = root.querySelector('[data-action="play"]'),
    big = root.querySelector(".big-play"),
    captions = root.querySelector(".native-captions"),
    note = root.querySelector(".resume-note");
  player.tabIndex = 0;
  const status = (t) => {
    message.textContent = t;
    message.hidden = !t;
  };
  function setSource(url) {
    video.pause();
    video.src = url;
    video.load();
    status("Ładowanie filmu…");
  }
  function toggle() {
    if (!video.src) return;
    if (video.paused)
      video
        .play()
        .catch(() =>
          status(
            "Nie można rozpocząć odtwarzania. Sprawdź plik lub spróbuj ponownie.",
          ),
        );
    else video.pause();
  }
  function skip(n) {
    if (Number.isFinite(video.duration))
      video.currentTime = Math.max(
        0,
        Math.min(video.duration, video.currentTime + n),
      );
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (player.requestFullscreen) await player.requestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      else status("Pełny ekran nie jest obsługiwany w tej przeglądarce.");
    } catch {
      status("Nie udało się włączyć pełnego ekranu.");
    }
  }
  const actions = {
    play: toggle,
    back: () => skip(-10),
    forward: () => skip(10),
    mute: () => {
      video.muted = !video.muted;
    },
    fullscreen,
  };
  root
    .querySelectorAll("[data-action]")
    .forEach((b) => on(b, "click", actions[b.dataset.action]));
  on(big, "click", toggle);
  on(video, "click", toggle);
  on(video, "play", () => {
    play.textContent = "Ⅱ";
    big.hidden = true;
    status("");
  });
  on(video, "pause", () => {
    play.textContent = "▶";
    big.hidden = false;
    saveProgress();
  });
  on(video, "ended", saveProgress);
  on(video, "timeupdate", () => {
    seek.value = video.duration
      ? (video.currentTime / video.duration) * 100
      : 0;
    root.querySelector(".native-time").textContent =
      `${time(video.currentTime)} / ${time(video.duration)}`;
    saveProgress();
  });
  on(video, "loadedmetadata", () => {
    status("");
    seek.disabled = false;
    if (key) {
      const t = position(key);
      if (t > 0 && t < video.duration) {
        video.currentTime = t;
        note.textContent = `Wznowiono od ${formatTime(t)} · plik pozostaje na urządzeniu`;
      }
    }
  });
  on(video, "seeking", () => tracker?.resetSampling());
  on(video, "seeked", () => saveProgress(true));
  on(video, "play", () => saveProgress());
  on(window, "pagehide", saveProgress);
  on(video, "waiting", () => status("Buforowanie…"));
  on(video, "playing", () => status(""));
  on(video, "error", () =>
    status(
      "Nie można wczytać filmu. Źródło może być niedostępne albo kodek nie jest obsługiwany. Możesz otworzyć lokalny plik lub wrócić do źródła.",
    ),
  );
  on(seek, "input", () => {
    if (Number.isFinite(video.duration))
      video.currentTime = (video.duration * Number(seek.value)) / 100;
  });
  on(root.querySelector(".native-volume"), "input", (e) => {
    video.volume = +e.target.value;
    video.muted = false;
  });
  on(video, "volumechange", () => {
    root.querySelector('[data-action="mute"]').textContent =
      video.muted || video.volume === 0 ? "×" : "♪";
  });
  on(
    root.querySelector(".native-speed"),
    "change",
    (e) => (video.playbackRate = +e.target.value),
  );
  on(player, "keydown", (e) => {
    if (["INPUT", "SELECT", "BUTTON", "TEXTAREA"].includes(e.target.tagName))
      return;
    const a = {
      " ": toggle,
      k: toggle,
      ArrowLeft: () => skip(-10),
      ArrowRight: () => skip(10),
      m: actions.mute,
      f: fullscreen,
    }[e.key];
    if (a) {
      e.preventDefault();
      a();
    }
  });
  on(captions, "change", () => {
    [...video.textTracks].forEach(
      (t, i) =>
        (t.mode = captions.value === String(i) ? "showing" : "disabled"),
    );
  });
  on(root.querySelector(".local-subs"), "change", async (e) => {
    for (const file of e.target.files) {
      if (file.size > 5 * 1024 * 1024) {
        status("Plik napisów jest za duży (maks. 5 MB).");
        continue;
      }
      const text = await file.text();
      if (disposed) return;
      const vtt = file.name.toLowerCase().endsWith(".srt")
        ? srtToVtt(text)
        : text.replace(/^\uFEFF/, "");
      if (!vtt.startsWith("WEBVTT")) {
        status("Nieprawidłowy format napisów. Użyj VTT lub SRT.");
        continue;
      }
      const url = URL.createObjectURL(new Blob([vtt], { type: "text/vtt" }));
      urls.push(url);
      const track = document.createElement("track");
      track.kind = "subtitles";
      track.label = file.name;
      track.src = url;
      video.append(track);
      const idx = video.querySelectorAll("track").length - 1;
      const option = new Option(file.name, String(idx));
      captions.add(option);
      captions.value = String(idx);
      [...video.textTracks].forEach(
        (t, i) => (t.mode = i === idx ? "showing" : "disabled"),
      );
      on(track, "error", () =>
        status("Nie udało się odczytać napisów. Sprawdź zawartość pliku."),
      );
    }
    e.target.value = "";
  });
  const fileInput = root.querySelector(".local-video");
  if (fileInput)
    on(fileInput, "change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      saveProgress();
      video.pause();
      key = `local:${encodeURIComponent(file.name)}:${file.size}:${file.lastModified}`;
      tracker = createProgress(key, { label: file.name, episode: key });
      video.querySelectorAll("track").forEach((t) => t.remove());
      captions.innerHTML = '<option value="off">Napisy wyłączone</option>';
      const url = URL.createObjectURL(file);
      urls.push(url);
      setSource(url);
      note.textContent = file.name;
    });
  seek.disabled = true;
  if (src) setSource(src);
  return () => {
    saveProgress();
    disposed = true;
    controller.abort();
    video.pause();
    video.removeAttribute("src");
    video.load();
    urls.forEach((url) => URL.revokeObjectURL?.(url));
  };
}
