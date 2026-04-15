'use client';

import Link from 'next/link';
import ParticleCanvas from './ParticleCanvas';

export default function Hero() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6rem 2rem',
      background: 'var(--bg-primary)',
      overflow: 'hidden'
    }}>
      <ParticleCanvas />
      
      {/* Gradient Orbs */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '30%',
        right: '15%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '900px' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(124, 58, 237, 0.15)',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          borderRadius: 'var(--radius-full)',
          marginBottom: '1.5rem',
          animation: 'float 3s ease-in-out infinite'
        }}>
          <span style={{ fontSize: '1rem' }}>✨</span>
          <span style={{ 
            fontSize: '0.875rem', 
            fontWeight: 600,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Powered by Flux.1 Dev
          </span>
        </div>
        
        {/* Main Title */}
        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 5rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          color: 'var(--text-primary)'
        }}>
          Create Stunning{' '}
          <span style={{
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AI Images
          </span>
          <br />
          in Seconds
        </h1>
        
        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.7
        }}>
          Transform your ideas into breathtaking visuals with state-of-the-art AI. 
          Text to image, image remix, and unlimited creativity.
        </p>
        
        {/* CTA Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link href="/generate" className="btn btn-primary btn-large">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ✨ Start Creating Free
            </span>
          </Link>
          <Link href="/gallery" className="btn btn-secondary btn-large">
            View Gallery
          </Link>
        </div>
        
        {/* Feature Pills */}
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          justifyContent: 'center',
          marginTop: '2.5rem',
          flexWrap: 'wrap'
        }}>
          {[
            { icon: '🎨', text: 'Text to Image' },
            { icon: '🔄', text: 'Image Remix' },
            { icon: '⚡', text: '10s Generation' },
            { icon: '🌍', text: '4K Resolution' }
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        animation: 'float 2s ease-in-out infinite'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)">
          <path d="M12 5v14M5 12l7 7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
