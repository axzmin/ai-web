import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <Link href="/generate" style={{ color: 'var(--vercel-gray-500)', textDecoration: 'none', fontSize: '0.875rem' }}>
            Text to Image
          </Link>
          <Link href="/generate/remix" style={{ color: 'var(--vercel-gray-500)', textDecoration: 'none', fontSize: '0.875rem' }}>
            Image to Image
          </Link>
          <Link href="/gallery" style={{ color: 'var(--vercel-gray-500)', textDecoration: 'none', fontSize: '0.875rem' }}>
            Gallery
          </Link>
        </div>
        <p className="footer-text">
          © 2026 AI Studio. Built with Next.js, Vercel & Flux.1
        </p>
      </div>
    </footer>
  );
}
