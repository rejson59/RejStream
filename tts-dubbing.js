// Silnik dubbingowy RejStream - Proof of Concept
// Odczytuje polskie napisy przez Web Speech API zsynchronizowane z wideo

export class TTSDubbing {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.cues = [];
    this.currentCueIndex = -1;
    this.enabled = false;
    this.rate = 1.0;
    this.video = null;
    this.checkInterval = null;
    this.plVoice = null;
    
    // Znajdź polski głos
    this.findPolishVoice();
    
    // Nasłuchuj na zmianę głosów (mogą się załadować po starcie)
    if (this.synth) {
      this.synth.onvoiceschanged = () => this.findPolishVoice();
    }
  }

  findPolishVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    
    // Szukaj polskiego głosu (różne formaty)
    this.plVoice = voices.find(v => 
      v.lang === 'pl-PL' || 
      v.lang === 'pl' ||
      v.lang.startsWith('pl-') ||
      v.name.toLowerCase().includes('polish')
    ) || null;
    
    if (this.plVoice) {
      console.log(`[TTS] Znaleziono polski głos: ${this.plVoice.name} (${this.plVoice.lang})`);
    } else {
      console.warn('[TTS] Nie znaleziono polskiego głosu. Użyję domyślnego.');
    }
  }

  // Załaduj napisy (tablica obiektów {start, end, text})
  loadCues(cues) {
    this.cues = cues.sort((a, b) => a.start - b.start);
    this.currentCueIndex = -1;
  }

  // Włącz/wyłącz TTS
  enable(video) {
    if (!this.synth) {
      console.error('[TTS] Web Speech API nie jest dostępne w tej przeglądarce');
      return false;
    }
    
    this.video = video;
    this.enabled = true;
    
    // Mute oryginalny dźwięk
    video.muted = true;
    
    // Uruchom sprawdzanie czasu
    this.startSync();
    
    console.log('[TTS] Dubbing włączony');
    return true;
  }

  disable() {
    this.enabled = false;
    this.stopSync();
    
    if (this.currentUtterance) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
    
    // Unmute jeśli mamy wideo
    if (this.video) {
      this.video.muted = false;
    }
    
    this.currentCueIndex = -1;
    console.log('[TTS] Dubbing wyłączony');
  }

  // Ustaw szybkość mowy (0.5 - 2.0)
  setRate(rate) {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
  }

  startSync() {
    this.stopSync();
    this.checkInterval = setInterval(() => this.sync(), 100);
  }

  stopSync() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  sync() {
    if (!this.enabled || !this.video || this.cues.length === 0) return;
    
    const currentTime = this.video.currentTime;
    
    // Znajdź aktualny napis
    let cueIndex = -1;
    for (let i = 0; i < this.cues.length; i++) {
      const cue = this.cues[i];
      if (currentTime >= cue.start && currentTime < cue.end) {
        cueIndex = i;
        break;
      }
    }
    
    // Jeśli zmieniona linia
    if (cueIndex !== this.currentCueIndex) {
      // Zatrzymaj poprzednią
      if (this.currentUtterance) {
        this.synth.cancel();
        this.currentUtterance = null;
      }
      
      // Odczytaj nową
      if (cueIndex >= 0) {
        this.speak(this.cues[cueIndex].text);
      }
      
      this.currentCueIndex = cueIndex;
    }
  }

  speak(text) {
    if (!this.synth || !text) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Ustaw polski głos jeśli dostępny
    if (this.plVoice) {
      utterance.voice = this.plVoice;
    }
    
    utterance.lang = 'pl-PL';
    utterance.rate = this.rate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  // Sprawdź czy TTS jest dostępne
  static isAvailable() {
    return 'speechSynthesis' in window;
  }

  // Sprawdź czy polski głos jest dostępny
  hasPolishVoice() {
    return this.plVoice !== null;
  }
}

// Parser prostych napisów SRT
export function parseSRT(srtText) {
  const cues = [];
  const blocks = srtText.trim().split(/\n\s*\n/);
  
  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length < 3) continue;
    
    // Parsuj timestamp (format: 00:00:00,000 --> 00:00:03,000)
    const timeMatch = lines[1].match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/);
    if (!timeMatch) continue;
    
    const start = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
    const end = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;
    
    // Reszta to tekst (może być wieloliniowy)
    const text = lines.slice(2).join(' ').trim();
    
    if (text) {
      cues.push({ start, end, text });
    }
  }
  
  return cues;
}

// Parser VTT
export function parseVTT(vttText) {
  const cues = [];
  const blocks = vttText.trim().split(/\n\s*\n/);
  
  for (const block of blocks) {
    const lines = block.split('\n');
    
    // Znajdź linię z timestamp
    let timeLineIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('-->')) {
        timeLineIndex = i;
        break;
      }
    }
    
    if (timeLineIndex < 0) continue;
    
    // Parsuj timestamp (format: 00:00:00.000 --> 00:00:03.000)
    const timeMatch = lines[timeLineIndex].match(/(\d{2}):(\d{2}):(\d{2})[.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[.](\d{3})/);
    if (!timeMatch) continue;
    
    const start = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
    const end = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;
    
    // Reszta to tekst
    const text = lines.slice(timeLineIndex + 1).join(' ').trim();
    
    if (text) {
      cues.push({ start, end, text });
    }
  }
  
  return cues;
}
