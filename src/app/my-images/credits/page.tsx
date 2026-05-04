'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

interface CreditLogEntry {
  id: string;
  type: 'earn' | 'spend' | 'refund' | 'bonus';
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
  generation?: {
    id: string;
    prompt: string;
    imageUrl: string;
    thumbnailUrl: string | null;
    model: string;
    type: string;
  } | null;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  earn:   { label: 'Earned',    color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   icon: '+' },
  spend:  { label: 'Spent',     color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   icon: '−' },
  refund: { label: 'Refunded',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '↩' },
  bonus:  { label: 'Bonus',     color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: '★' },
};

const MODEL_LABELS: Record<string, string> = {
  'gpt-image-2': 'GPT Image 2',
  'nano-banana-pro': 'Nano Banana Pro',
  'nano-banana': 'Nano Banana',
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function CreditsLogPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [logs, setLogs] = useState<CreditLogEntry[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetchLogs(page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, page]);

  async function fetchLogs(p: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/credits/log?page=${p}&limit=20`);
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
        setBalance(data.balance);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const totalSpent = logs
    .filter(l => l.type === 'spend')
    .reduce((s, l) => s + Math.abs(l.amount), 0);

  if (!isLoaded || loading && logs.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--bg-tertiary)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '5rem 1.5rem 4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-subtle)', maxWidth: '400px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Sign in to view your credits</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Your credit history will appear here</p>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--gradient-primary)', borderRadius: '10px', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '5rem 1.5rem 4rem' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '400px', background: 'radial-gradient(ellipse at 50% -20%, rgba(52,98,91,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Back link */}
        <Link href="/my-images" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '1.5rem', transition: 'color 0.2s', cursor: 'pointer' }}
          onMouseOver={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
          ← Back to My Images
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Credit History
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem' }}>Your credit transactions</p>
        </div>

        {/* Balance card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '1.75rem 2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Current Balance</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, color: balance !== null && balance > 0 ? 'var(--accent-primary)' : 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              {balance !== null ? balance : '—'}<span style={{ fontSize: '1.25rem', fontWeight: 500, opacity: 0.7 }}> credits</span>
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Spent</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>−{totalSpent}</p>
          </div>
        </div>

        {/* Log list */}
        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No transactions yet</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Your credit history will appear here</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {logs.map(log => {
              const cfg = TYPE_CONFIG[log.type] || TYPE_CONFIG.spend;
              const isExpanded = expandedId === log.id;

              return (
                <div
                  key={log.id}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
                >
                  {/* Main row */}
                  <div
                    style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                  >
                    {/* Type badge */}
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem', fontWeight: 700, color: cfg.color }}>
                      {cfg.icon}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{cfg.label}</span>
                        {log.description && (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            — {log.description}
                          </span>
                        )}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.125rem' }}>
                        {timeAgo(log.createdAt)} · Balance: {log.balanceAfter}
                        {log.generation && <span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>· {log.generation.type === 'image-to-image' ? 'I2I' : 'T2I'} · {MODEL_LABELS[log.generation.model] || log.generation.model}</span>}
                      </div>
                    </div>

                    {/* Amount */}
                    <div style={{ fontSize: '1.125rem', fontWeight: 700, color: cfg.color, flexShrink: 0 }}>
                      {log.amount > 0 ? `+${log.amount}` : log.amount}
                    </div>

                    {/* Expand icon */}
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', flexShrink: 0, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                      ▼
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{ padding: '0 1.25rem 1rem 1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.875rem' }}>
                      {log.generation ? (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                          {log.generation.thumbnailUrl || log.generation.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={log.generation.thumbnailUrl || log.generation.imageUrl}
                              alt="Generation"
                              style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                            />
                          ) : null}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>PROMPT</p>
                            <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {log.generation.prompt}
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                              ID: <span style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>{log.generation.id}</span>
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{log.description || 'No details'}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{
                padding: '0.5rem 1rem',
                background: page <= 1 ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: page <= 1 ? 'var(--text-secondary)' : 'var(--text-primary)',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                opacity: page <= 1 ? 0.5 : 1,
              }}
            >
              Previous
            </button>
            <span style={{ padding: '0.5rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              style={{
                padding: '0.5rem 1rem',
                background: page >= totalPages ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: page >= totalPages ? 'var(--text-secondary)' : 'var(--text-primary)',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                opacity: page >= totalPages ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
