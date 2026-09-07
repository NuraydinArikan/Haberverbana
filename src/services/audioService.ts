// Audio and Speech Synthesis for Haberverbana

export interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTitle: string;
  progress: number;
}

class AudioPlayerService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: ((state: AudioState) => void)[] = [];
  private state: AudioState = {
    isPlaying: false,
    isPaused: false,
    currentTitle: '',
    progress: 0,
  };
  private progressInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(listener: (state: AudioState) => void) {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private updateState(newState: Partial<AudioState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(cb => cb(this.state));
  }

  public speak(title: string, text: string, rate: number = 1.0) {
    if (!this.synth) {
      alert('Tarayıcınız sesli okuma özelliğini desteklemiyor.');
      return;
    }

    this.stop();

    const cleanText = text
      .replace(/[*#_`>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const fullSpeech = `${title}. ${cleanText}`;
    const utterance = new SpeechSynthesisUtterance(fullSpeech);
    utterance.rate = rate;
    utterance.lang = 'tr-TR';

    // Find Turkish voice if available
    const voices = this.synth.getVoices();
    const trVoice = voices.find(v => v.lang.includes('tr') || v.lang.includes('TR'));
    if (trVoice) {
      utterance.voice = trVoice;
    }

    let charCount = 0;
    const totalChars = fullSpeech.length;

    utterance.onstart = () => {
      this.updateState({
        isPlaying: true,
        isPaused: false,
        currentTitle: title,
        progress: 0,
      });

      // Approximate progress tracker
      clearInterval(this.progressInterval);
      this.progressInterval = setInterval(() => {
        if (this.state.isPlaying && !this.state.isPaused) {
          charCount += 12 * rate;
          const pct = Math.min(98, Math.round((charCount / totalChars) * 100));
          this.updateState({ progress: pct });
        }
      }, 500);
    };

    utterance.onend = () => {
      clearInterval(this.progressInterval);
      this.updateState({
        isPlaying: false,
        isPaused: false,
        progress: 100,
      });
      setTimeout(() => {
        if (!this.state.isPlaying) {
          this.updateState({ progress: 0, currentTitle: '' });
        }
      }, 1500);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      clearInterval(this.progressInterval);
      this.updateState({
        isPlaying: false,
        isPaused: false,
        progress: 0,
      });
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.state.isPlaying) {
      this.synth.pause();
      this.updateState({ isPaused: true });
    }
  }

  public resume() {
    if (this.synth && this.state.isPaused) {
      this.synth.resume();
      this.updateState({ isPaused: false });
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    clearInterval(this.progressInterval);
    this.updateState({
      isPlaying: false,
      isPaused: false,
      progress: 0,
      currentTitle: '',
    });
  }

  public getState() {
    return this.state;
  }
}

export const audioPlayer = new AudioPlayerService();
