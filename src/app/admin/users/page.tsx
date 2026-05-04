'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface CreditLogEntry {
  id: string;
  type: 'earn' | 'spend' | 'refund' | 'bonus';
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
  generation?: { id: string; prompt: string; imageUrl: string; thumbnailUrl: string | null; model: string; type: string } | null;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  earn:   { label: 'Earned',  color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   icon: '+' },
  spend:  { label: 'Spent',   color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   icon: '−' },
  refund: { label: 'Refunded', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '↩' },
  bonus:  { label: 'Bonus',   color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: '★' },
};

const MODEL_LABELS: Record<string, string> = {
  'gpt-image-2': 'GPT Image 2',
  'nano-banana-pro': 'Nano Banana Pro',
  'nano-banana': 'Nano Banana',
};

interface DbUser {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  image: string | null;
  credits: number;
  createdAt: string;
  lastLoginAt: string | null;
  _count: { generations: number; creditLogs: number };
}

export default function AdminUsersPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [users, setUsers] = useState<DbUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Selected user for detail panel
  const [selectedUser, setSelectedUser] = useState<DbUser | null>(null);
  const [userLogs, setUserLogs] = useState<CreditLogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjusting, setAdjusting] = useState(false);
  const [adjustMsg, setAdjustMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(async (p = 1, s = debouncedSearch) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20' });
      if (s) params.set('search', s);
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (isLoaded && isSignedIn) fetchUsers(1, debouncedSearch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, debouncedSearch]);

  async function selectUser(user: DbUser) {
    setSelectedUser(user);
    setUserLogs([]);
    setAdjustAmount('');
    setAdjustReason('');
    setAdjustMsg(null);
    setLoadingLogs(true);
    try {
      const res = await fetch(`/api/admin/users/credits?userId=${user.id}`);
      const data = await res.json();
      if (data.logs) setUserLogs(data.logs);
      setSelectedUser(prev => prev ? { ...prev, credits: data.user?.credits ?? prev.credits } : prev);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogs(false);
    }
  }

  async function handleAdjustCredits() {
    if (!selectedUser || !adjustAmount) return;
    const amount = parseInt(adjustAmount);
    if (isNaN(amount) || amount === 0) {
      setAdjustMsg({ type: 'error', text: 'Enter a non-zero number' });
      return;
    }
    setAdjusting(true);
    setAdjustMsg(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id, action: 'adjust_credits', amount, reason: adjustReason }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedUser(prev => prev ? { ...prev, credits: data.credits } : prev);
        setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, credits: data.credits } : u));
        setAdjustAmount('');
        setAdjustReason('');
        setAdjustMsg({ type: 'success', text: `Credits updated. New balance: ${data.credits}` });
        // Refresh logs
        selectUser({ ...selectedUser, credits: data.credits });
      } else {
        setAdjustMsg({ type: 'error', text: data.error || 'Failed' });
      }
    } catch {
      setAdjustMsg({ type: 'error', text: 'Network error' });
    } finally {
      setAdjusting(false);
    }
  }

  if (!isLoaded) return null;
  if (!isSignedIn) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h1>Admin</h1>
        <p>Please sign in.</p>
        <Link href="/login">Sign In</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>👥 Users</h1>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{total} total users</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedUser ? '1fr 400px' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: User list */}
        <div>
          {/* Search */}
          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by email, name or clerk ID..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{
                width: '100%',
                padding: '0.625rem 1rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Table */}
          {loading ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Loading...</p>
          ) : users.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No users found.</p>
          ) : (
            <>
              <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                      {['User', 'Credits', 'Generations', 'Joined', ''].map(h => (
                        <th key={h} style={{ padding: '0.625rem 0.75rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr
                        key={u.id}
                        onClick={() => selectUser(u)}
                        style={{
                          cursor: 'pointer',
                          borderBottom: i < users.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                          background: selectedUser?.id === u.id ? 'rgba(255,140,66,0.06)' : 'transparent',
                        }}
                      >
                        <td style={{ padding: '0.625rem 0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-tertiary)', overflow: 'hidden', flexShrink: 0 }}>
                              {u.image ? <img src={u.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                  {(u.name || u.email || '?')[0].toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{u.name || '—'}</div>
                              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.625rem 0.75rem' }}>
                          <span style={{ fontWeight: 700, color: u.credits > 0 ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>{u.credits}</span>
                        </td>
                        <td style={{ padding: '0.625rem 0.75rem', color: 'var(--text-secondary)' }}>{u._count.generations}</td>
                        <td style={{ padding: '0.625rem 0.75rem', color: 'var(--text-secondary)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '0.625rem 0.75rem' }}>
                          <button
                            onClick={e => { e.stopPropagation(); selectUser(u); }}
                            style={{
                              padding: '0.25rem 0.625rem',
                              fontSize: '0.75rem',
                              background: 'var(--bg-tertiary)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '6px',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                            }}
                          >
                            Manage →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                  <button onClick={() => fetchUsers(page - 1)} disabled={page <= 1} style={{ padding: '0.375rem 0.875rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>← Prev</button>
                  <span style={{ padding: '0.375rem 0.875rem', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{page} / {totalPages}</span>
                  <button onClick={() => fetchUsers(page + 1)} disabled={page >= totalPages} style={{ padding: '0.375rem 0.875rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: User detail panel */}
        {selectedUser && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.25rem', position: 'sticky', top: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>User Detail</h2>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1rem' }}>✕</button>
            </div>

            {/* User info */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedUser.name || '—'}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>{selectedUser.email}</div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '0.5rem 0.75rem', textAlign: 'center', flex: 1, minWidth: 80 }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{selectedUser.credits}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Credits</div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '0.5rem 0.75rem', textAlign: 'center', flex: 1, minWidth: 80 }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedUser._count.generations}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Images</div>
                </div>
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }} title={selectedUser.clerkId}>
                Clerk: {selectedUser.clerkId.substring(0, 12)}...
              </div>
            </div>

            {/* Credit adjust */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Adjust Credits</h3>
              <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="e.g. +10 or -5"
                  value={adjustAmount}
                  onChange={e => setAdjustAmount(e.target.value)}
                  style={{
                    flex: 1, padding: '0.5rem 0.75rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.8125rem',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleAdjustCredits}
                  disabled={adjusting || !adjustAmount}
                  style={{
                    padding: '0.5rem 0.875rem',
                    background: adjusting ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: adjusting || !adjustAmount ? 'not-allowed' : 'pointer',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    opacity: adjusting || !adjustAmount ? 0.6 : 1,
                  }}
                >
                  {adjusting ? '...' : 'Apply'}
                </button>
              </div>
              <input
                type="text"
                placeholder="Reason (optional)"
                value={adjustReason}
                onChange={e => setAdjustReason(e.target.value)}
                style={{
                  width: '100%', padding: '0.5rem 0.75rem', boxSizing: 'border-box',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.8125rem',
                  outline: 'none',
                  marginBottom: '0.5rem',
                }}
              />
              {adjustMsg && (
                <p style={{ fontSize: '0.75rem', color: adjustMsg.type === 'success' ? '#22c55e' : '#ef4444', margin: 0 }}>
                  {adjustMsg.text}
                </p>
              )}
            </div>

            {/* Credit logs */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Credit History {loadingLogs && '(loading...)'}
              </h3>
              {!loadingLogs && userLogs.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>No transactions</p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '320px', overflowY: 'auto' }}>
                {userLogs.map(log => {
                  const cfg = TYPE_CONFIG[log.type] || TYPE_CONFIG.spend;
                  const isExpanded = expandedLogId === log.id;
                  return (
                    <div key={log.id} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', overflow: 'hidden' }}>
                      <div
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        style={{ padding: '0.5rem 0.625rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                      >
                        <span style={{ fontWeight: 700, color: cfg.color, fontSize: '0.875rem', width: 16, textAlign: 'center' }}>{cfg.icon}</span>
                        <span style={{ flex: 1, fontSize: '0.75rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {log.description || cfg.label}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: cfg.color }}>
                          {log.amount > 0 ? `+${log.amount}` : log.amount}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>▼</span>
                      </div>
                      {isExpanded && log.generation && (
                        <div style={{ padding: '0.375rem 0.625rem 0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            {log.generation.thumbnailUrl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={log.generation.thumbnailUrl} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                            )}
                            <div>
                              <p style={{ margin: 0, fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                                {log.generation.type === 'image-to-image' ? 'I2I' : 'T2I'} · {MODEL_LABELS[log.generation.model] || log.generation.model}
                              </p>
                              <p style={{ margin: '0.125rem 0 0', fontSize: '0.6875rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                                {log.generation.prompt}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
