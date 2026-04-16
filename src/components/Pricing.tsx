'use client';

import { useState } from 'react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out AI Studio',
    features: [
      '10 images per month',
      '512x512 resolution',
      'Standard generation speed',
      'Community gallery access',
      'Basic support'
    ],
    cta: 'Get Started',
    highlighted: false
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For creators and professionals',
    features: [
      '500 images per month',
      '2K resolution',
      'Priority generation speed',
      'Private gallery',
      'API access',
      'Commercial license',
      'Priority support'
    ],
    cta: 'Start Free Trial',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For teams and businesses',
    features: [
      'Unlimited images',
      '4K+ resolution',
      'Instant generation',
      'Unlimited private galleries',
      'Full API access',
      'Custom models',
      'Dedicated support',
      'SLA guarantee'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" style={{
      padding: '6rem 2rem',
      background: 'var(--bg-primary)'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
            <span style={{ fontSize: '1rem' }}>💰</span>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--accent-primary)'
            }}>
              Pricing
            </span>
          </div>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 600,
            letterSpacing: '-2px',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Simple, Transparent Pricing
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
            Start for free, upgrade when you need more. No hidden fees.
          </p>
        </div>

        {/* Billing Toggle */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          <span style={{ 
            color: !annual ? 'var(--text-muted)' : 'var(--text-primary)',
            fontSize: '0.875rem',
            fontWeight: !annual ? 400 : 600
          }}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            style={{
              width: '48px',
              height: '24px',
              borderRadius: '12px',
              background: annual ? 'var(--accent-primary)' : 'var(--text-disabled)',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s'
            }}
          >
            <span style={{
              position: 'absolute',
              top: '2px',
              left: annual ? '26px' : '2px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'white',
              transition: 'left 0.2s'
            }} />
          </button>
          <span style={{ 
            color: annual ? 'var(--text-primary)' : 'var(--text-muted)',
            fontSize: '0.875rem',
            fontWeight: annual ? 600 : 400
          }}>
            Annual <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>(Save 20%)</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          {PLANS.map((plan, index) => (
            <div
              key={index}
              className="card"
              style={{
                padding: '2rem',
                textAlign: 'left',
                border: plan.highlighted ? '2px solid var(--accent-primary)' : '1px solid var(--border-default)',
                position: 'relative',
                animation: `fadeInUp 0.5s ease ${index * 0.1}s both`
              }}
            >
              {plan.highlighted && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--accent-primary)',
                  color: 'white',
                  padding: '0.25rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  Most Popular
                </div>
              )}

              {/* Plan Name */}
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>
                {plan.name}
              </h3>

              {/* Price */}
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  letterSpacing: '-1px',
                  color: 'var(--text-primary)'
                }}>
                  {plan.price}
                </span>
                <span style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem'
                }}>
                  {plan.period}
                </span>
              </div>

              {/* Description */}
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}>
                {plan.description}
              </p>

              {/* Features */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={plan.highlighted ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ width: '100%' }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <p style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: 'var(--text-muted)',
          fontSize: '0.875rem'
        }}>
          🔒 30-day money back guarantee. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
