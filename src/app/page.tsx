import Hero from '@/components/Hero';

export default function HomePage() {
  return (
    <>
      <Hero />
      
      {/* Features Section */}
      <section style={{ 
        padding: '6rem 2rem',
        background: 'var(--vercel-white)'
      }}>
        <div className="container">
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 600,
            letterSpacing: '-1.28px',
            marginBottom: '3rem'
          }}>
            Why Choose AI Studio?
          </h2>
          
          <div className="grid-2" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Feature 1 */}
            <div className="card" style={{ textAlign: 'left' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0a72ef, #0072f5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-card-title" style={{ marginBottom: '0.5rem' }}>Flux.1 Model</h3>
              <p style={{ color: 'var(--vercel-gray-600)', lineHeight: 1.6 }}>
                State-of-the-art image generation powered by Black Forest Labs Flux.1, 
                delivering unprecedented quality and detail.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card" style={{ textAlign: 'left' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #de1d8d, #ff5b4f)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-card-title" style={{ marginBottom: '0.5rem' }}>Lightning Fast</h3>
              <p style={{ color: 'var(--vercel-gray-600)', lineHeight: 1.6 }}>
                Optimized infrastructure delivers images in seconds, not minutes. 
                Start creating immediately with no queue delays.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card" style={{ textAlign: 'left' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ff5b4f, #ff8a00)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                  <path d="M9 9h6v6H9z" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-card-title" style={{ marginBottom: '0.5rem' }}>Image Remix</h3>
              <p style={{ color: 'var(--vercel-gray-600)', lineHeight: 1.6 }}>
                Upload your images and transform them with AI. Change styles, 
                enhance quality, or completely reimagining your photos.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="card" style={{ textAlign: 'left' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-card-title" style={{ marginBottom: '0.5rem' }}>Privacy First</h3>
              <p style={{ color: 'var(--vercel-gray-600)', lineHeight: 1.6 }}>
                Your creations are private by default. No data collection, 
                no hidden tracking, just pure creative freedom.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section style={{ 
        padding: '6rem 2rem',
        background: 'var(--vercel-black)',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 600,
            letterSpacing: '-2px',
            color: 'var(--vercel-white)',
            marginBottom: '1rem'
          }}>
            Ready to Create?
          </h2>
          <p style={{ 
            color: 'var(--vercel-gray-400)',
            fontSize: '1.125rem',
            marginBottom: '2rem'
          }}>
            Join thousands of creators using AI Studio every day.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/generate" className="btn btn-primary btn-large">
              Start Creating Free
            </a>
            <a href="/gallery" className="btn btn-secondary btn-large" style={{ color: 'var(--vercel-white)' }}>
              View Gallery
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
