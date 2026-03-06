let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext => {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return audioCtx;
};

const playTone = (freq: number, dur: number, type: OscillatorType = 'sine', gain = 0.12, delay = 0) => {
  const c = getCtx();
  const o = c.createOscillator();
  const v = c.createGain();
  o.connect(v);
  v.connect(c.destination);
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime + delay);
  v.gain.setValueAtTime(gain, c.currentTime + delay);
  v.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur);
  o.start(c.currentTime + delay);
  o.stop(c.currentTime + delay + dur);
};

export const isSoundOn = (): boolean => localStorage.getItem('uvix-sound') !== 'false';

export const S = {
  login: () => {
    if (!isSoundOn()) return;
    playTone(261.6, 0.15, 'sine', 0.1, 0);
    playTone(329.6, 0.15, 'sine', 0.1, 0.1);
    playTone(392.0, 0.2, 'sine', 0.1, 0.2);
  },
  logout: () => {
    if (!isSoundOn()) return;
    playTone(392.0, 0.15, 'sine', 0.1, 0);
    playTone(329.6, 0.15, 'sine', 0.1, 0.1);
    playTone(261.6, 0.2, 'sine', 0.1, 0.2);
  },
  send: () => {
    if (!isSoundOn()) return;
    playTone(800, 0.06, 'square', 0.06);
  },
  reply: () => {
    if (!isSoundOn()) return;
    playTone(1318.5, 0.1, 'sine', 0.08, 0);
    playTone(523.3, 0.15, 'sine', 0.08, 0.08);
  },
  error: () => {
    if (!isSoundOn()) return;
    playTone(200, 0.12, 'sawtooth', 0.08, 0);
    playTone(180, 0.12, 'sawtooth', 0.08, 0.15);
  },
  type: () => {
    if (!isSoundOn()) return;
    playTone(4000, 0.02, 'sine', 0.015);
  },
  hover: () => {
    if (!isSoundOn()) return;
    playTone(3000, 0.03, 'sine', 0.008);
  },
};
