const FEATURES = [
  {
    icon: '🎨',
    gradient: 'linear-gradient(135deg, #2563eb, #0891b2)',
    title: 'Text to Image',
    description: 'Transform your words into stunning visuals. Our AI understands context, lighting, composition, and style.',
    details: ['Natural language understanding', 'Professional quality output', 'Custom aspect ratios']
  },
  {
    icon: '🔄',
    gradient: 'linear-gradient(135deg, #0d9488, #0891b2)',
    title: 'Image to Image',
    description: 'Upload any image and transform it with AI. Change styles, enhance quality, or reimagine completely.',
    details: ['Style transfer', 'Quality enhancement', 'Creative remix']
  },
  {
    icon: '⚡',
    gradient: 'linear-gradient(135deg, #ea7c0a, #ea580c)',
    title: 'Lightning Fast',
    description: 'Optimized infrastructure delivers results in seconds. Start creating immediately with no delays.',
    details: ['10-30 second generation', 'Real-time previews', 'Instant downloads']
  },
  {
    icon: '🌍',
    gradient: 'linear-gradient(135deg, #0891b2, #0d9488)',
    title: 'Global CDN',
    description: 'Deploy worldwide with our global infrastructure. Your images are generated close to your users.',
    details: ['200+ edge locations', '99.9% uptime', 'Automatic scaling']
  },
  {
    icon: '🔒',
    gradient: 'linear-gradient(135deg, #16a34a, #15803d)',
    title: 'Privacy First',
    description: 'Your creations are private by default. No data collection, no watermarks. You own what you create.',
    details: ['No data retention', 'No watermarks', 'Full ownership']
  },
  {
    icon: '🎯',
    gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    title: 'API Access',
    description: 'Integrate AI image generation directly into your apps with our developer-friendly API.',
    details: ['REST API', 'SDK libraries', 'Webhooks support']
  }
];

export default function Features() {
  return (
    <section id="features" style={{
      padding: '6rem 2rem',
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
            <span style={{ fontSize: '1rem' }}>⚡</span>
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

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="card"
              style={{
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
                fontSize: '1.75rem',
                marginBottom: '1.25rem',
                boxShadow: 'var(--shadow-md)'
              }}>
                {feature.icon}
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
