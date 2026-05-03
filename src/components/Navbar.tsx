'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';

const ICONS = {
  menu: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12"/>
      <line x1="4" x2="20" y1="6" y2="6"/>
      <line x1="4" x2="20" y1="18" y2="18"/>
    </svg>
  ),
  close: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),
  sparkles: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  ),
  star: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
};

function CreditsBadge({ credits }: { credits: number }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.3rem 0.625rem',
      background: 'rgba(255,140,66,0.12)',
      border: '1px solid rgba(255,140,66,0.3)',
      borderRadius: '20px',
      color: '#FF8C42',
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.01em',
      userSelect: 'none',
    }}>
      {ICONS.star}
      <span>{credits.toLocaleString()}</span>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const { isSignedIn, isLoaded, user } = useUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/user')
        .then(r => r.json())
        .then(data => { if (data.credits !== undefined) setCredits(data.credits); })
        .catch(() => {});
    } else {
      setCredits(null);
    }
  }, [isSignedIn]);

  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0.75rem 1.5rem',
        background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? 'none' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              {ICONS.sparkles}
            </div>
            <span style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em'
            }}>
              AI Studio
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }} className="hide-mobile">
            {[
              { href: '/#generator', label: 'Home' },
              { href: '/gallery', label: 'Gallery' },
              { href: '/#pricing', label: 'Pricing' },
              { href: '/#faq', label: 'FAQ' }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '0.5rem 1rem',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="hide-mobile">
            {isLoaded && isSignedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                {credits !== null && <CreditsBadge credits={credits} />}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: {
                        width: '36px',
                        height: '36px',
                      },
                    },
                  }}
                />
              </div>
            ) : isLoaded ? (
              <>
                <SignInButton mode="modal">
                  <button className="btn btn-ghost" style={{ padding: '0.4rem 1rem', height: '38px' }}>
                    Log In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1.25rem', height: '44px' }}
                  >
                    Get Started
                  </button>
                </SignUpButton>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="show-mobile"
            style={{
              display: 'none',
              padding: '0.5rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            {mobileOpen ? ICONS.close : ICONS.menu}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--bg-primary)',
          zIndex: 99,
          padding: '1.5rem',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { href: '/#generator', label: 'Home' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/#pricing', label: 'Pricing' },
                { href: '/#faq', label: 'FAQ' }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                style={{
                  padding: '1rem 1.25rem',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  borderRadius: '12px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {link.label}
              </Link>
            ))}
            <SignUpButton mode="modal">
              <button
                style={{
                  marginTop: '0.25rem',
                  width: '100%',
                  textAlign: 'center',
                  padding: '0.875rem 1.25rem',
                  background: 'var(--gradient-primary)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-glow-teal)',
                }}
              >
                Get Started
              </button>
            </SignUpButton>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile {
            display: none !important;
          }
          .show-mobile {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}