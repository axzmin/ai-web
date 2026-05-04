'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string;
  prompt: string;
  tags: string[];
  createdAt: string;
  generation?: {
    id: string;
    prompt: string;
    imageUrl: string;
    thumbnailUrl: string | null;
    model: string;
    type: string;
    user: { id: string; email: string; name: string | null };
  } | null;
}

export default function AdminGalleryPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchItems = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery?page=${p}&limit=20`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setItems(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) fetchItems(page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, page]);

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== id));
        setConfirmDelete(null);
        if (selectedId === id) setSelectedId(null);
      }
    } finally {
      setDeleting(false);
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
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>🖼️ Gallery</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{total} items</span>
          <button
            onClick={() => fetchItems(page)}
            style={{ padding: '0.375rem 0.875rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Loading...</p>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No gallery items yet</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Public gallery submissions will appear here</p>
        </div>
      ) : (
        <>
          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {items.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
                style={{
                  background: 'var(--bg-card)',
                  border: '2px solid',
                  borderColor: selectedId === item.id ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--bg-tertiary)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.generation?.thumbnailUrl || item.generation?.imageUrl || item.imageUrl}
                    alt={item.title || item.prompt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {confirmDelete === item.id ? (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <p style={{ color: 'white', fontSize: '0.8125rem', fontWeight: 600 }}>Delete?</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={e => { e.stopPropagation(); handleDelete(item.id); }}
                          disabled={deleting}
                          style={{ padding: '0.25rem 0.75rem', background: '#EF4444', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                        >
                          {deleting ? '...' : 'Yes'}
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); setConfirmDelete(null); }}
                          style={{ padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={e => { e.stopPropagation(); setConfirmDelete(item.id); }}
                      style={{ position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: '6px', background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Delete"
                    >
                      🗑
                    </button>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '0.625rem' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)', margin: '0 0 0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title || 'Untitled'}
                  </p>
                  {item.generation?.user && (
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', margin: 0 }}>
                      by {item.generation.user.name || item.generation.user.email}
                    </p>
                  )}
                  <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.prompt}
                  </p>
                  {item.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.375rem' }}>
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{ fontSize: '0.625rem', padding: '0.125rem 0.375rem', background: 'var(--bg-secondary)', borderRadius: '4px', color: 'var(--text-secondary)' }}>#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} style={{ padding: '0.375rem 0.875rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>← Prev</button>
              <span style={{ padding: '0.375rem 0.875rem', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ padding: '0.375rem 0.875rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
