'use client';

import Link from 'next/link';

const Icons = {
  sparkles: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  ),
  paintbrush: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/>
      <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/>
      <path d="M14.5 17.5 4.5 15"/>
    </svg>
  ),
  refresh: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </svg>
  ),
  zap: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  image: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <circle cx="9" cy="9" r="2"/>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
};

export default function Hero() {
  return (
    <section className="section-padded" style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      overflow: 'hidden'
    }}>
      {/* Warm Gradient Orbs - Blue/Teal instead of Purple */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255, 140, 66, 0.12) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255, 140, 66, 0.1) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />
      
      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(255, 140, 66, 0.08)',
          border: '1px solid rgba(255, 140, 66, 0.2)',
          borderRadius: 'var(--radius-full)',
          marginBottom: '1.5rem',
          animation: 'float 3s ease-in-out infinite',
          color: 'var(--accent-primary)'
        }}>
          <span style={{ display: 'flex', color: 'var(--accent-primary)' }}>{Icons.sparkles}</span>
          <span style={{ 
            fontSize: '0.875rem', 
            fontWeight: 600,
            color: 'var(--accent-primary)'
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
            color: 'var(--accent-primary)'
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
              {Icons.sparkles}
              Start Creating Free
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
            { icon: 'paintbrush', text: 'Text to Image' },
            { icon: 'refresh', text: 'Image Remix' },
            { icon: 'zap', text: '10s Generation' },
            { icon: 'image', text: '4K Resolution' }
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)'
              }}
            >
              <span style={{ display: 'flex', color: 'var(--accent-primary)' }}>{Icons[item.icon as keyof typeof Icons]}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
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