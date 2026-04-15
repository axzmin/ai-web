'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/#generator', label: 'Create' },
    { href: '/#features', label: 'Features' },
    { href: '/#gallery', label: 'Gallery' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#faq', label: 'FAQ' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" className="nav-brand">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#171717"/>
            <path d="M8 16L14 10L20 16L14 22L8 16Z" fill="#fff"/>
            <path d="M14 16L20 10L26 16L20 22L14 16Z" fill="#737373"/>
          </svg>
          <span>AI Studio</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links hide-mobile">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="nav-actions hide-mobile">
          <Link href="/generate" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
            Start Creating
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="nav-mobile-toggle hide-desktop"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round"/>
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="hide-desktop" style={{
          position: 'absolute',
          top: '64px',
          left: 0,
          right: 0,
          background: 'var(--vercel-white)',
          borderBottom: '1px solid var(--vercel-gray-200)',
          padding: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              style={{ display: 'block', padding: '0.75rem 0' }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/generate" className="btn btn-primary w-full mt-4" style={{ justifyContent: 'center' }}>
            Start Creating
          </Link>
        </div>
      )}
    </nav>
  );
}
