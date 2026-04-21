'use client';

import Link from 'next/link';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out AI Studio',
    features: [
      '25 images per month',
      'Standard quality',
      'Flux.1 Schnell model',
      'Square aspect ratio only',
      'Community support',
      'Watermarked exports',
    ],
    cta: 'Get Started',
    ctaHref: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For creators who need more power',
    features: [
      '500 images per month',
      'HD quality',
      'All Flux.1 models',
      'All aspect ratios',
      'Priority generation',
      'No watermarks',
      'Download original resolution',
      'Email support',
    ],
    cta: 'Start Pro',
    ctaHref: '/register?plan=pro',
    highlight: true,
  },
  {
    name: 'Unlimited',
    price: '$29',
    period: '/month',
    description: 'For heavy users and teams',
    features: [
      'Unlimited images',
      'HD quality + upscaling',
      'All Flux.1 models',
      'All aspect ratios',
      'Batch generation',
      'No watermarks',
      'Download original resolution',
      'API access',
      'Dedicated support',
      'Team collaboration',
    ],
    cta: 'Go Unlimited',
    ctaHref: '/register?plan=unlimited',
    highlight: false,
  },
];

const FAQ_ITEMS = [
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes, you can cancel at any time. Your access will continue until the end of your billing period.',
  },
  {
    q: 'Do unused images roll over?',
    a: 'On the Free plan, unused images do not roll over. On Pro and Unlimited, your monthly allocation resets each billing cycle.',
  },
  {
    q: 'What happens if I hit my limit?',
    a: 'You can upgrade your plan anytime, or wait until your next billing cycle. We also offer pay-as-you-go top-ups.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'Yes! Pro comes with a 7-day free trial so you can experience all features before committing.',
  },
];

export default function PricingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      padding: '5rem 1.5rem 4rem',
    }}>
      {/* Warm gradient accent */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '500px',
        background: 'radial-gradient(ellipse at 50% -20%, rgba(255, 140, 66, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.0625rem',
          }}>
            Start for free. Upgrade when you need more.
          </p>
        </div>

        {/* Pricing Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4rem',
        }}>
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: plan.highlight ? 'var(--bg-card)' : 'var(--bg-card)',
                border: plan.highlight
                  ? '2px solid var(--accent-primary)'
                  : '1px solid var(--border-default)',
                borderRadius: '20px',
                padding: '1.75rem',
                position: 'relative',
                boxShadow: plan.highlight ? 'var(--shadow-xl)' : 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {plan.highlight && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.875rem',
                  borderRadius: '9999px',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  boxShadow: '0 2px 8px rgba(255, 140, 66, 0.30)',
                }}>
                  Most Popular
                </div>
              )}

              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{
                  fontSize: '1.0625rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.25rem',
                }}>
                  {plan.name}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {plan.description}
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.03em',
                }}>
                  {plan.price}
                </span>
                <span style={{
                  fontSize: '0.9375rem',
                  color: 'var(--text-muted)',
                }}>
                  {plan.period}
                </span>
              </div>

              <ul style={{
                listStyle: 'none',
                marginBottom: '1.75rem',
                flex: 1,
              }}>
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.625rem',
                      marginBottom: '0.625rem',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--accent-primary)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    >
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '0.8125rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  transition: 'all 0.2s ease',
                  background: plan.highlight
                    ? 'var(--gradient-primary)'
                    : 'var(--bg-secondary)',
                  color: plan.highlight ? 'white' : 'var(--text-primary)',
                  border: plan.highlight ? 'none' : '1px solid var(--border-default)',
                  boxShadow: plan.highlight ? 'var(--shadow-glow-orange)' : 'none',
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
        }}>
          <h2 style={{
            fontSize: '1.375rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            textAlign: 'center',
            marginBottom: '2rem',
            letterSpacing: '-0.02em',
          }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '700px', margin: '0 auto' }}>
            {FAQ_ITEMS.map((item) => (
              <div
                key={item.q}
                style={{
                  padding: '1.25rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <h4 style={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.375rem',
                }}>
                  {item.q}
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          background: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}>
            Still have questions?
          </h3>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9375rem',
            marginBottom: '1.25rem',
          }}>
            Our team is here to help you get started.
          </p>
          <a
            href="mailto:support@aistudio.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'var(--gradient-primary)',
              borderRadius: '10px',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9375rem',
              boxShadow: 'var(--shadow-glow-orange)',
            }}
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
