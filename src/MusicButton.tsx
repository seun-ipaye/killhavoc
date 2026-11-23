import { useEffect, useRef, useState } from "react";

const SRC = "/audio/historia-intro.mp3";
const START = 0.8; // the file opens with ~0.8s of silence, so the music starts here
const END = 17.5; // seconds: each loop runs from 0:00.8 to 0:18
const TAIL = 0.55; // the old pass keeps playing this long past 0:18, fading out under the new one
// How much the volume dips at the loop point: 0 = no dip (exactly how it sounds now),
// 0.3 = a gentle dip, 1 = fades all the way to silence. The volume goes down before the
// end of the loop and comes back up after the start.
const LOOP_DIP = 0.9;
const DIP_SECONDS = 0.8; // how long the dip takes on each side of the loop point
const FADE_IN = 0.9; // seconds, when you press play
const FADE_OUT = 1.13; // seconds, when you press stop

// fade-out curve for the tail of a pass
const N = 64;
const curveOut = Float32Array.from({ length: N }, (_, i) =>
  Math.cos(((i / (N - 1)) * Math.PI) / 2),
);

export default function MusicButton() {
  const ctx = useRef<AudioContext | null>(null);
  const buffer = useRef<AudioBuffer | null>(null);
  const master = useRef<GainNode | null>(null);
  const passes = useRef<AudioBufferSourceNode[]>([]);
  const timer = useRef(0);
  const stopTimer = useRef(0);
  const [playing, setPlaying] = useState(false);

  // decode the clip at load (during the intro)
  useEffect(() => {
    const c = new AudioContext();
    const g = c.createGain();
    g.connect(c.destination);
    ctx.current = c;
    master.current = g;
    fetch(SRC)
      .then((r) => r.arrayBuffer())
      .then((data) => c.decodeAudioData(data))
      .then((b) => {
        buffer.current = b;
      })
      .catch(() => undefined);
    return () => {
      window.clearInterval(timer.current);
      window.clearTimeout(stopTimer.current);
      c.close();
    };
  }, []);

  const fadeTo = (value: number, seconds: number) => {
    const c = ctx.current;
    const g = master.current?.gain;
    if (!c || !g) return;
    const now = c.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(value, now + seconds);
  };

  // one pass of the clip, starting at audio time `when`. Each pass starts at full volume,
  // exactly at the start of the song, while the previous pass rings out under it.
  const schedule = (when: number, first: boolean) => {
    const c = ctx.current;
    const m = master.current;
    const buf = buffer.current;
    if (!c || !m || !buf) return;
    const g = c.createGain();
    g.connect(m);
    const len = END - START;
    const low = 1 - LOOP_DIP;
    if (first) {
      g.gain.setValueAtTime(1, when);
    } else {
      // after the start of the loop: come back up from the dip
      g.gain.setValueAtTime(low, when);
      g.gain.linearRampToValueAtTime(1, when + DIP_SECONDS);
    }
    // before the end of the loop: go down into the dip, then ring out
    g.gain.setValueAtTime(1, when + len - DIP_SECONDS);
    g.gain.linearRampToValueAtTime(low, when + len - 0.001);
    g.gain.setValueCurveAtTime(
      curveOut.map((v) => v * low),
      when + len,
      TAIL,
    );
    const src = c.createBufferSource();
    src.buffer = buf;
    src.connect(g);
    src.start(when, START, len + TAIL);
    passes.current.push(src);
    src.onended = () => {
      passes.current = passes.current.filter((p) => p !== src);
      g.disconnect();
    };
  };

  const stop = () => {
    setPlaying(false);
    window.clearInterval(timer.current);
    fadeTo(0, FADE_OUT);
    stopTimer.current = window.setTimeout(
      () => {
        passes.current.forEach((p) => p.stop());
        passes.current = [];
      },
      FADE_OUT * 1000 + 40,
    );
  };

  const toggle = async () => {
    const c = ctx.current;
    const m = master.current;
    if (!c || !m || !buffer.current) return;
    if (playing) return stop();

    window.clearTimeout(stopTimer.current);
    window.clearInterval(timer.current);
    passes.current.forEach((p) => p.stop()); // a fade-out may still be running
    passes.current = [];
    await c.resume();

    m.gain.cancelScheduledValues(0);
    m.gain.value = 0;
    let next = c.currentTime + 0.05;
    schedule(next, true);
    next += END - START;
    // keep the next pass queued a little ahead of time, on the audio clock
    timer.current = window.setInterval(() => {
      while (next < c.currentTime + 2) {
        schedule(next, false);
        next += END - START;
      }
    }, 200);
    setPlaying(true);
    fadeTo(1, FADE_IN);
  };

  return (
    <button
      className={`nav-music${playing ? " is-playing" : ""}`}
      type="button"
      onClick={toggle}
      aria-label={playing ? "stop music" : "play music"}
      aria-pressed={playing}
    >
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 18V6l11-2v12" />
        <circle cx="6.5" cy="18" r="2.5" />
        <circle cx="17.5" cy="16" r="2.5" />
      </svg>
    </button>
  );
}
