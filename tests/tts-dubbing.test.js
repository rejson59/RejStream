// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TTSDubbing, parseSRT, parseVTT } from "../tts-dubbing.js";
import { hasTTSDemo, getTTSCues, ttsDemos } from "../tts-demos.js";

describe("TTSDubbing", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("checks availability via static method", () => {
    // jsdom has no speechSynthesis by default
    const orig = window.speechSynthesis;
    delete window.speechSynthesis;
    expect(TTSDubbing.isAvailable()).toBe(false);
    window.speechSynthesis = orig;
  });

  it("creates instance and handles missing speechSynthesis", () => {
    const orig = window.speechSynthesis;
    delete window.speechSynthesis;
    const tts = new TTSDubbing();
    expect(tts.synth).toBeUndefined();
    expect(tts.enabled).toBe(false);
    expect(tts.plVoice).toBeNull();
    window.speechSynthesis = orig;
  });

  it("loads cues sorted by start time", () => {
    const tts = new TTSDubbing();
    const cues = [
      { start: 10, end: 15, text: "Drugi" },
      { start: 0, end: 5, text: "Pierwszy" },
      { start: 5, end: 10, text: "Środek" },
    ];
    tts.loadCues(cues);
    expect(tts.cues[0].text).toBe("Pierwszy");
    expect(tts.cues[1].text).toBe("Środek");
    expect(tts.cues[2].text).toBe("Drugi");
  });

  it("sets rate within bounds", () => {
    const tts = new TTSDubbing();
    tts.setRate(0.3);
    expect(tts.rate).toBe(0.5);
    tts.setRate(3.0);
    expect(tts.rate).toBe(2.0);
    tts.setRate(1.5);
    expect(tts.rate).toBe(1.5);
  });

  it("returns false when enabling without speechSynthesis", () => {
    const tts = new TTSDubbing();
    const mockVideo = { muted: false, currentTime: 0 };
    tts.loadCues([{ start: 0, end: 5, text: "Test" }]);
    
    // jsdom nie ma speechSynthesis, więc enable() powinno zwrócić false
    const enabled = tts.enable(mockVideo);
    expect(enabled).toBe(false);
    expect(tts.enabled).toBe(false);
  });

  it("enables and disables correctly with mocked speechSynthesis", () => {
    const mockSynth = {
      speak: vi.fn(),
      cancel: vi.fn(),
      onvoiceschanged: null,
      getVoices: vi.fn(() => []),
    };
    window.speechSynthesis = mockSynth;
    
    const tts = new TTSDubbing();
    const mockVideo = { muted: false, currentTime: 0 };
    tts.loadCues([{ start: 0, end: 5, text: "Test" }]);
    
    const enabled = tts.enable(mockVideo);
    expect(enabled).toBe(true);
    expect(tts.enabled).toBe(true);
    expect(mockVideo.muted).toBe(true);
    
    tts.disable();
    expect(tts.enabled).toBe(false);
    expect(mockVideo.muted).toBe(false);
  });
});

describe("parseSRT", () => {
  it("parses SRT format correctly", () => {
    const srt = `1
00:00:01,000 --> 00:00:04,500
Pierwsza linia

2
00:00:05,000 --> 00:00:08,000
Druga linia
z wieloma liniami`;

    const cues = parseSRT(srt);
    expect(cues).toHaveLength(2);
    expect(cues[0].start).toBe(1);
    expect(cues[0].end).toBe(4.5);
    expect(cues[0].text).toBe("Pierwsza linia");
    expect(cues[1].start).toBe(5);
    expect(cues[1].end).toBe(8);
    expect(cues[1].text).toBe("Druga linia z wieloma liniami");
  });

  it("returns empty array for invalid input", () => {
    expect(parseSRT("")).toHaveLength(0);
    expect(parseSRT("garbage")).toHaveLength(0);
  });
});

describe("parseVTT", () => {
  it("parses VTT format correctly", () => {
    const vtt = `WEBVTT

00:00:01.000 --> 00:00:04.500
Pierwsza linia

00:00:05.000 --> 00:00:08.000
Druga linia`;

    const cues = parseVTT(vtt);
    expect(cues).toHaveLength(2);
    expect(cues[0].start).toBe(1);
    expect(cues[0].end).toBe(4.5);
    expect(cues[0].text).toBe("Pierwsza linia");
  });
});

describe("TTS demos", () => {
  it("has demo for calling-all-villains S1E1", () => {
    expect(hasTTSDemo("calling-all-villains", 1, 1)).toBe(true);
  });

  it("returns false for unknown series", () => {
    expect(hasTTSDemo("unknown-series", 1, 1)).toBe(false);
  });

  it("returns cues for available demo", () => {
    const cues = getTTSCues("calling-all-villains", 1, 1);
    expect(cues).toBeTruthy();
    expect(Array.isArray(cues)).toBe(true);
    expect(cues.length).toBeGreaterThan(0);
    expect(cues[0]).toHaveProperty("start");
    expect(cues[0]).toHaveProperty("end");
    expect(cues[0]).toHaveProperty("text");
  });

  it("returns null for unavailable demo", () => {
    expect(getTTSCues("calling-all-villains", 2, 1)).toBeNull();
    expect(getTTSCues("helluva", 1, 1)).toBeNull();
  });
});
