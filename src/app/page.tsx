import Link from "next/link";
import { MODES } from "@/lib/modeConfig";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <span className="hero-badge">🎌 Presentation Mode</span>
        <h1>Anime Quiz</h1>
        <p className="hero-subtitle">
          Pick a mode, show the media, reveal the answer — hype up the crowd.
          No login. No typing. Just pure anime knowledge.
        </p>
      </section>

      {/* Mode grid */}
      <section className="mode-grid">
        {MODES.map((m) => (
          <Link href={`/play/${m.key}`} key={m.key} className="mode-card" prefetch={false}>
            <div>
              <span className="mode-card__icon">{m.icon}</span>
              <h3 className="mode-card__title">{m.title}</h3>
              <p className="mode-card__desc">{m.subtitle}</p>
            </div>
            <span className="mode-card__cta">Play →</span>
          </Link>
        ))}
      </section>
    </>
  );
}
