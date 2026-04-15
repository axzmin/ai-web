'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link href="/" className="nav-brand" style={{ textDecoration: 'none' }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#171717"/>
          <path d="M8 16L14 10L20 16L14 22L8 16Z" fill="#fff"/>
          <path d="M14 16L20 10L26 16L20 22L14 16Z" fill="#737373"/>
        </svg>
        <span style={{ 
          fontSize: '1rem', 
          fontWeight: 600, 
          marginLeft: '0.75rem',
          color: 'var(--vercel-black)'
        }}>
          AI Studio
        </span>
      </Link>

      <div className="nav-links">
        <Link href="/generate" className="nav-link">
          Text to Image
        </Link>
        <Link href="/generate/remix" className="nav-link">
          Image to Image
        </Link>
        <Link href="/gallery" className="nav-link">
          Gallery
        </Link>
      </div>

      <div className="nav-actions">
        <Link href="/generate" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
          Start Creating
        </Link>
      </div>
    </nav>
  );
}
