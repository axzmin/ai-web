'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const TABS = [
  { href: '/admin/alerts', label: '🔔 Alert Logs', key: 'alerts' },
  { href: '/admin/users',  label: '👥 Users',      key: 'users'  },
  { href: '/admin/gallery', label: '🖼️ Gallery',  key: 'gallery' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const activeTab = TABS.find(t => pathname.startsWith(t.href))?.key || 'alerts';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '64px' }}>
      {/* Navbar */}
      <div style={{
        position: 'fixed', top: 64, left: 0, right: 0,
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        zIndex: 40,
        padding: '0 1.5rem',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          {TABS.map(tab => (
            <Link
              key={tab.key}
              href={tab.href}
              style={{
                padding: '0.875rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                borderBottom: '2px solid',
                borderColor: activeTab === tab.key ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === tab.key ? 'var(--accent-primary)' : 'var(--text-secondary)',
                transition: 'all 0.15s',
                cursor: 'pointer',
              }}
              onMouseOver={e => { if (activeTab !== tab.key) e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseOut={e => { if (activeTab !== tab.key) e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Page content */}
      <div style={{ paddingTop: '2.5rem' }}>
        {children}
      </div>
    </div>
  );
}
