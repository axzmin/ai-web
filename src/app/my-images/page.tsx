'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

interface Generation {
  id: string;
  prompt: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  model: string;
  aspectRatio: string;
  quality: string;
  creditsCost: number;
  status: string;
  createdAt: string;
}

const MODEL_LABELS: Record<string, string> = {
  'gpt-image-2': 'GPT Image 2',
  'nano-banana-pro': 'Nano Banana Pro',
  'nano-banana': 'Nano Banana',
};

const QUALITY_LABELS: Record<string, string> = {
  '1K': 'Standard',
  '2K': 'HD',
  '4K': 'Ultra',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    // silent success
  }).catch(() => {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

function downloadImage(url: string, filename?: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'image.png';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.click();
}

export default function MyImagesPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<Generation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const pageSize = 20;

  const fetchGenerations = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gallery?page=${pageNum}&pageSize=${pageSize}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setGenerations(data.generations || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) fetchGenerations(1);
  }, [isLoaded, isSignedIn, fetchGenerations]);

  if (!isLoaded || loading) {
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Sign in to view your images</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Your generated images will appear here</p>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--gradient-primary)', borderRadius: '10px', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', boxShadow: 'var(--shadow-glow-orange)' }}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '5rem 1.5rem 4rem' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '400px', background: 'radial-gradient(ellipse at 50% -20%, rgba(52,98,91,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>My Images</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem' }}>{total > 0 ? `${total} image${total !== 1 ? 's' : ''} generated` : 'Your creation history'}</p>
        </div>

        {generations.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No images yet</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Start creating and your images will appear here</p>
            <Link href="/generate" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--gradient-primary)', borderRadius: '10px', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', boxShadow: 'var(--shadow-glow-orange)' }}>
              Start Creating
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ padding: '0.625rem 1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{total}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Images</div>
              </div>
              <div style={{ padding: '0.625rem 1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FF8C42' }}>{generations.reduce((s, g) => s + g.creditsCost, 0)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Credits Used</div>
              </div>
            </div>

            {/* Masonry grid — 5 columns */}
            <div style={{
              columns: '5 200px',
              columnGap: '0.75rem',
            }}>
              {generations.map((gen, index) => (
                <div
                  key={gen.id}
                  style={{
                    breakInside: 'avoid',
                    marginBottom: '1rem',
                    borderRadius: '16px',
                    overflow: 'visible',
                    position: 'relative',
                    cursor: 'pointer',
                    animation: `fadeInUp 0.4s ease ${Math.min(index, 10) * 0.05}s both`,
                  }}
                >
                  {/* Image card */}
                  <div
                    onClick={() => setSelected(gen)}
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      position: 'relative',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)';
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <img
                      src={gen.thumbnailUrl || gen.imageUrl}
                      alt={gen.prompt}
                      loading="lazy"
                      style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23333" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%23888" font-size="12">Error</text></svg>';
                      }}
                    />
                    {/* Hover overlay with prompt + model */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(26,22,20,0.95) 0%, rgba(26,22,20,0.3) 50%, transparent 80%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '1rem',
                    }}
                    onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                    onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0')}
                    >
                      <p style={{
                        fontWeight: 500, color: 'white', fontSize: '0.8125rem',
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                        marginBottom: '0.5rem', lineHeight: 1.5,
                      }}>
                        {gen.prompt}
                      </p>
                      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                        <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.15)', borderRadius: '9999px', color: 'rgba(255,255,255,0.85)', fontSize: '0.6875rem', fontWeight: 500 }}>
                          {MODEL_LABELS[gen.model] || gen.model}
                        </span>
                        <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,140,66,0.25)', borderRadius: '9999px', color: '#FF8C42', fontSize: '0.6875rem', fontWeight: 600 }}>
                          -{gen.creditsCost}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons row */}
                  <div style={{
                    display: 'flex',
                    gap: '0.375rem',
                    marginTop: '0.5rem',
                    alignItems: 'center',
                  }}>
                    {/* Download button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadImage(gen.imageUrl, `ai-image-${gen.id}.png`); }}
                      title="Download"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.375rem',
                        padding: '0.45rem 0',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--accent-primary)';
                        (e.currentTarget as HTMLElement).style.color = 'white';
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-primary)';
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" x2="12" y1="15" y2="3"/>
                      </svg>
                      Save
                    </button>

                    {/* Copy prompt button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(gen.prompt);
                        setCopiedId(gen.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                      title="Copy prompt"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.375rem',
                        padding: '0.45rem 0',
                        background: copiedId === gen.id ? 'rgba(255,140,66,0.15)' : 'var(--bg-card)',
                        border: `1px solid ${copiedId === gen.id ? 'rgba(255,140,66,0.4)' : 'var(--border-subtle)'}`,
                        borderRadius: '10px',
                        color: copiedId === gen.id ? '#FF8C42' : 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        if (copiedId !== gen.id) {
                          (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)';
                          (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (copiedId !== gen.id) {
                          (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
                          (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      {copiedId === gen.id ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                          </svg>
                          Copy Prompt
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                <button onClick={() => fetchGenerations(page - 1)} disabled={page <= 1} style={{ padding: '0.5rem 1rem', background: page <= 1 ? 'var(--bg-tertiary)' : 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '8px', color: page <= 1 ? 'var(--text-muted)' : 'var(--text-primary)', cursor: page <= 1 ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                  ← Prev
                </button>
                <span style={{ padding: '0.5rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{page} / {totalPages}</span>
                <button onClick={() => fetchGenerations(page + 1)} disabled={page >= totalPages} style={{ padding: '0.5rem 1rem', background: page >= totalPages ? 'var(--bg-tertiary)' : 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '8px', color: page >= totalPages ? 'var(--text-muted)' : 'var(--text-primary)', cursor: page >= totalPages ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox — full image, full viewport */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(10, 8, 7, 0.88)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease',
            padding: '1.5rem',
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setSelected(null)}
            style={{
              position: 'fixed', top: '1.25rem', right: '1.25rem',
              width: '40px', height: '40px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.25rem',
              zIndex: 1001,
            }}
          >
            ×
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '90vw',
              maxHeight: '95vh',
              width: '100%',
              animation: 'scaleIn 0.3s ease',
              gap: '1rem',
            }}
          >
            {/* Full image only */}
            <img
              src={selected.imageUrl}
              alt={selected.prompt}
              style={{
                maxWidth: '100%',
                maxHeight: '82vh',
                width: 'auto',
                height: 'auto',
                borderRadius: '16px',
                display: 'block',
                objectFit: 'contain',
                boxShadow: '0 40px 120px rgba(0,0,0,0.5)',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />

            {/* Action buttons row */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <button
                onClick={() => { copyToClipboard(selected.prompt); const t = document.getElementById('lc-text'); if (t) { t.textContent = 'Copied!'; setTimeout(() => { if (t) t.textContent = 'Copy Prompt'; }, 2000); } }}
                style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', backdropFilter: 'blur(8px)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="14" height="14" x="8" y="8" rx="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
                <span id="lc-text">Copy Prompt</span>
              </button>
              <button
                onClick={() => downloadImage(selected.imageUrl, `ai-image-${selected.id}.png`)}
                style={{ padding: '0.5rem 1rem', background: 'var(--gradient-primary)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', boxShadow: 'var(--shadow-glow-orange)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" x2="12" y1="15" y2="3"/>
                </svg>
                Download
              </button>
              <button
                onClick={() => setSelected(null)}
                style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', backdropFilter: 'blur(8px)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
