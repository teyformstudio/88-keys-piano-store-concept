/* Piano synthesis engine — Web Audio API.
   Physical-ish model: inharmonic partials (stiff string), two-stage decay,
   hammer noise transient, generated convolution reverb. No samples = instant load. */

export interface VoiceParams {
  brightness: number; // 0..1 — harmonic content / filter
  decay: number; // multiplier of ring-out length
  body: number; // 0..1 — unison detune richness
}

export const DEFAULT_VOICE: VoiceParams = { brightness: 0.6, decay: 1, body: 0.5 };

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const midiName = (m: number) => NOTE_NAMES[m % 12] + (Math.floor(m / 12) - 1);
export const isBlack = (m: number) => [1, 3, 6, 8, 10].includes(m % 12);

/* Demo phrase — dreamy Am(add9) → Fmaj9 → C/E → G → Am. [midi, start(8ths), velocity] */
const PHRASE: Array<[number, number, number]> = [
  [45, 0, 0.72], [52, 1, 0.5], [57, 2, 0.55], [59, 3, 0.5], [64, 4, 0.78], [71, 6, 0.62], [69, 7, 0.5],
  [41, 8, 0.7], [48, 9, 0.5], [53, 10, 0.55], [57, 11, 0.5], [64, 12, 0.72], [67, 14, 0.6], [64, 15, 0.48],
  [40, 16, 0.68], [48, 17, 0.5], [55, 18, 0.52], [59, 19, 0.5], [62, 20, 0.74], [67, 22, 0.62], [64, 23, 0.5],
  [43, 24, 0.7], [50, 25, 0.5], [59, 26, 0.55], [62, 27, 0.52], [71, 28, 0.8], [69, 30, 0.55], [67, 31, 0.45],
  [45, 32, 0.6], [57, 33, 0.45], [64, 34, 0.52],
];
const EIGHTH = 0.31; // seconds per 8th note

class PianoEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private demoBus: GainNode | null = null;
  private verb: ConvolverNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private demoNodes: AudioScheduledSourceNode[] = [];
  private demoTimers: number[] = [];
  private endTimer: number | null = null;

  isSupported(): boolean {
    return typeof window !== "undefined" && Boolean(window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
  }

  private ensure(): AudioContext {
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx;
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) throw new Error("Web Audio is not supported in this browser.");
    const ctx = new AC();
    this.ctx = ctx;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 18;
    comp.ratio.value = 4;
    comp.attack.value = 0.003;
    comp.release.value = 0.24;

    this.analyserNode = ctx.createAnalyser();
    this.analyserNode.fftSize = 256;
    this.analyserNode.smoothingTimeConstant = 0.82;

    const out = ctx.createGain();
    out.gain.value = 0.92;
    comp.connect(this.analyserNode);
    this.analyserNode.connect(out);
    out.connect(ctx.destination);

    this.master = ctx.createGain();
    this.master.connect(comp);

    this.verb = ctx.createConvolver();
    this.verb.buffer = this.makeIR(2.9, 2.6);
    const wet = ctx.createGain();
    wet.gain.value = 0.34;
    this.verb.connect(wet);
    wet.connect(comp);

    this.demoBus = ctx.createGain();
    this.demoBus.connect(this.master);
    return ctx;
  }

  private makeIR(duration: number, decayPow: number): AudioBuffer {
    const ctx = this.ctx!;
    const rate = ctx.sampleRate;
    const len = Math.floor(rate * duration);
    const buf = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decayPow);
      }
    }
    return buf;
  }

  private getNoise(): AudioBuffer {
    if (this.noiseBuf) return this.noiseBuf;
    const ctx = this.ctx!;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    this.noiseBuf = buf;
    return buf;
  }

  unlock() {
    this.ensure();
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  noteOn(midi: number, velocity = 0.8, voice: VoiceParams = DEFAULT_VOICE, opts?: { when?: number; demo?: boolean }) {
    const ctx = this.ensure();
    const t = opts?.when ?? ctx.currentTime;
    const f = 440 * Math.pow(2, (midi - 69) / 12);
    const dest = opts?.demo ? this.demoBus! : this.master!;

    const baseT = Math.min(5.6, Math.max(1.15, 5.8 - (midi - 21) * 0.05)) * voice.decay;
    const peak = 0.05 + 0.2 * Math.pow(Math.min(1, Math.max(0.05, velocity)), 1.25);

    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(peak, t + 0.006);
    amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak * 0.34), t + 0.3);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + baseT);

    const flt = ctx.createBiquadFilter();
    flt.type = "lowpass";
    flt.Q.value = 0.4;
    const cutoff = 650 + voice.brightness * 2400 + velocity * 2100 + (midi > 72 ? 500 : 0);
    flt.frequency.setValueAtTime(cutoff, t);
    flt.frequency.exponentialRampToValueAtTime(Math.max(420, cutoff * 0.32), t + Math.min(1.5, baseT * 0.65));

    amp.connect(flt);
    flt.connect(dest);
    const send = ctx.createGain();
    send.gain.value = 0.55;
    flt.connect(send);
    send.connect(this.verb!);

    // Stiff-string inharmonicity: stronger in the bass
    const B = 0.00022 * Math.pow(261.6 / f, 0.6);
    const partialGains = [1, 0.55, 0.3, 0.16, 0.09, 0.045];
    partialGains.forEach((g, i) => {
      const n = i + 1;
      if (f * n > 12500) return;
      const o = ctx.createOscillator();
      o.type = i === 0 ? "triangle" : "sine";
      o.frequency.value = f * n * Math.sqrt(1 + B * n * n);
      const og = ctx.createGain();
      const brightScale = i === 0 ? 1 : 0.4 + voice.brightness * (i > 2 ? 1.15 : 0.85);
      og.gain.setValueAtTime(Math.max(0.0002, g * brightScale), t);
      og.gain.exponentialRampToValueAtTime(0.0001, t + baseT / (1 + i * 0.9));
      o.connect(og);
      og.connect(amp);
      o.start(t);
      o.stop(t + baseT + 0.15);
      if (opts?.demo) this.demoNodes.push(o);
    });

    // Slightly detuned unison string for body/chorus
    if (voice.body > 0.05) {
      const o2 = ctx.createOscillator();
      o2.type = "sine";
      o2.frequency.value = f;
      o2.detune.value = 4.2 * voice.body;
      const og2 = ctx.createGain();
      og2.gain.setValueAtTime(0.34 * voice.body, t);
      og2.gain.exponentialRampToValueAtTime(0.0001, t + baseT * 0.9);
      o2.connect(og2);
      og2.connect(amp);
      o2.start(t);
      o2.stop(t + baseT + 0.15);
      if (opts?.demo) this.demoNodes.push(o2);
    }

    // Hammer transient
    const noise = ctx.createBufferSource();
    noise.buffer = this.getNoise();
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1300 + voice.brightness * 1400;
    bp.Q.value = 0.9;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.11 * velocity, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    noise.connect(bp);
    bp.connect(ng);
    ng.connect(dest);
    noise.start(t);
    noise.stop(t + 0.08);
    if (opts?.demo) this.demoNodes.push(noise);
  }

  playDemo(voice: VoiceParams, opts?: { short?: boolean; onNote?: (midi: number) => void; onEnd?: () => void }) {
    const ctx = this.ensure();
    this.stopDemo(true);
    this.demoBus!.gain.setTargetAtTime(1, ctx.currentTime, 0.03);
    const start = ctx.currentTime + 0.06;
    const notes = opts?.short ? PHRASE.filter(([, s]) => s < 8) : PHRASE;
    notes.forEach(([midi, s, vel]) => {
      this.noteOn(midi, vel, voice, { when: start + s * EIGHTH, demo: true });
      if (opts?.onNote) {
        const id = window.setTimeout(() => opts.onNote!(midi), 60 + s * EIGHTH * 1000);
        this.demoTimers.push(id);
      }
    });
    const totalMs = (opts?.short ? 8 : 35) * EIGHTH * 1000 + 1400;
    if (this.endTimer) window.clearTimeout(this.endTimer);
    this.endTimer = window.setTimeout(() => opts?.onEnd?.(), totalMs);
  }

  stopDemo(silent = false) {
    if (this.endTimer) {
      window.clearTimeout(this.endTimer);
      this.endTimer = null;
    }
    this.demoTimers.forEach((id) => window.clearTimeout(id));
    this.demoTimers = [];
    if (this.ctx && this.demoBus) {
      this.demoBus.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.06);
    }
    const nodes = this.demoNodes;
    this.demoNodes = [];
    window.setTimeout(
      () => nodes.forEach((n) => { try { n.stop(); } catch { /* already stopped */ } }),
      silent ? 30 : 280
    );
  }
}

export const piano = new PianoEngine();
