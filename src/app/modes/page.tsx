"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MODES } from "@/lib/modeConfig";

export default function ModesPage() {
  return (
    <div className="app-shell">
      <section className="modes-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">CHOOSE YOUR CHALLENGE</span>
          <h2 className="section-title">Game Modes</h2>
        </motion.div>

        <div className="modes-grid">
          {MODES.map((m, i) => (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link href={`/play/${m.key}`} className="glass-card" prefetch={false}>
                <div className="glass-card__glow" />
                <div className="glass-card__content">
                  <div className="glass-card__icon-wrap">
                    <span className="glass-card__icon">{m.icon}</span>
                  </div>
                  <h3 className="glass-card__title">{m.title}</h3>
                  <p className="glass-card__desc">{m.subtitle}</p>
                </div>
                <div className="glass-card__footer">
                  <span className="glass-card__cta">
                    Play Now
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
                <div className="glass-card__border-glow" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
