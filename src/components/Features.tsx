// SVG Icons (Lucide-style stroke icons)
const Icons = {
  paintbrush: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/>
      <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/>
      <path d="M14.5 17.5 4.5 15"/>
    </svg>
  ),
  refresh: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </svg>
  ),
  zap: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  globe: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
      <path d="M2 12h20"/>
    </svg>
  ),
  lock: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  target: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  bolt: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
};

const FEATURES = [
  {
    icon: 'paintbrush',
    gradient: 'linear-gradient(135deg, #2563eb, #0891b2)',
    title: 'Text to Image',
    description: 'Transform your words into stunning visuals. Our AI understands context, lighting, composition, and style.',
    details: ['Natural language understanding', 'Professional quality output', 'Custom aspect ratios']
  },
  {
    icon: 'refresh',
    gradient: 'linear-gradient(135deg, #0d9488, #0891b2)',
    title: 'Image to Image',
    description: 'Upload any image and transform it with AI. Change styles, enhance quality, or reimagine completely.',
    details: ['Style transfer', 'Quality enhancement', 'Creative remix']
  },
  {
    icon: 'zap',
    gradient: 'linear-gradient(135deg, #ea7c0a, #ea580c)',
    title: 'Lightning Fast',
    description: 'Optimized infrastructure delivers results in seconds. Start creating immediately with no delays.',
    details: ['10-30 second generation', 'Real-time previews', 'Instant downloads']
  },
  {
    icon: 'globe',
    gradient: 'linear-gradient(135deg, #0891b2, #0d9488)',
    title: 'Global CDN',
    description: 'Deploy worldwide with our global infrastructure. Your images are generated close to your users.',
    details: ['200+ edge locations', '99.9% uptime', 'Automatic scaling']
  },
  {
    icon: 'lock',
    gradient: 'linear-gradient(135deg, #16a34a, #15803d)',
    title: 'Privacy First',
    description: 'Your creations are private by default. No data collection, no watermarks. You own what you create.',
    details: ['No data retention', 'No watermarks', 'Full ownership']
  },
  {
    icon: 'target',
    gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    title: 'API Access',
    description: 'Integrate AI image generation directly into your apps with our developer-friendly API.',
    details: ['REST API', 'SDK libraries', 'Webhooks support']
  }
];

export default function Features() {
  return (
    <section id="features" className="section-padded" style={{
      background: 'var(--bg-secondary)',
      position: 'relative'
    }}>
      {/* Subtle Grid Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(20,20,19,0.04) 1px, transparent 0)',
        backgroundSize: '32px 32px'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(37, 99, 235, 0.08)',
            border: '1px solid rgba(37, 99, 235, 0.15)',
            borderRadius: 'var(--radius-full)',
            marginBottom: '1rem'
          }}>
            <span style={{ color: 'var(--accent-primary)', display: 'flex' }}>{Icons.bolt}</span>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--accent-primary)'
            }}>
              Features
            </span>
          </div>
          
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: '0.75rem'
          }}>
            Everything You Need to Create
          </h2>
          
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.0625rem',
            maxWidth: '550px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Powerful tools designed for creators, developers, and businesses.
          </p>
        </div>

        {/* Features Grid - Wider cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1300px',
          margin: '0 auto'
        }}>
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="card"
              style={{
                padding: '1.75rem',
                animation: `fadeInUp 0.5s ease ${index * 0.08}s both`
              }}
            >
              {/* Icon */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-lg)',
                background: feature.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                marginBottom: '1.25rem',
                boxShadow: 'var(--shadow-md)'
              }}>
                {Icons[feature.icon as keyof typeof Icons]}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
                letterSpacing: '-0.01em'
              }}>
                {feature.title}
              </h3>

              {/* Description */}
              <p style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '1rem',
                fontSize: '0.9375rem'
              }}>
                {feature.description}
              </p>

              {/* Details */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {feature.details.map((detail, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.8125rem',
                      marginBottom: '0.25rem'
                    }}
                  >
                    <span style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: feature.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.625rem',
                      color: 'white',
                      flexShrink: 0
                    }}>
                      ✓
                    </span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}