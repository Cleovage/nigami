"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getModeByKey } from "@/lib/modeConfig";
import { sfx } from "@/lib/soundFx";
import type { MediaApiResponse, MediaItem, ModeKey } from "@/types/quiz";

/* ── helpers ── */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TIMER_PRESETS = [0, 10, 15, 20, 30] as const;
const RING_R = 42;
const RING_C = 2 * Math.PI * RING_R;

/* ── component ── */

export default function PresenterGame({ mode }: { mode: ModeKey }) {
  const def = getModeByKey(mode);

  // Opening mode is the only mode where the image itself is blurred
  const isOpeningMode = mode === "opening";

  const [items, setItems] = useState<MediaItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // tracks whether the current media element has finished loading;
  // a black cover is shown until it does, preventing the brief-flash glitch
  const [mediaLoaded, setMediaLoaded] = useState(false);

  /* timer + sound state */
  const [timerDuration, setTimerDuration] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timedOut, setTimedOut] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const soundRef = useRef(true);
  useEffect(() => { soundRef.current = soundOn; }, [soundOn]);

  const timerActive = timerDuration > 0;
  const timerProgress = timerActive && !timedOut ? timeLeft / timerDuration : 1;
  const dashOffset = RING_C * (1 - timerProgress);
  const timerWarning = timerActive && timeLeft <= 5 && timeLeft > 0 && !revealed && !timedOut;

  const current = items[idx] as MediaItem | undefined;
  const total = items.length;
  const round = idx + 1;

  /* ── fetch ── */
  const load = useCallback(async () => {
    setLoading(true);
    setMediaLoaded(false);
    setError(null);
    try {
      const res = await fetch(`/api/media?mode=${encodeURIComponent(mode)}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load media");
      const data: MediaApiResponse = await res.json();
      setItems(shuffle(data.items));
      setIdx(0);
      setRevealed(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => { void load(); }, [load]);

  // Reset mediaLoaded + timedOut whenever the active item changes.
  // Both must clear together so the stale timedOut guard works on next-round advance.
  useEffect(() => {
    setMediaLoaded(false);
    setTimedOut(false);
  }, [idx]);

  /* ── timer reset ── */
  useEffect(() => { setTimeLeft(timerDuration); }, [idx, timerDuration]);

  /* ── timer countdown ── */
  // IMPORTANT: the `timedOut` guard prevents a stale timeLeft=0 (from the
  // previous round) from firing when the user advances to the next round
  // before React has processed the timer-reset effect's state update.
  useEffect(() => {
    if (!timerActive || revealed || !mediaLoaded || !current || timedOut) return;
    if (timeLeft <= 0) {
      // Time's up — do NOT auto-reveal; just signal "timed out" visually + audibly.
      setTimedOut(true);
      if (soundRef.current) sfx.timeUp();
      return;
    }
    if (timeLeft <= 5 && soundRef.current) sfx.tick();
    const tid = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(tid);
  }, [timerActive, revealed, mediaLoaded, current, timeLeft, timedOut]);

  /* ── actions ── */
  const reveal = useCallback(() => {
    setRevealed(true);
    if (soundRef.current) sfx.reveal();
  }, []);

  const next = useCallback(() => {
    if (!total) return;
    if (idx >= total - 1) {
      setItems((p) => shuffle(p));
      setIdx(0);
    } else {
      setIdx((p) => p + 1);
    }
    setRevealed(false);
    if (soundRef.current) sfx.next();
  }, [idx, total]);

  /* ── keyboard ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "r" || e.key === "R") reveal();
      if (e.key === "n" || e.key === "N") next();
      if (e.key === "m" || e.key === "M") setSoundOn((v) => !v);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [reveal, next]);

  /* ── title ── */
  const title = def?.title ?? "Unknown Mode";
  const icon = def?.icon ?? "❓";

  /* ── states ── */
  if (!def) {
    return (
      <div className="state-card state-card--error">
        <span className="state-card__icon">❌</span>
        <h3 className="state-card__title">Invalid Mode</h3>
        <p className="state-card__desc">This quiz mode does not exist.</p>
        <Link href="/" className="btn btn--back">← Back to Home</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="state-card">
        <div className="spinner" />
        <h3 className="state-card__title">Loading…</h3>
        <p className="state-card__desc">Preparing your anime challenge</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-card state-card--error">
        <span className="state-card__icon">⚠️</span>
        <h3 className="state-card__title">Something went wrong</h3>
        <p className="state-card__desc">{error}</p>
        <button className="btn btn--reveal" onClick={() => void load()}>Retry</button>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="state-card">
        <span className="state-card__icon">📂</span>
        <h3 className="state-card__title">No Media Yet</h3>
        <p className="state-card__desc">
          Drop files into the <strong>{def.folderName}</strong> folder and click refresh.
        </p>
        <button className="btn btn--reveal" onClick={() => void load()}>Refresh</button>
      </div>
    );
  }

  // For opening mode the image itself is blurred until the reveal button is pressed.
  // For every other mode the image/video is always fully visible — only the answer
  // text in the panel below is hidden.
  const imageBlurred = isOpeningMode && !revealed;

  /* ── main render ── */
  return (
    <div className="play-layout">
      {/* header */}
      <div className="play-header">
        <div className="play-header__left">
          <h2>{icon} {title}</h2>
          <div className="header-badges">
            <span className="round-badge">Round {round} / {total}</span>
            {current?.difficulty && (
              <span className={`difficulty-badge difficulty-badge--${current.difficulty.toLowerCase()}`}>
                {current.difficulty}
              </span>
            )}
          </div>
        </div>
        <div className="play-header__right">
          {/* timer presets */}
          <div className="timer-config">
            <span className="timer-config__label">⏱</span>
            {TIMER_PRESETS.map((p) => (
              <button
                key={p}
                className={`timer-config__btn${timerDuration === p ? " timer-config__btn--active" : ""}`}
                onClick={() => setTimerDuration(p)}
              >
                {p === 0 ? "Off" : `${p}s`}
              </button>
            ))}
          </div>
          {/* sound toggle */}
          <button
            className={`btn-icon${soundOn ? "" : " btn-icon--muted"}`}
            onClick={() => setSoundOn((v) => !v)}
            title={soundOn ? "Mute sounds" : "Unmute sounds"}
          >
            {soundOn ? "🔊" : "🔇"}
          </button>
          <Link href="/" className="btn btn--back">← Modes</Link>
        </div>
      </div>

      {/* progress dots */}
      <div className="progress-bar">
        {items.map((_, i) => (
          <span
            key={i}
            className={`progress-dot ${i === idx ? "progress-dot--active" : i < idx ? "progress-dot--done" : ""}`}
          />
        ))}
      </div>

      {/* media stage + ambient glow wrapper */}
      <div className="stage-glow-wrap">
        {/* Blurred ambient light — matches displayed picture */}
        <div className="stage-ambient" aria-hidden="true">
          {current.kind !== "video" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`ambient-${current.id}`}
              src={current.contentUrl}
              alt=""
              className="stage-ambient__img"
            />
          ) : (
            <div className="stage-ambient__fallback" />
          )}
        </div>

        {/* Godrays emanating from stage */}
        <div className="stage-godrays" aria-hidden="true">
          <div className="stage-godray stage-godray--1" />
          <div className="stage-godray stage-godray--2" />
          <div className="stage-godray stage-godray--3" />
          <div className="stage-godray stage-godray--4" />
        </div>

        <div className={`stage${timerWarning ? " stage--warning" : ""}`} aria-live="polite">

          {/* Vector-animated cover — wipes left→right to reveal new media */}
          <div className={`stage__loading-cover${mediaLoaded ? " stage__loading-cover--done" : ""}`}>
            {/* horizontal scanline sweeps top→bottom while loading */}
            <div className="stage__scanline" />
            {/* corner-bracket targeting reticle */}
            <svg
              className="stage__brackets"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* corners */}
              <polyline points="0,18 0,0 18,0"        fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.45" />
              <polyline points="82,0 100,0 100,18"    fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.45" />
              <polyline points="0,82 0,100 18,100"    fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.45" />
              <polyline points="82,100 100,100 100,82" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.45" />
              {/* centre crosshair */}
              <circle cx="50" cy="50" r="11" fill="none" stroke="white" strokeWidth="0.7" strokeOpacity="0.18" />
              <line x1="44" y1="50" x2="56" y2="50" stroke="white" strokeWidth="0.8" strokeOpacity="0.28" />
              <line x1="50" y1="44" x2="50" y2="56" stroke="white" strokeWidth="0.8" strokeOpacity="0.28" />
            </svg>
          </div>

          {/* Timer ring overlay */}
          {timerActive && !revealed && (
            <div className={`timer-ring${timerWarning ? " timer-ring--warning" : ""}${timedOut ? " timer-ring--timed-out" : ""}`}>
              <svg className="timer-ring__svg" viewBox="0 0 100 100">
                <circle className="timer-ring__bg" cx="50" cy="50" r={RING_R} />
                <circle
                  className="timer-ring__progress"
                  cx="50" cy="50" r={RING_R}
                  strokeDasharray={RING_C}
                  strokeDashoffset={timedOut ? RING_C : dashOffset}
                />
              </svg>
              <span className="timer-ring__text">{timedOut ? "✕" : timeLeft}</span>
            </div>
          )}

          <div className={`stage__inner${imageBlurred ? " stage__inner--blurred" : ""}`}>
            {current.kind === "video" ? (
              <video
                key={current.id}
                src={current.contentUrl}
                controls
                preload="metadata"
                playsInline
                className="stage__media"
                onLoadedMetadata={() => setMediaLoaded(true)}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={current.id}
                src={current.contentUrl}
                alt="Quiz media"
                className="stage__media"
                loading="eager"
                onLoad={() => setMediaLoaded(true)}
              />
            )}
          </div>

          {/* Blurred-overlay prompt — only shown in opening mode before reveal */}
          {isOpeningMode && (
            <div className={`stage__overlay ${revealed ? "stage__overlay--hidden" : ""}`}>
              <span className="stage__overlay-text">🎵 Guess the Opening!</span>
            </div>
          )}
        </div>
      </div>

      {/* answer panel — answer text always hidden until reveal, image only hidden for opening */}
      <div className={`answer-panel ${revealed ? "answer-panel--revealed" : ""}`}>
        <span className="answer-panel__label">Answer</span>
        <span key={`${idx}-${String(revealed)}`} className="answer-panel__text">
          {revealed ? current.answer : "• • • • •"}
        </span>
      </div>

      {/* controls */}
      <div className="controls">
        <button
          className="btn btn--reveal"
          disabled={revealed}
          onClick={reveal}
        >
          🔓 Reveal Answer
        </button>
        <button className="btn btn--next" onClick={next}>
          {idx >= total - 1 ? "🔄 Restart" : "➡️ Next Round"}
        </button>
      </div>

      {/* keyboard hints */}
      <div className="shortcut-hint">
        <span><span className="kbd">R</span> Reveal</span>
        <span><span className="kbd">N</span> Next</span>
        <span><span className="kbd">M</span> Mute</span>
      </div>
    </div>
  );
}
