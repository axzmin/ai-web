'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface Alert {
  id: string;
  level: string;
  source: string;
  message: string;
  details: string | null;
  taskId: string | null;
  userId: string | null;
  resolved: boolean;
  createdAt: string;
}

export default function AdminAlertsPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'error' | 'warning'>('all');
  const [showResolved, setShowResolved] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [resolving, setResolving] = useState(false);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (filter !== 'all') params.set('level', filter);
      if (!showResolved) params.set('resolved', 'false');

      const res = await fetch(`/api/admin/alerts?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAlerts(data.alerts);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, showResolved]);

  useEffect(() => {
    if (isLoaded && isSignedIn) fetchAlerts();
  }, [isLoaded, isSignedIn, fetchAlerts]);

  const handleResolve = async () => {
    if (selected.size === 0) return;
    setResolving(true);
    try {
      const res = await fetch('/api/admin/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      if (res.ok) {
        setSelected(new Set());
        fetchAlerts();
      }
    } finally {
      setResolving(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const levelColor = (level: string) => {
    switch (level) {
      case 'critical': return { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' };
      case 'error': return { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' };
      case 'warning': return { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' };
      default: return { bg: '#F3F4F6', border: '#9CA3AF', text: '#374151' };
    }
  };

  if (!isLoaded) return null;
  if (!isSignedIn) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h1>Admin Alerts</h1>
        <p>Please sign in to view this page.</p>
        <Link href="/login">Sign In</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            🔔 Alert Logs
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {total} total {filter !== 'all' ? `(${filter})` : ''}
          </p>
        </div>
        <button
          onClick={fetchAlerts}
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {(['all', 'critical', 'error', 'warning'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: filter === f ? 'var(--accent-primary)' : 'var(--border-subtle)',
              background: filter === f ? 'var(--accent-primary)' : 'var(--bg-card)',
              color: filter === f ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {f === 'all' ? 'All Levels' : f}
          </button>
        ))}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', cursor: 'pointer', marginLeft: '0.5rem' }}>
          <input
            type="checkbox"
            checked={showResolved}
            onChange={e => setShowResolved(e.target.checked)}
          />
          Show resolved
        </label>

        {selected.size > 0 && (
          <button
            onClick={handleResolve}
            disabled={resolving}
            style={{
              marginLeft: 'auto',
              padding: '0.375rem 0.875rem',
              background: '#059669',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: resolving ? 'not-allowed' : 'pointer',
              fontSize: '0.8125rem',
              fontWeight: 600,
              opacity: resolving ? 0.6 : 1,
            }}
          >
            ✓ Mark Resolved ({selected.size})
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Loading...</p>
      ) : alerts.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No alerts found.</p>
      ) : (
        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, width: '32px' }}></th>
                <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>Level</th>
                <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>Source</th>
                <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>Message</th>
                <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>Task ID</th>
                <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>User</th>
                <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>Time</th>
                <th style={{ padding: '0.625rem 0.75rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, i) => {
                const colors = levelColor(alert.level);
                return (
                  <tr
                    key={alert.id}
                    style={{ borderBottom: i < alerts.length - 1 ? '1px solid var(--border-subtle)' : 'none', background: alert.resolved ? 'var(--bg-secondary)' : 'transparent' }}
                  >
                    <td style={{ padding: '0.625rem 0.75rem' }}>
                      {!alert.resolved && (
                        <input
                          type="checkbox"
                          checked={selected.has(alert.id)}
                          onChange={() => toggleSelect(alert.id)}
                        />
                      )}
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}>
                        {alert.level}
                      </span>
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {alert.source}
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem', maxWidth: '300px' }}>
                      <span title={alert.message} style={{
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                        maxWidth: '300px',
                      }}>
                        {alert.message}
                      </span>
                      {alert.details && (
                        <details style={{ marginTop: '0.25rem' }}>
                          <summary style={{ cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.6875rem' }}>Details</summary>
                          <pre style={{
                            margin: '0.25rem 0 0',
                            padding: '0.375rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: '4px',
                            fontSize: '0.6875rem',
                            overflow: 'auto',
                            maxWidth: '400px',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                          }}>
                            {(() => {
                              try { return JSON.stringify(JSON.parse(alert.details!), null, 2); }
                              catch { return alert.details; }
                            })()}
                          </pre>
                        </details>
                      )}
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem', fontFamily: 'monospace', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                      {alert.taskId ? (
                        <span title={alert.taskId} style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                          {alert.taskId.substring(0, 8)}...
                        </span>
                      ) : '—'}
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem', fontFamily: 'monospace', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                      {alert.userId ? (
                        <span title={alert.userId}>{alert.userId.substring(0, 8)}...</span>
                      ) : '—'}
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                      {new Date(alert.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem' }}>
                      {alert.resolved ? (
                        <span style={{ color: '#059669', fontSize: '0.6875rem', fontWeight: 600 }}>Resolved</span>
                      ) : (
                        <span style={{ color: '#DC2626', fontSize: '0.6875rem', fontWeight: 600 }}>Open</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
