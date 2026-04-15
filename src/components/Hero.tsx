'use client';

import Link from 'next/link';
import ParticleCanvas from './ParticleCanvas';

export default function Hero() {
  return (
    <section className="hero">
      <ParticleCanvas />
      
      {/* Gradient Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Badge */}
      <div className="hero-badge">
        <span style={{ fontSize: '1rem' }}>✨</span>
        <span>Powered by Flux.1 — State-of-the-art AI</span>
      </div>

      {/* Main Title */}
      <h1 className="hero-title">
        Transform Your Ideas Into
        <br />
        <span className="text-gradient">Stunning Artwork</span>
      </h1>

      {/* Subtitle */}
      <p className="hero-subtitle">
        Create professional-quality images in seconds. Text-to-image, image remix, 
        and endless creative possibilities — all in your browser.
      </p>

      {/* CTA Buttons */}
      <div className="hero-cta">
        <Link href="/generate" className="btn btn-primary btn-large">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L12.5 7.5L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7.5L10 2Z" fill="currentColor"/>
          </svg>
          Start Creating Free
        </Link>
        <Link href="#gallery" className="btn btn-secondary btn-large">
          View Gallery
        </Link>
      </div>

      {/* Stats */}
      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-value">1M+</div>
          <div className="hero-stat-label">Images Created</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-value">50K+</div>
          <div className="hero-stat-label">Happy Creators</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-value">4.9</div>
          <div className="hero-stat-label">User Rating</div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--vercel-gray-400)',
        animation: 'float 2s ease-in-out infinite'
      }}>
        <span style={{ fontSize: '0.75rem' }}>Scroll to explore</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 5v10M5 12l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
