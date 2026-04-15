'use client';

export default function CTASection() {
  return (
    <section style={{
      padding: '8rem 2rem',
      background: 'var(--vercel-black)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Gradient Orbs */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(10, 114, 239, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(222, 29, 141, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          {/* Badge */}
          <span className="badge badge-green mb-4" style={{ animation: 'floating 3s ease-in-out infinite' }}>
            🚀 Get Started Free
          </span>

          {/* Title */}
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 700,
            letterSpacing: '-3px',
            color: 'var(--vercel-white)',
            marginBottom: '1.5rem',
            lineHeight: 1.1
          }}>
            Ready to Create{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0a72ef, #de1d8d, #ff5b4f)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Amazing Images
            </span>
            ?
          </h2>

          {/* Description */}
          <p style={{
            color: 'var(--vercel-gray-400)',
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
            <a href="#pricing" className="btn btn-secondary btn-large" style={{ color: 'var(--vercel-white)' }}>
              View Pricing
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--vercel-gray-500)' }}>
              <span style={{ color: 'var(--develop-blue)' }}>✓</span>
              <span style={{ fontSize: '0.875rem' }}>No credit card required</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--vercel-gray-500)' }}>
              <span style={{ color: 'var(--develop-blue)' }}>✓</span>
              <span style={{ fontSize: '0.875rem' }}>10 free images per month</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--vercel-gray-500)' }}>
              <span style={{ color: 'var(--develop-blue)' }}>✓</span>
              <span style={{ fontSize: '0.875rem' }}>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
