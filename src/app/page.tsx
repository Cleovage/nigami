"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${6 + Math.random() * 10}s`,
            width: `${1.5 + Math.random() * 3.5}px`,
            height: `${1.5 + Math.random() * 3.5}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`landing-page ${loaded ? "landing-page--loaded" : ""}`}>
      {/* Loading overlay */}
      <div className={`loading-screen ${loaded ? "loading-screen--done" : ""}`}>
        <div className="loading-spinner-ring">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" className="loading-ring-track" />
            <circle cx="50" cy="50" r="40" className="loading-ring-fill" />
          </svg>
        </div>
        <span className="loading-text">LOADING</span>
      </div>

      {/* God rays from the top */}
      <GodRays />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Noise texture */}
      <div className="noise-overlay" />

      {/* Vignette */}
      <div className="vignette-overlay" />

      {/* Unicorn Studio animated background */}
      <div className="unicorn-bg">
        <iframe
          src="https://unicorn.studio/embed/8bTbhOsualnAQRsjnKbs"
          width="100%"
          height="100%"
          style={{ border: "none", position: "absolute", inset: 0 }}
          loading="lazy"
          title="Animated background"
        />
      </div>

      {/* Animated background orbs */}
      <div className="hero-bg-scene">
        <div className="hero-orb hero-orb--main" />
        <div className="hero-orb hero-orb--accent" />
        <div className="hero-orb hero-orb--tertiary" />
        <div className="hero-mesh" />
      </div>

      {/* Hero Section */}
      <section className="landing-hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <motion.div
            className="hero-badge-glow"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="hero-badge-new">
              <span className="badge-dot" />
              ANIME QUIZ
            </span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="title-line">
              <span className="title-glow-text">Anime</span>
            </span>
            <span className="title-line">
              <span className="title-glow-text title-glow-text--accent">Quiz</span>
            </span>
            {/* Horizontal beam behind title */}
            <div className="hero-title-beam" />
          </motion.h1>

          <motion.p
            className="hero-desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Test your anime knowledge. Identify scenes, openings, characters,
            and more. No login. Just pure anime trivia.
          </motion.p>

          <motion.div
            className="hero-cta-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <Link href="/modes" className="cta-btn cta-btn--primary cta-btn--glow-hover">
              <span className="cta-btn__text">Start Playing</span>
              <span className="cta-btn__arrow">&rarr;</span>
              <div className="cta-btn__glow" />
              <div className="cta-btn__ring-glow" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
