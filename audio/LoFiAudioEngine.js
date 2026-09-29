// LoFiAudioEngine.js - 100% Self-Contained Web Audio API Japanese Lo-Fi Multi-Track Engine
// Features 4 procedural Japanese chillhop tracks + ambient generators (rain, vinyl, crickets)
// and interactive procedural SFX suite (koto chimes, whoosh, click, teleport).

export const JAPANESE_TRACKS = [
  {
    id: 'sakura-rain',
    title: 'Sakura Rain // 桜の雨',
    tagline: 'Traditional koto plucks, mellow Rhodes chords & gentle chillhop groove',
    bpm: 72,
    swing: 0.035,
    ambience: 'rain_vinyl',
    leadInstrument: 'koto',
    scale: [62, 65, 69, 72, 74, 77, 81], // D minor pentatonic / Hirajoshi
    chords: [
      { name: 'Dm9', notes: [50, 53, 57, 60, 64], bass: 38 },
      { name: 'G13', notes: [47, 53, 59, 64, 67], bass: 43 },
      { name: 'Cmaj9', notes: [48, 52, 55, 59, 62], bass: 36 },
      { name: 'Am9', notes: [45, 52, 55, 60, 64], bass: 33 },
    ],
  },
  {
    id: 'kyoto-twilight',
    title: 'Kyoto Twilight // 京都の夕暮れ',
    tagline: 'Warm electric piano, acoustic shakuhachi flute harmonics & mellow sub-bass',
    bpm: 68,
    swing: 0.04,
    ambience: 'rain',
    leadInstrument: 'shakuhachi',
    scale: [60, 61, 65, 67, 70, 72, 73], // Insen scale / meditative
    chords: [
      { name: 'Fm9', notes: [53, 56, 60, 63, 67], bass: 41 },
      { name: 'Bbm9', notes: [46, 53, 58, 61, 65], bass: 34 },
      { name: 'Eb9', notes: [51, 55, 58, 61, 65], bass: 39 },
      { name: 'Abmaj7', notes: [44, 51, 55, 58, 63], bass: 32 },
    ],
  },
  {
    id: 'midnight-ryokan',
    title: 'Midnight Ryokan // 旅館の夜',
    tagline: 'Ambient night crickets, serene koto arpeggios & warm lo-fi meditation',
    bpm: 66,
    swing: 0.03,
    ambience: 'crickets_vinyl',
    leadInstrument: 'koto',
    scale: [64, 67, 71, 74, 76, 79, 83], // E minor pentatonic
    chords: [
      { name: 'Em7', notes: [52, 55, 59, 62, 67], bass: 40 },
      { name: 'Cmaj7', notes: [48, 52, 55, 59, 64], bass: 36 },
      { name: 'Am7', notes: [45, 52, 55, 60, 64], bass: 33 },
      { name: 'Bm7', notes: [47, 54, 57, 62, 66], bass: 35 },
    ],
  },
  {
    id: 'shibuya-breeze',
    title: 'Shibuya Breeze // 渋谷の風',
    tagline: 'Cozy upbeat chillhop, pentatonic bells, lush 9th chords & soft hi-hat swing',
    bpm: 78,
    swing: 0.042,
    ambience: 'vinyl',
    leadInstrument: 'bell',
    scale: [67, 71, 74, 76, 79, 83, 86], // G major pentatonic / Ryukyu warmth
    chords: [
      { name: 'Gmaj9', notes: [55, 59, 62, 66, 69], bass: 43 },
      { name: 'F#m7', notes: [54, 57, 61, 64, 69], bass: 42 },
      { name: 'Bm9', notes: [47, 54, 59, 62, 66], bass: 35 },
      { name: 'E9', notes: [52, 56, 59, 62, 66], bass: 40 },
    ],
  },
];

class LoFiAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.65;
    this.currentTrackIndex = 0;
    this.tracks = JAPANESE_TRACKS;
    this.listeners = new Set();

    // Node graph
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.ambientGain = null;
    this.vinylNode = null;
    this.rainNode = null;
    this.cricketTimerId = null;
    this.timerId = null;

    // Sequencer state
    this.step = 0;
    this.chordIndex = 0;

    // Auto-init on first user gesture
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

    // Warm Lo-Fi Master Filter
    this.masterFilter = this.ctx.createBiquadFilter();
    this.masterFilter.type = 'lowpass';
    this.masterFilter.frequency.setValueAtTime(2800, this.ctx.currentTime);
    this.masterFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);

    // Sub-busses
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.6, this.ctx.currentTime);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    this.musicGain.connect(this.masterFilter);
    this.sfxGain.connect(this.masterFilter);
    this.ambientGain.connect(this.masterFilter);
    this.masterFilter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this._setupAmbientLayers();
  }

  // --- Ambient Generators: Vinyl, Rain & Night Crickets ---
  _setupAmbientLayers() {
    if (!this.ctx) return;

    // 1. Vinyl Crackle Generator
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 0.07;
      if (Math.random() < 0.0004) {
        output[i] += (Math.random() - 0.5) * 0.4;
      }
    }

    const crackle = this.ctx.createBufferSource();
    crackle.buffer = noiseBuffer;
    crackle.loop = true;

    const crackleFilter = this.ctx.createBiquadFilter();
    crackleFilter.type = 'bandpass';
    crackleFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    crackleFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    crackle.connect(crackleFilter);
    crackleFilter.connect(this.vinylGain);
    this.vinylGain.connect(this.ambientGain);
    crackle.start(0);
    this.vinylNode = crackle;

    // 2. Gentle Rain Ambience Generator
    const rainBufferSize = this.ctx.sampleRate * 2;
    const rainBuffer = this.ctx.createBuffer(1, rainBufferSize, this.ctx.sampleRate);
    const rainData = rainBuffer.getChannelData(0);
    let lastRain = 0.0;
    for (let i = 0; i < rainBufferSize; i++) {
      const white = Math.random() * 2 - 1;
      rainData[i] = (lastRain + 0.05 * white) / 1.05;
      lastRain = rainData[i];
    }

    const rain = this.ctx.createBufferSource();
    rain.buffer = rainBuffer;
    rain.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(800, this.ctx.currentTime);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    rain.connect(rainFilter);
    rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.ambientGain);
    rain.start(0);
    this.rainNode = rain;

    this._updateAmbienceForCurrentTrack();
  }

  _updateAmbienceForCurrentTrack() {
    if (!this.ctx || !this.vinylGain || !this.rainGain) return;
    const currentTrack = this.tracks[this.currentTrackIndex];
    const now = this.ctx.currentTime;

    const hasRain = currentTrack.ambience.includes('rain');
    const hasVinyl = currentTrack.ambience.includes('vinyl');
    const hasCrickets = currentTrack.ambience.includes('crickets');

    this.vinylGain.gain.setTargetAtTime(hasVinyl ? 0.045 : 0.01, now, 0.5);
    this.rainGain.gain.setTargetAtTime(hasRain ? 0.05 : 0.0, now, 0.5);

    // Night crickets interval
    if (this.cricketTimerId) {
      clearInterval(this.cricketTimerId);
      this.cricketTimerId = null;
    }
    if (hasCrickets && this.isPlaying) {
      this.cricketTimerId = setInterval(() => {
        if (Math.random() > 0.3) {
          this._playCricketChirp();
        }
      }, 2200);
    }
  }

  _playCricketChirp() {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    const chirps = 3;
    for (let c = 0; c < chirps; c++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + c * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(4600 + (Math.random() - 0.5) * 200, time);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(0.015, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);

      osc.connect(gain);
      gain.connect(this.ambientGain);

      osc.start(time);
      osc.stop(time + 0.05);
    }
  }

  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // --- TRADITIONAL INSTRUMENTS SYNTHESIS ---

  // 1. Traditional Japanese Koto Pluck (sharp attack, dual resonant harmonics)
  _playKotoPluck(midi, time, duration = 1.8) {
    if (!this.ctx || !this.isPlaying) return;
    const freq = this.midiToFreq(midi);

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.01, time); // 2nd harmonic pluck

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.8, time);
    filter.frequency.exponentialRampToValueAtTime(freq * 0.8, time + duration);
    filter.Q.setValueAtTime(3.5, time);

    const noteVol = 0.085;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(noteVol, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(noteVol * 0.35, time + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.05);
    osc2.stop(time + duration + 0.05);
  }

  // 2. Traditional Japanese Shakuhachi Flute (breathy sine with vibrato & pitch scoop)
  _playShakuhachi(midi, time, duration = 2.2) {
    if (!this.ctx || !this.isPlaying) return;
    const freq = this.midiToFreq(midi);

    const osc = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Pitch scoop attack (traditional shakuhachi grace note)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.96, time);
    osc.frequency.exponentialRampToValueAtTime(freq, time + 0.12);

    // Subtle breath vibrato
    vibrato.frequency.setValueAtTime(4.6, time);
    vibratoGain.gain.setValueAtTime(freq * 0.018, time);
    vibrato.connect(osc.frequency);

    // Warm breath filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);

    const vol = 0.07;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.16);
    gain.gain.exponentialRampToValueAtTime(vol * 0.7, time + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    vibrato.start(time);
    osc.start(time);
    vibrato.stop(time + duration + 0.05);
    osc.stop(time + duration + 0.05);
  }

  // 3. Pentatonic Japanese Bell / Wind Chime (Suzu)
  _playBell(midi, time, duration = 2.4) {
    if (!this.ctx || !this.isPlaying) return;
    const freq = this.midiToFreq(midi);

    const osc = this.ctx.createOscillator();
    const oscHigh = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    oscHigh.type = 'sine';
    oscHigh.frequency.setValueAtTime(freq * 2.76, time); // Inharmonic bell ring

    const vol = 0.06;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    oscHigh.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    oscHigh.start(time);
    osc.stop(time + duration + 0.05);
    oscHigh.stop(time + duration + 0.05);
  }

  // 4. Warm Rhodes Electric Piano Chords
  _playRhodesChord(chord, time, duration = 2.4) {
    if (!this.ctx || !this.isPlaying) return;

    chord.notes.forEach((midi, idx) => {
      const freq = this.midiToFreq(midi);
      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      const detune = (Math.random() - 0.5) * 6 + (idx % 2 === 0 ? 2 : -2);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.detune.setValueAtTime(detune, time);

      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 2, time);
      oscHarmonic.detune.setValueAtTime(-detune * 1.5, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750 + Math.random() * 150, time);
      filter.frequency.exponentialRampToValueAtTime(280, time + duration);

      const noteGain = 0.048 + (idx === 0 ? 0.015 : 0);
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(noteGain, time + 0.035 + idx * 0.012);
      gain.gain.exponentialRampToValueAtTime(noteGain * 0.4, time + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      oscHarmonic.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time + idx * 0.01);
      oscHarmonic.start(time + idx * 0.01);
      osc.stop(time + duration + 0.1);
      oscHarmonic.stop(time + duration + 0.1);
    });
  }

  // 5. Lo-Fi Sub Bass
  _playBassNote(midi, time, duration = 1.2) {
    if (!this.ctx || !this.isPlaying) return;
    const freq = this.midiToFreq(midi);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.11, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  // 6. Chillhop Drums: Kick, Snare, Hi-Hat
  _playKick(time) {
    if (!this.ctx || !this.isPlaying) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(105, time);
    osc.frequency.exponentialRampToValueAtTime(36, time + 0.16);

    gain.gain.setValueAtTime(0.16, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.22);
  }

  _playSnare(time) {
    if (!this.ctx || !this.isPlaying) return;
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(155, time);
    osc.frequency.exponentialRampToValueAtTime(85, time + 0.07);

    oscGain.gain.setValueAtTime(0.08, time);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.11);
    osc.connect(oscGain);
    oscGain.connect(this.musicGain);

    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.14, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.035));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1100, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.055, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.13);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.14);
    noise.start(time);
  }

  _playHiHat(time, velocity = 0.03) {
    if (!this.ctx || !this.isPlaying) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6200, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(time);
  }

  // --- Multi-Track Sequencer Engine ---
  _step() {
    if (!this.isPlaying || !this.ctx) return;

    const currentTrack = this.tracks[this.currentTrackIndex];
    const now = this.ctx.currentTime;
    const isSwung = this.step % 2 === 1;
    const time = now + (isSwung ? currentTrack.swing : 0);

    // 16-step bar:
    // Beat 0: Chord strike, Kick, Bass, Japanese melody note
    if (this.step === 0) {
      const currentChord = currentTrack.chords[this.chordIndex];
      this._playRhodesChord(currentChord, time, 2.6);
      this._playBassNote(currentChord.bass, time, 1.3);
      this._playKick(time);

      // Lead melody phrase
      const melodyNote = currentTrack.scale[Math.floor(Math.random() * currentTrack.scale.length)];
      if (currentTrack.leadInstrument === 'koto') {
        this._playKotoPluck(melodyNote, time + 0.06, 1.8);
      } else if (currentTrack.leadInstrument === 'shakuhachi') {
        this._playShakuhachi(melodyNote, time + 0.08, 2.2);
      } else if (currentTrack.leadInstrument === 'bell') {
        this._playBell(melodyNote, time + 0.04, 2.4);
      }

      this.chordIndex = (this.chordIndex + 1) % currentTrack.chords.length;
    }

    // Beat 4 (Beat 2): Snare
    if (this.step === 4) {
      this._playSnare(time);
    }

    // Beat 6: Ornamental pentatonic fill
    if (this.step === 6 && Math.random() > 0.35) {
      const note = currentTrack.scale[Math.floor(Math.random() * currentTrack.scale.length)];
      if (currentTrack.leadInstrument === 'koto') {
        this._playKotoPluck(note, time, 1.4);
      } else if (currentTrack.leadInstrument === 'bell') {
        this._playBell(note, time, 1.8);
      }
    }

    // Beat 8 (Beat 3): Kick + bass bounce
    if (this.step === 8) {
      this._playKick(time);
      const chord = currentTrack.chords[(this.chordIndex - 1 + currentTrack.chords.length) % currentTrack.chords.length];
      this._playBassNote(chord.bass + 7, time, 0.85); // 5th note bounce
    }

    // Beat 10: Syncopated ghost kick
    if (this.step === 10 && Math.random() > 0.45) {
      this._playKick(time);
    }

    // Beat 11: Japanese flute or koto answering phrase
    if (this.step === 11 && Math.random() > 0.4) {
      const note = currentTrack.scale[Math.floor(Math.random() * currentTrack.scale.length)];
      if (currentTrack.leadInstrument === 'koto') {
        this._playKotoPluck(note + 7, time, 1.2);
      } else if (currentTrack.leadInstrument === 'shakuhachi') {
        this._playShakuhachi(note, time, 1.8);
      }
    }

    // Beat 12 (Beat 4): Snare
    if (this.step === 12) {
      this._playSnare(time);
    }

    // Beat 14: Soft high fill
    if (this.step === 14 && Math.random() > 0.5) {
      const note = currentTrack.scale[Math.floor(Math.random() * currentTrack.scale.length)];
      if (currentTrack.leadInstrument === 'bell') {
        this._playBell(note, time, 1.5);
      } else if (currentTrack.leadInstrument === 'koto') {
        this._playKotoPluck(note, time, 1.0);
      }
    }

    // Hi-hats on 8th notes with swinging velocity
    if (this.step % 2 === 0) {
      const v = 0.018 + Math.random() * 0.022;
      this._playHiHat(time, v);
    }

    this.step = (this.step + 1) % 16;
  }

  // --- Playlist & Playback Control API ---
  async start() {
    this.init();
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.step = 0;
    const currentTrack = this.tracks[this.currentTrackIndex];
    const stepInterval = (60 / currentTrack.bpm) / 4;
    this.timerId = setInterval(() => this._step(), stepInterval * 1000);
    this._updateAmbienceForCurrentTrack();
    this._notify();
  }

  pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.cricketTimerId) {
      clearInterval(this.cricketTimerId);
      this.cricketTimerId = null;
    }
    this._notify();
  }

  stop() {
    this.pause();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.start();
    }
  }

  playTrack(index) {
    if (index < 0 || index >= this.tracks.length) return;
    this.currentTrackIndex = index;
    this.step = 0;
    this.chordIndex = 0;

    if (this.isPlaying) {
      clearInterval(this.timerId);
      const currentTrack = this.tracks[this.currentTrackIndex];
      const stepInterval = (60 / currentTrack.bpm) / 4;
      this.timerId = setInterval(() => this._step(), stepInterval * 1000);
      this._updateAmbienceForCurrentTrack();
    }
    this._notify();
  }

  nextTrack() {
    const nextIdx = (this.currentTrackIndex + 1) % this.tracks.length;
    this.playTrack(nextIdx);
  }

  prevTrack() {
    const prevIdx = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.playTrack(prevIdx);
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
    const cur = this.tracks[this.currentTrackIndex];
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
      currentTrackIndex: this.currentTrackIndex,
      totalTracks: this.tracks.length,
      trackTitle: cur.title,
      trackName: `${cur.title} [${this.currentTrackIndex + 1}/${this.tracks.length}]`,
      currentTrack: cur,
    };
  }

  // --- PROCEDURAL SFX SUITE ---

  // Pentatonic Japanese Temple Chime
  playZoneChime(index = 0) {
    if (!this.ctx) this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const pentatonic = [62, 65, 69, 72, 74, 77, 81];
    const baseMidi = pentatonic[index % pentatonic.length] || 69;

    [0, 5, 12].forEach((interval, i) => {
      this._playKotoPluck(baseMidi + interval, now + i * 0.08, 1.4);
    });
  }

  playWhoosh() {
    if (!this.ctx) this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.28;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(260, now);
    filter.frequency.exponentialRampToValueAtTime(1300, now + 0.12);
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.26);
    filter.Q.setValueAtTime(2.2, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.09);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.27);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  playClick() {
    if (!this.ctx) this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.03);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  playJump() {
    if (!this.ctx) this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(560, now + 0.15);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  playTeleport() {
    if (!this.ctx) this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    [523, 587, 659, 784, 880, 1046].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.035);
      osc.frequency.exponentialRampToValueAtTime(f * 1.4, now + i * 0.035 + 0.22);

      gain.gain.setValueAtTime(0.001, now + i * 0.035);
      gain.gain.linearRampToValueAtTime(0.04, now + i * 0.035 + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.035 + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + i * 0.035);
      osc.stop(now + i * 0.035 + 0.32);
    });
  }
}

export const audio = new LoFiAudioEngine();
export default audio;
