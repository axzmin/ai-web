'use client';

import Link from 'next/link';
import ParticleCanvas from './ParticleCanvas';

export default function Hero() {
  return (
    <section className="hero">
      <ParticleCanvas />
      
      {/* Gradient orbs for depth */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      
      {/* Badge */}
      <div className="badge badge-blue mb-3" style={{ animation: 'floating 3s ease-in-out infinite' }}>
        ✨ Powered by Flux.1
      </div>
      
      {/* Main Title */}
      <h1 className="hero-title">
        Create Stunning
        <br />
        <span style={{ 
          background: 'linear-gradient(135deg, #0a72ef, #de1d8d, #ff5b4f)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          AI Images
        </span>
      </h1>
      
      {/* Subtitle */}
      <p className="hero-subtitle">
        Transform your ideas into stunning visuals with state-of-the-art AI. 
        Text to image, image remix, and more.
      </p>
      
      {/* CTA Buttons */}
      <div className="hero-cta">
        <Link href="/generate" className="btn btn-primary btn-large">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L12.5 7.5L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7.5L10 2Z" fill="currentColor"/>
          </svg>
          Start Creating
        </Link>
        <Link href="/gallery" className="btn btn-secondary btn-large">
          View Gallery
        </Link>
      </div>
      
      {/* Feature Pills */}
      <div className="flex-center gap-2 mt-4" style={{ flexWrap: 'wrap' }}>
        <span className="badge">🎨 Text to Image</span>
        <span className="badge">🔄 Image Remix</span>
        <span className="badge">⚡ Flux.1 Model</span>
        <span className="badge">🌍 English First</span>
      </div>
      
      {/* Scroll indicator */}
      <div style={{ 
        position: 'absolute', 
        bottom: '2rem',
        animation: 'floating 2s ease-in-out infinite'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--vercel-gray-400)">
          <path d="M12 5v14M5 12l7 7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
