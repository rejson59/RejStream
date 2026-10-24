function defaultStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}
const STORAGE_KEY = "rej-playback-v1";
const valid = (n) => typeof n === "number" && Number.isFinite(n) && n >= 0;
export function records(storage = defaultStorage()) {
  try {
    const data = JSON.parse(storage.getItem(STORAGE_KEY) || "{}");
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    return Object.fromEntries(
      Object.entries(data).filter(
        ([, r]) =>
          r &&
          valid(r.position) &&
          valid(r.seconds) &&
          valid(r.duration) &&
          valid(r.updated),
      ),
    );
  } catch {
    return {};
  }
}
export function position(key, storage = defaultStorage()) {
  const r = records(storage)[key];
  return r && !r.completed ? r.position : 0;
}
export function formatTime(n = 0) {
  n = Math.max(0, Math.floor(n));
  return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;
}
export function latestProgress(episode, storage = defaultStorage()) {
  return Object.values(records(storage))
    .filter((r) => r.episode === episode)
    .sort((a, b) => b.updated - a.updated)[0];
}
export function createProgress(
  key,
  metadata = {},
  {
    storage = defaultStorage(),
    clock = () => performance.now(),
    onChange = () => {},
  } = {},
) {
  let previous = null;
  function sample({
    time,
    duration,
    playing,
    rate = 1,
    ended = false,
    force = false,
  }) {
    if (!valid(time) || !valid(duration) || !duration) return;
    if (!previous && !playing && !ended && !force) return;
    const now = clock(),
      current = Math.min(time, duration);
    const data = records(storage),
      old = data[key];
    let seconds = old?.seconds || 0;
    if (previous?.playing) {
      const elapsed = (now - previous.now) / 1000,
        delta = current - previous.time;
      // Do not count seeks, buffering, suspended polling, or time on an unopened page.
      if (
        elapsed > 0 &&
        elapsed <= 3 &&
        delta > 0 &&
        delta <= elapsed * previous.rate + 1
      )
        seconds += Math.min(elapsed, delta / previous.rate);
    }
    previous = {
      time: current,
      now,
      playing: !!playing,
      rate: valid(rate) && rate > 0 ? rate : 1,
    };
    if (!old && !playing && !ended && !force) return;
    const entry = {
      ...metadata,
      position: current,
      duration,
      seconds,
      completed:
        ended || (!!old?.completed && !playing && current >= duration - 1),
      updated: Date.now(),
    };
    data[key] = entry;
    // Bound local storage growth; oldest records are discarded first.
    const bounded = Object.fromEntries(
      Object.entries(data)
        .sort((a, b) => b[1].updated - a[1].updated)
        .slice(0, 500),
    );
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(bounded));
    } catch {
      /* Playback must work with blocked/full storage. */
    }
    onChange(entry);
    return entry;
  }
  return {
    sample,
    resetSampling() {
      previous = null;
    },
  };
}
let apiPromise;
export function loadYouTubeAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      apiPromise = null;
      reject(new Error("YouTube API timed out"));
    }, 15000);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timeout);
      previous?.();
      resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = () => {
      clearTimeout(timeout);
      apiPromise = null;
      script.remove();
      reject(new Error("YouTube API unavailable"));
    };
    document.head.append(script);
  });
  return apiPromise;
}
// Caption-track requests are best effort: YouTube does not guarantee a public
// language-selection API on every embed. Never report success without a readback.
export function captionPreference(
  getPlayer,
  report = () => {},
  initial = "pl",
) {
  let language = initial,
    attempts = 0;
  function apply() {
    const player = getPlayer();
    if (!player || !language) {
      report("Ustawienia napisów w odtwarzaczu YouTube.");
      return;
    }
    try {
      const actual = player.getOption?.("captions", "track");
      if (actual?.languageCode?.split("-")[0] === language) {
        report(
          `Napisy ${language.toUpperCase()} · potwierdzone przez odtwarzacz.`,
        );
        return;
      }
      if (attempts >= 4) return;
      attempts++;
      player.loadModule?.("captions");
      player.setOption?.("captions", "track", { languageCode: language });
      const selected = player.getOption?.("captions", "track");
      report(
        selected?.languageCode?.split("-")[0] === language
          ? `Napisy ${language.toUpperCase()} · potwierdzone przez odtwarzacz.`
          : `Wybrano preferencję ${language.toUpperCase()}. Jeśli YouTube nadal pokazuje inny język, wybierz ⚙ → Napisy → Polski (lub tłumaczenie automatyczne). Brak gwarancji dostępności.`,
      );
    } catch {
      report(
        "YouTube nie udostępnił sterowania napisami. Wybierz ⚙ → Napisy → Polski.",
      );
    }
  }
  return {
    apply,
    set(value) {
      language = value;
      attempts = 0;
      apply();
    },
  };
}
export function trackYouTube(
  frame,
  key,
  metadata,
  {
    api = loadYouTubeAPI,
    onChange,
    onUnavailable = () => {},
    subtitles = "pl",
    onCaptions = () => {},
    onStatus = () => {},
  } = {},
) {
  let disposed = false,
    player,
    timer,
    watchdog,
    playing = false,
    failed = false,
    resumed = false;
  const captions = captionPreference(() => player, onCaptions, subtitles);
  const tracker = key ? createProgress(key, metadata, { onChange }) : null;
  const saved = key ? position(key) : 0;
  const slow = () => {
    clearTimeout(watchdog);
    watchdog = setTimeout(() => {
      if (!disposed) onStatus("slow");
    }, 12000);
  };
  onStatus("loading");
  slow();
  const sample = (ended) => {
    if (failed) return;
    try {
      if (tracker && player?.getCurrentTime)
        tracker.sample({
          time: player.getCurrentTime(),
          duration: player.getDuration(),
          playing,
          rate: player.getPlaybackRate(),
          ended: !!ended,
        });
    } catch {
      /* Removed/blocked iframe. */
    }
  };
  function resumeOnce() {
    if (resumed || !saved || !player?.getDuration?.()) return;
    resumed = true;
    // start= already positions the embed. A second seek during onReady can
    // interrupt decoding and produce a black frame. Only correct real drift,
    // once the video is cued/playing, never on every state transition.
    if (
      saved < player.getDuration() &&
      Math.abs(player.getCurrentTime() - saved) > 1.5
    )
      player.seekTo(saved, true);
  }
  const pagehide = () => sample(false);
  window.addEventListener("pagehide", pagehide);
  api()
    .then((YT) => {
      if (disposed) return;
      player = new YT.Player(frame, {
        events: {
          onReady(event) {
            if (disposed) return;
            player = event.target;
            clearTimeout(watchdog);
            onStatus("ready");
            captions.apply();
            if (tracker) timer = setInterval(() => sample(false), 1000);
          },
          onApiChange() {
            if (!disposed) captions.apply();
          },
          onStateChange(event) {
            if (disposed) return;
            playing = event.data === 1;
            if ([1, 5].includes(event.data)) resumeOnce();
            if (playing) captions.apply();
            if (event.data === 3) {
              onStatus("buffering");
              slow();
            } else {
              clearTimeout(watchdog);
              onStatus(playing ? "playing" : "ready");
            }
            sample(event.data === 0);
          },
          onError() {
            if (!disposed) {
              failed = true;
              playing = false;
              clearInterval(timer);
              clearTimeout(watchdog);
              onStatus("error");
              onUnavailable();
            }
          },
        },
      });
    })
    .catch(() => {
      if (!disposed) {
        clearTimeout(watchdog);
        onStatus("error");
        onUnavailable();
      }
    });
  const stop = () => {
    sample(false);
    disposed = true;
    clearInterval(timer);
    clearTimeout(watchdog);
    window.removeEventListener("pagehide", pagehide);
    try {
      player?.destroy?.();
    } catch {
      /* Already removed. */
    }
  };
  stop.setSubtitles = (value) => captions.set(value);
  return stop;
}
