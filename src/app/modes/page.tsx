"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MODES } from "@/lib/modeConfig";
import { useCallback } from "react";

function GodRays() {
  return (
    <div className="god-rays-container">
      <div className="god-ray god-ray--1" />
      <div className="god-ray god-ray--2" />
      <div className="god-ray god-ray--3" />
      <div className="god-ray god-ray--4" />
      <div className="god-ray god-ray--5" />
      <div className="god-ray god-ray--6" />
      <div className="god-ray god-ray--7" />
      <div className="god-rays-source" />
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="particles-container">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${6 + Math.random() * 10}s`,
            width: `${1.5 + Math.random() * 3}px`,
            height: `${1.5 + Math.random() * 3}px`,
          }}
        />
      ))}
    </div>
  );
}

function GlassCard({ m, i }: { m: (typeof MODES)[number]; i: number }) {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: i * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={`/play/${m.key}`}
        className="glass-card"
        prefetch={false}
        onMouseMove={handleMouseMove}
      >
        <div className="glass-card__glow" />
        <div className="glass-card__spotlight" />
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
        <div className="glass-card__edge-glow" />
      </Link>
    </motion.div>
  );
}

export default function ModesPage() {
  return (
    <div className="modes-page-wrapper">
      {/* Background effects */}
      <GodRays />
      <FloatingParticles />
      <div className="noise-overlay" />
      <div className="vignette-overlay" />

      <div className="hero-bg-scene">
        <div className="hero-orb hero-orb--main" />
        <div className="hero-orb hero-orb--accent" />
        <div className="hero-orb hero-orb--tertiary" />
        <div className="hero-mesh" />
      </div>

      <section className="modes-section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">CHOOSE YOUR CHALLENGE</span>
          <h2 className="section-title">Game Modes</h2>
          <p className="section-subtitle">Select a mode and test your anime knowledge</p>
        </motion.div>

        <div className="modes-grid">
          {MODES.map((m, i) => (
            <GlassCard key={m.key} m={m} i={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
