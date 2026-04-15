'use client';

export default function CTASection() {
  return (
    <section style={{
      padding: '8rem 2rem',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Gradient Background Effects */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '600px',
        background: 'radial-gradient(ellipse, rgba(124, 58, 237, 0.2) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
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
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: 'var(--radius-full)',
            marginBottom: '1.5rem',
            animation: 'float 3s ease-in-out infinite'
          }}>
            <span style={{ fontSize: '1rem' }}>🚀</span>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#22c55e'
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
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
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
            <a href="/generate" className="btn btn-primary btn-large">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ✨ Start Creating Free
              </span>
            </a>
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
                <span style={{ color: '#22c55e', fontWeight: 600 }}>{item.check}</span>
                <span style={{ fontSize: '0.875rem' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
