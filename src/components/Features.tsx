const FEATURES = [
  {
    icon: '🎨',
    title: 'Text to Image',
    description: 'Transform your words into stunning visuals. Our AI understands context, lighting, composition, and style to create professional-quality images.',
    details: ['Natural language understanding', 'Multiple art styles', 'Custom aspect ratios']
  },
  {
    icon: '🔄',
    title: 'Image to Image',
    description: 'Upload any image and transform it with AI. Change styles, enhance quality, or completely reimagine your photos with simple text prompts.',
    details: ['Style transfer', 'Quality enhancement', 'Creative remix']
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Our optimized infrastructure delivers results in seconds, not minutes. Start creating immediately with no queue delays or waiting.',
    details: ['10-30 second generation', 'Real-time previews', 'Instant downloads']
  },
  {
    icon: '🌍',
    title: 'Global CDN',
    description: 'Deploy worldwide with our global infrastructure. Your images are generated close to your users for minimal latency everywhere.',
    details: ['200+ edge locations', '99.9% uptime', 'Automatic scaling']
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    description: 'Your creations are private by default. No data collection, no hidden tracking, no watermarks. You own what you create.',
    details: ['No data retention', 'No watermarks', 'Full ownership']
  },
  {
    icon: '🎯',
    title: 'API Access',
    description: 'Integrate AI image generation directly into your apps with our developer-friendly API. Build powerful workflows with ease.',
    details: ['REST API', 'SDK libraries', 'Webhooks support']
  }
];

export default function Features() {
  return (
    <section id="features" style={{
      padding: '6rem 2rem',
      background: 'var(--vercel-white)'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="badge badge-blue mb-3">✨ Features</span>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 600,
            letterSpacing: '-2px',
            marginBottom: '1rem'
          }}>
            Everything You Need to Create
          </h2>
          <p style={{ color: 'var(--vercel-gray-600)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
            Powerful tools designed for creators, developers, and businesses.
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="card"
              style={{
                padding: '1.5rem',
                animation: `fadeInUp 0.5s ease ${index * 0.1}s both`
              }}
            >
              {/* Icon */}
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem'
              }}>
                {feature.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
                letterSpacing: '-0.5px'
              }}>
                {feature.title}
              </h3>

              {/* Description */}
              <p style={{
                color: 'var(--vercel-gray-600)',
                lineHeight: 1.6,
                marginBottom: '1rem'
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
                      color: 'var(--vercel-gray-500)',
                      fontSize: '0.875rem',
                      marginBottom: '0.25rem'
                    }}
                  >
                    <span style={{ color: 'var(--develop-blue)' }}>✓</span>
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
