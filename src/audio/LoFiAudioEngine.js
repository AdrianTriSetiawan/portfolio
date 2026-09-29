// LoFiAudioEngine.js - 100% Self-Contained Web Audio API Procedural Lo-Fi Generator & SFX Engine
// Provides generative chillhop background music (warm Rhodes chords, vinyl crackle, gentle beat, soft bass)
// and procedural sound effects (zone chimes, whooshes, clicks, jumps, teleport).

class LoFiAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.65;
    this.currentTrackName = 'Midnight Archipelago [Lo-Fi Chill]';
    this.listeners = new Set();

    // Node graph
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.vinylNode = null;
    this.timerId = null;

    // Sequencer state
    this.bpm = 74;
    this.step = 0;
    this.chordIndex = 0;
    this.stepInterval = (60 / this.bpm) / 4; // 16th notes
    this.swing = 0.035; // Lo-Fi groove swing

    // Chord progressions (MIDI note numbers converted to frequencies)
    // 1: Dm9, 2: G13(b9), 3: Cmaj9, 4: Am9
    this.chords = [
      { name: 'Dm9', notes: [50, 53, 57, 60, 64], bass: 38 },
      { name: 'G13', notes: [47, 53, 59, 64, 67], bass: 43 },
      { name: 'Cmaj9', notes: [48, 52, 55, 59, 62], bass: 36 },
      { name: 'Am9', notes: [45, 52, 55, 60, 64], bass: 33 },
    ];

    // Lazy init on first user touch/click
    this._handleFirstGesture = this._handleFirstGesture.bind(this);
    if (typeof window !== 'undefined') {
      window.addEventListener('pointerdown', this._handleFirstGesture, { once: true });
      window.addEventListener('keydown', this._handleFirstGesture, { once: true });
    }
  }

  _handleFirstGesture() {
    if (!this.ctx) {
      this.init();
    }
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

    // Warm Lo-Fi Master Filter (tames digital harshness)
    this.masterFilter = this.ctx.createBiquadFilter();
    this.masterFilter.type = 'lowpass';
    this.masterFilter.frequency.setValueAtTime(2600, this.ctx.currentTime);
    this.masterFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);

    // Sub-busses
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.55, this.ctx.currentTime);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

    this.musicGain.connect(this.masterFilter);
    this.sfxGain.connect(this.masterFilter);
    this.masterFilter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this._createVinylCrackle();
  }

  // --- Vinyl Crackle & Tape Hiss Generator ---
  _createVinylCrackle() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      // Pink noise filter
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 0.08;

      // Occasional needle crackle pop
      if (Math.random() < 0.00045) {
        output[i] += (Math.random() - 0.5) * 0.45;
      }
    }

    const crackle = this.ctx.createBufferSource();
    crackle.buffer = noiseBuffer;
    crackle.loop = true;

    const crackleFilter = this.ctx.createBiquadFilter();
    crackleFilter.type = 'bandpass';
    crackleFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    crackleFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const crackleGain = this.ctx.createGain();
    crackleGain.gain.setValueAtTime(0.045, this.ctx.currentTime);

    crackle.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(this.musicGain);

    crackle.start(0);
    this.vinylNode = crackle;
  }

  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // --- Warm Electric Piano / Rhodes Voice ---
  _playRhodesChord(chord, time, duration = 2.4) {
    if (!this.ctx || !this.isPlaying) return;

    chord.notes.forEach((midi, idx) => {
      const freq = this.midiToFreq(midi);
      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Gentle random humanized detune
      const detune = (Math.random() - 0.5) * 8 + (idx % 2 === 0 ? 3 : -3);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.detune.setValueAtTime(detune, time);

      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 2, time);
      oscHarmonic.detune.setValueAtTime(-detune * 1.5, time);

      // Lowpass filter envelope for warm pluck feel
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + Math.random() * 200, time);
      filter.frequency.exponentialRampToValueAtTime(320, time + duration);

      // Amplitude envelope
      const noteGain = 0.055 + (idx === 0 ? 0.02 : 0);
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(noteGain, time + 0.04 + idx * 0.015); // gentle arpeggiated strums
      gain.gain.exponentialRampToValueAtTime(noteGain * 0.45, time + 0.9);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      oscHarmonic.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time + idx * 0.012);
      oscHarmonic.start(time + idx * 0.012);
      osc.stop(time + duration + 0.1);
      oscHarmonic.stop(time + duration + 0.1);
    });
  }

  // --- Lo-Fi Sub / Warm Bass ---
  _playBassNote(midi, time, duration = 1.2) {
    if (!this.ctx || !this.isPlaying) return;
    const freq = this.midiToFreq(midi);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.12, time + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  // --- Lo-Fi Kick Drum ---
  _playKick(time) {
    if (!this.ctx || !this.isPlaying) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(110, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.18);

    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.25);
  }

  // --- Lo-Fi Snare / Rimshot ---
  _playSnare(time) {
    if (!this.ctx || !this.isPlaying) return;
    // Tonal body
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, time);
    osc.frequency.exponentialRampToValueAtTime(90, time + 0.08);

    oscGain.gain.setValueAtTime(0.09, time);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);
    osc.connect(oscGain);
    oscGain.connect(this.musicGain);

    // White noise snare wire
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.15, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.15);
    noise.start(time);
  }

  // --- Lo-Fi Hi-Hat ---
  _playHiHat(time, velocity = 0.035) {
    if (!this.ctx || !this.isPlaying) return;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6500, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(time);
  }

  // --- Step Sequencer Scheduler ---
  _step() {
    if (!this.isPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    const isSwung = this.step % 2 === 1;
    const time = now + (isSwung ? this.swing : 0);

    // 16-step bar:
    // Beat 0: Chord strike, Kick, Bass
    if (this.step === 0) {
      const currentChord = this.chords[this.chordIndex];
      this._playRhodesChord(currentChord, time, 2.7);
      this._playBassNote(currentChord.bass, time, 1.4);
      this._playKick(time);
      this.chordIndex = (this.chordIndex + 1) % this.chords.length;
    }

    // Beat 4 (Beat 2): Snare
    if (this.step === 4) {
      this._playSnare(time);
    }

    // Beat 8 (Beat 3): Kick + bass bounce
    if (this.step === 8) {
      this._playKick(time);
      const chord = this.chords[(this.chordIndex - 1 + this.chords.length) % this.chords.length];
      this._playBassNote(chord.bass + 7, time, 0.9); // 5th note bounce
    }

    // Beat 10: Syncopated soft ghost kick
    if (this.step === 10 && Math.random() > 0.4) {
      this._playKick(time);
    }

    // Beat 12 (Beat 4): Snare
    if (this.step === 12) {
      this._playSnare(time);
    }

    // Hi-hats on every 2nd step (8th notes) with humanized velocities
    if (this.step % 2 === 0) {
      const v = 0.02 + Math.random() * 0.025;
      this._playHiHat(time, v);
    }

    this.step = (this.step + 1) % 16;
  }

  // --- Public Music Control API ---
  async start() {
    this.init();
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.step = 0;
    this.timerId = setInterval(() => this._step(), this.stepInterval * 1000);
    this._notify();
  }

  pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this._notify();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.start();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    this._notify();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    this._notify();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.getStatus());
    return () => this.listeners.delete(callback);
  }

  _notify() {
    const status = this.getStatus();
    this.listeners.forEach((cb) => cb(status));
  }

  getStatus() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
      trackName: this.currentTrackName,
    };
  }

  // --- PROCEDURAL SFX SUITE ---

  // Pentatonic Ethereal Zone Chime (when arriving at an island)
  playZoneChime(index = 0) {
    if (!this.ctx) this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const pentatonic = [57, 60, 64, 67, 69, 72, 76]; // A minor pentatonic / celestial
    const baseMidi = pentatonic[index % pentatonic.length] || 64;

    [0, 4, 7].forEach((interval, i) => {
      const freq = this.midiToFreq(baseMidi + interval);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.0001, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.08, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.7);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.75);
    });
  }

  // Whoosh for boost / fast movement
  playWhoosh() {
    if (!this.ctx) this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(280, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.12);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.28);
    filter.Q.setValueAtTime(2.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.29);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  // Tactile lo-fi button click
  playClick() {
    if (!this.ctx) this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  // Jump upward chirp
  playJump() {
    if (!this.ctx) this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.16);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Teleport Shimmer Effect
  playTeleport() {
    if (!this.ctx) this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    [440, 554, 659, 880, 1108].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.04);
      osc.frequency.exponentialRampToValueAtTime(f * 1.5, now + i * 0.04 + 0.25);

      gain.gain.setValueAtTime(0.001, now + i * 0.04);
      gain.gain.linearRampToValueAtTime(0.045, now + i * 0.04 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.38);
    });
  }
}

export const audio = new LoFiAudioEngine();
export default audio;
