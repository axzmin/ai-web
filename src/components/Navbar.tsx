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
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking a link
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
        background: scrolled ? 'rgba(245, 240, 230, 0.95)' : 'rgba(245, 240, 230, 0.8)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : 'none',
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
              { href: '/generate', label: 'Generate' },
              { href: '/gallery', label: 'Gallery' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/faq', label: 'FAQ' }
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
            ) : isLoaded ? (
              <>
                <SignInButton mode="modal">
                  <button className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}>
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
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
              { href: '/generate', label: 'Generate' },
              { href: '/gallery', label: 'Gallery' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/faq', label: 'FAQ' }
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
            <Link
              href="/generate"
              onClick={handleNavClick}
              className="btn btn-primary"
              style={{ marginTop: '0.5rem', textAlign: 'center' }}
            >
              Start Creating
            </Link>
            {!isSignedIn && (
              <Link
                href="/login"
                onClick={handleNavClick}
                style={{
                  marginTop: '0.25rem',
                  textAlign: 'center',
                  padding: '1rem 1.25rem',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  borderRadius: '12px',
                  background: 'transparent',
                }}
              >
                Sign In
              </Link>
            )}
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