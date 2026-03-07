/* ── Web Audio API flip-clock sound synthesis ──
   No external audio files — everything is generated in-browser. */

let ctx: AudioContext | null = null;

function ac(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/* Percussive square-wave snap — the core "flip" click */
function flipClick(vol = 0.25, freq = 1200, decay = 0.04, delay = 0) {
  const a = ac();
  const t = a.currentTime + delay;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(200, t + decay);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + decay + 0.02);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + decay + 0.03);
}

/* Short sine-wave resonant tone for warmth */
function tap(vol = 0.12, freq = 800, decay = 0.06, delay = 0) {
  const a = ac();
  const t = a.currentTime + delay;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + decay);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + decay + 0.02);
}

export const sfx = {
  /** Double flip-click + ascending taps — answer reveal */
  reveal() {
    flipClick(0.3, 1400, 0.04, 0);
    flipClick(0.25, 1600, 0.035, 0.06);
    tap(0.15, 900, 0.08, 0.03);
    tap(0.12, 1200, 0.07, 0.09);
  },
  /** Quick double flip — round advance */
  next() {
    flipClick(0.2, 1100, 0.03, 0);
    flipClick(0.18, 1300, 0.03, 0.05);
  },
  /** Single soft click — countdown tick (last 5 seconds) */
  tick() {
    flipClick(0.12, 900, 0.025, 0);
  },
  /** Low double-thud — timer expired auto-reveal */
  timeUp() {
    flipClick(0.35, 600, 0.06, 0);
    tap(0.2, 400, 0.12, 0.05);
    flipClick(0.3, 500, 0.06, 0.12);
    tap(0.18, 350, 0.1, 0.15);
  },
};
