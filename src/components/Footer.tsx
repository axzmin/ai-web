'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      padding: '4rem 0 2rem',
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)'
    }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem'
              }}>
                ✨
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                AI Studio
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Transform your ideas into stunning visuals with state-of-the-art AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Product
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/generate" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Text to Image
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/generate/remix" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Image Remix
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/#features" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Features
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/#pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Resources
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/#faq" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                  FAQ
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                  API Documentation
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Tutorials
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                  About
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Blog
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            © 2026 AI Studio. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8125rem' }}>
              Privacy
            </Link>
            <Link href="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8125rem' }}>
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
