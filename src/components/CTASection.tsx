'use client';

import { SignUpButton } from '@clerk/nextjs';

export default function CTASection() {
  return (
    <section className="section-padded" style={{
      background: 'var(--bg-secondary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Ambient Glow Effects - Elegant Warm Orbs */}
      <div style={{
        position: 'absolute',
        top: '-25%',
        left: '50%',
        transform: 'translate(-50%, 0%)',
        width: '1000px',
        height: '700px',
        background: 'radial-gradient(ellipse, rgba(255, 140, 66, 0.08) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-15%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255, 179, 128, 0.07) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '20%',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(255, 140, 66, 0.06) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(255, 140, 66, 0.08)',
            border: '1px solid rgba(255, 140, 66, 0.15)',
            borderRadius: 'var(--radius-full)',
            marginBottom: '1.5rem',
          }}>
            <span style={{ fontSize: '1rem' }}>🚀</span>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--accent-primary)'
            }}>
              Get Started Free
            </span>
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
            lineHeight: 1.1
          }}>
            Ready to Create{' '}
            <span style={{
              color: 'var(--accent-primary)'
            }}>
              Amazing Images
            </span>
            ?
          </h2>

          {/* Description */}
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.25rem',
            marginBottom: '2.5rem',
            lineHeight: 1.6
          }}>
            Join thousands of creators already using AI Studio.
            No credit card required. Start creating in seconds.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <SignUpButton mode="modal">
              <button
                className="btn btn-primary btn-large"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.75rem',
                  background: 'var(--gradient-primary)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-glow-orange)',
                }}
              >
                ✨ Start Creating Free
              </button>
            </SignUpButton>
            <a href="/gallery" className="btn btn-secondary btn-large">
              View Gallery
            </a>
          </div>

          {/* Trust Indicators */}
          <div style={{
            marginTop: '3rem',
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {[
              { check: '✓', text: 'No credit card required' },
              { check: '✓', text: '10 free images per month' },
              { check: '✓', text: 'Cancel anytime' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{item.check}</span>
                <span style={{ fontSize: '0.875rem' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
