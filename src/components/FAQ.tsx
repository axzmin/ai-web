'use client';

import { useState } from 'react';

const FAQS = [
  {
    question: 'How does AI image generation work?',
    answer: 'Our AI uses advanced deep learning models trained on millions of images. When you provide a text prompt, the AI understands your description and generates a unique image matching your specifications. The process involves complex neural networks that understand concepts like objects, styles, lighting, and composition.'
  },
  {
    question: 'What image resolutions are available?',
    answer: 'Free accounts can generate images up to 512x512 pixels. Pro accounts get up to 2K resolution (2048x2048), and Enterprise plans support 4K and higher resolutions. All plans support multiple aspect ratios including square, portrait, and landscape.'
  },
  {
    question: 'Do I own the images I create?',
    answer: 'Yes! You retain full ownership of all images you create with AI Studio. You can use them for personal or commercial purposes. We don\'t claim any rights to your creations, and there are no watermarks on generated images.'
  },
  {
    question: 'How fast is image generation?',
    answer: 'Generation time depends on your plan and server load. Standard generation takes 10-30 seconds. Pro users get priority processing with faster results. Enterprise plans include instant generation with dedicated resources.'
  },
  {
    question: 'Can I use images for commercial purposes?',
    answer: 'Pro and Enterprise plans include commercial licenses, so you can use generated images in your business, marketing materials, products, and client work. Free accounts are for personal, non-commercial use only.'
  },
  {
    question: 'Is there an API available?',
    answer: 'Yes! Pro and Enterprise plans include API access. You can integrate AI image generation into your own applications, websites, or workflows. Our API is REST-based with comprehensive documentation and SDKs for popular languages.'
  },
  {
    question: 'What happens if I exceed my monthly limit?',
    answer: 'If you exceed your monthly image limit, you can either wait for your reset date or upgrade to a higher plan. We\'ll notify you when you\'re approaching your limit so you can plan accordingly.'
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel anytime from your account settings. Your subscription remains active until the end of your billing period. After cancellation, you\'ll be downgraded to the Free plan but keep any images you\'ve already created.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padded" style={{
      background: 'var(--bg-secondary)'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(255, 140, 66, 0.08)',
            border: '1px solid rgba(255, 140, 66, 0.15)',
            borderRadius: 'var(--radius-full)',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '1rem' }}>❓</span>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--accent-primary)'
            }}>
              FAQ
            </span>
          </div>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 600,
            letterSpacing: '-2px',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
            Got questions? We've got answers.
          </p>
        </div>

        {/* FAQ List */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {FAQS.map((faq, index) => (
            <div
              key={index}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '12px',
                marginBottom: '0.75rem',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                animation: `fadeInUp 0.5s ease ${index * 0.05}s both`
              }}
            >
              {/* Question */}
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)'
                }}
              >
                {faq.question}
                <span style={{
                  fontSize: '1.25rem',
                  color: 'var(--text-muted)',
                  transition: 'transform 0.2s',
                  transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)'
                }}>
                  +
                </span>
              </button>

              {/* Answer */}
              <div style={{
                maxHeight: openIndex === index ? '500px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease'
              }}>
                <p style={{
                  padding: '0 1.5rem 1.5rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7
                }}>
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <p style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: 'var(--text-muted)',
          fontSize: '0.875rem'
        }}>
          Still have questions? <a href="/contact" style={{ color: 'var(--accent-primary)' }}>Contact our support team</a>
        </p>
      </div>
    </section>
  );
}
