'use client';

import { useState } from 'react';
import Link from 'next/link';

const FAQ_CATEGORIES = [
  {
    title: 'Getting Started',
    items: [
      {
        q: 'How does AI Studio work?',
        a: 'AI Studio uses advanced text-to-image AI models to generate images from your descriptions. Simply enter a prompt describing what you want to create, select your preferred settings, and our AI will generate unique images within seconds.',
      },
      {
        q: 'What do I need to get started?',
        a: 'Just create a free account with your email or Google account. No credit card is required for the free tier. Once signed in, you can start generating images immediately.',
      },
      {
        q: 'What are the system requirements?',
        a: 'AI Studio works in any modern web browser on desktop and mobile devices. We recommend Chrome, Firefox, Safari, or Edge for the best experience.',
      },
      {
        q: 'Can I use AI Studio on my phone?',
        a: 'Yes! AI Studio is fully responsive and works great on mobile devices. You can generate, browse, and download images from your phone or tablet.',
      },
    ],
  },
  {
    title: 'Account & Billing',
    items: [
      {
        q: 'How do I upgrade or downgrade my plan?',
        a: 'Go to your account settings and click on "Subscription". From there, you can change your plan at any time. Changes take effect immediately, and we\'ll prorate any differences.',
      },
      {
        q: 'Can I cancel anytime?',
        a: 'Absolutely. You can cancel your subscription from your account settings at any time. Your access will continue until the end of your current billing period.',
      },
      {
        q: 'Do unused images roll over to the next month?',
        a: 'On the Free plan, unused image credits expire at the end of each month. On paid plans (Pro and Unlimited), your monthly allocation resets each billing cycle and does not roll over.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards including Visa, Mastercard, and American Express. We also support PayPal for subscription payments.',
      },
      {
        q: 'Is there a refund policy?',
        a: 'We offer a 14-day money-back guarantee for all paid plans. If you\'re not satisfied, contact our support team for a full refund.',
      },
    ],
  },
  {
    title: 'Image Generation',
    items: [
      {
        q: 'What AI models are available?',
        a: 'We offer three FLUX.1 models: Schnell (fast, great for quick iterations), Dev (balanced quality and speed), and Pro (highest quality for final outputs). Higher-tier plans unlock more models.',
      },
      {
        q: 'What aspect ratios are supported?',
        a: 'All plans support Square (1:1), Portrait (3:4), Landscape (4:3), and Wide (16:9) aspect ratios. Free users are limited to Square only.',
      },
      {
        q: 'Can I use images for commercial purposes?',
        a: 'Yes! All images you generate with AI Studio are yours to use. You retain full commercial rights to your creations, including for business use, merchandise, and resale.',
      },
      {
        q: 'Why does my image look different from the preview?',
        a: 'AI generation inherently involves some randomness. While we use advanced models, slight variations between generations are normal. You can iterate with the same prompt to get different results.',
      },
      {
        q: 'Do generated images have watermarks?',
        a: 'Free tier images include a small watermark. Pro and Unlimited plans generate watermark-free images that you can download in full resolution.',
      },
    ],
  },
  {
    title: 'Privacy & Safety',
    items: [
      {
        q: 'Who can see my generated images?',
        a: 'By default, your images are private and only visible to you. You can choose to share images to the public gallery if you want to showcase your work.',
      },
      {
        q: 'Can I delete my account and data?',
        a: 'Yes. You can permanently delete your account and all associated data from your account settings. This action is irreversible.',
      },
      {
        q: 'What content is not allowed?',
        a: 'AI Studio prohibits generating harmful, explicit, violent, or misleading content. We use automated systems and human review to enforce these guidelines. Violations may result in account suspension.',
      },
    ],
  },
];

const QuickLinks = [
  { label: 'Getting Started Guide', href: '/generate', desc: 'Learn how to create your first image' },
  { label: 'Gallery', href: '/gallery', desc: 'See what others are creating' },
  { label: 'Pricing', href: '/pricing', desc: 'Compare plans and features' },
  { label: 'Contact Support', href: 'mailto:support@aistudio.com', desc: 'Get help from our team' },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (categoryIdx: number, itemIdx: number) => {
    const key = `${categoryIdx}-${itemIdx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
        height: '400px',
        background: 'radial-gradient(ellipse at 50% -20%, rgba(52, 98, 91, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        maxWidth: '800px',
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
            Frequently Asked Questions
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.0625rem',
          }}>
            Find answers to common questions about AI Studio
          </p>
        </div>

        {/* Quick Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          marginBottom: '3rem',
        }}>
          {QuickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                display: 'block',
                padding: '1rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-primary)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
                marginBottom: '0.25rem',
              }}>
                {link.label}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}>
                {link.desc}
              </div>
            </Link>
          ))}
        </div>

        {/* FAQ Categories */}
        {FAQ_CATEGORIES.map((category, catIdx) => (
          <div key={category.title} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{
              fontSize: '1.0625rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              letterSpacing: '-0.01em',
            }}>
              {category.title}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {category.items.map((item, itemIdx) => {
                const key = `${catIdx}-${itemIdx}`;
                const isOpen = !!openItems[key];

                return (
                  <div
                    key={item.q}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      boxShadow: isOpen ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    <button
                      onClick={() => toggleItem(catIdx, itemIdx)}
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        textAlign: 'left',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                        color: 'var(--text-primary)',
                        flex: 1,
                      }}>
                        {item.q}
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--text-muted)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          flexShrink: 0,
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                        }}
                      >
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </button>

                    {isOpen && (
                      <div style={{
                        padding: '0 1.25rem 1rem',
                        animation: 'fadeIn 0.2s ease',
                      }}>
                        <p style={{
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.7,
                          paddingTop: '0.25rem',
                          borderTop: '1px solid var(--border-subtle)',
                        }}>
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          marginTop: '2rem',
        }}>
          <h3 style={{
            fontSize: '1.125rem',
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
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
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
            Email Support
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
