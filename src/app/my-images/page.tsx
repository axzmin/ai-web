'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  type: 'text-to-image' | 'image-to-image';
  inputImageUrl: string | null;
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

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    // silent
  }).catch(() => {
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

// ─── Comparison Slider ────────────────────────────────────────────────────────
function ComparisonSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Original',
  afterLabel = 'Generated',
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderX, setSliderX] = useState(50);

  useEffect(() => { setSliderX(50); }, [beforeSrc, afterSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const move = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(((ev.clientX - rect.left) / rect.width) * 100, 0), 100);
      setSliderX(x);
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(((e.touches[0].clientX - rect.left) / rect.width) * 100, 0), 100);
    setSliderX(x);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchMove={handleTouchMove}
      style={{
        position: 'relative',
        cursor: 'col-resize',
        userSelect: 'none',
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#1a1614',
      }}
    >
      {/* Before (bottom layer) */}
      <img
        src={beforeSrc}
        alt="Before"
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 2,
        }}
      />
      {/* After (top layer, clipped) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        width: `${sliderX}%`,
        height: '100%',
        overflow: 'hidden',
        zIndex: 3,
      }}>
        <img
          src={afterSrc}
          alt="After"
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: `${100 / (sliderX / 100)}%`,
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
      {/* Slider line */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: `${sliderX}%`,
        width: '2px',
        background: 'white',
        transform: 'translateX(-50%)',
        boxShadow: '0 0 8px rgba(0,0,0,0.4)',
        pointerEvents: 'none',
        zIndex: 4,
      }} />
      {/* Slider circle handle */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: `${sliderX}%`,
        transform: 'translate(-50%, -50%)',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'white',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'col-resize',
        zIndex: 5,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" style={{ marginRight: '2px' }}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" style={{ marginLeft: '2px' }}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
      {/* Labels */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        padding: '3px 10px',
        background: 'rgba(0,0,0,0.55)',
        borderRadius: '6px',
        color: 'white',
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        zIndex: 6,
      }}>
        {beforeLabel}
      </div>
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        padding: '3px 10px',
        background: 'rgba(0,0,0,0.55)',
        borderRadius: '6px',
        color: 'white',
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        pointerEvents: 'none',
        zIndex: 6,
      }}>
        {afterLabel}
      </div>
    </div>
  );
}

// ─── Filter Tab Button ────────────────────────────────────────────────────────
type FilterType = 'all' | 'text-to-image' | 'image-to-image';

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: active ? 'var(--accent-primary)' : 'var(--bg-card)',
        border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
        borderRadius: '10px',
        color: active ? 'white' : 'var(--text-secondary)',
        fontSize: '0.8125rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseOver={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
        }
      }}
      onMouseOut={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
        }
      }}
    >
      {label}
      <span style={{
        padding: '0.1rem 0.4rem',
        background: active ? 'rgba(255,255,255,0.2)' : 'var(--bg-tertiary)',
        borderRadius: '9999px',
        fontSize: '0.6875rem',
        fontWeight: 700,
        color: active ? 'white' : 'var(--text-muted)',
      }}>
        {count}
      </span>
    </button>
  );
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
  const [filterType, setFilterType] = useState<FilterType>('all');
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

  // Filtered lists
  const t2iList = generations.filter((g) => g.type === 'text-to-image');
  const i2iList = generations.filter((g) => g.type === 'image-to-image');
  const filtered = filterType === 'all'
    ? generations
    : filterType === 'text-to-image'
      ? t2iList
      : i2iList;

  const filterCounts = {
    all: total,
    'text-to-image': t2iList.length,
    'image-to-image': i2iList.length,
  };

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
            <Link href="/generate" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--gradient-primary)', borderRadius: '10px', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
              Start Creating
            </Link>
          </div>
        ) : (
          <>
            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <FilterTab
                label="All"
                count={filterCounts.all}
                active={filterType === 'all'}
                onClick={() => setFilterType('all')}
              />
              <FilterTab
                label="Text to Image"
                count={filterCounts['text-to-image']}
                active={filterType === 'text-to-image'}
                onClick={() => setFilterType('text-to-image')}
              />
              <FilterTab
                label="Image to Image"
                count={filterCounts['image-to-image']}
                active={filterType === 'image-to-image'}
                onClick={() => setFilterType('image-to-image')}
              />
            </div>

            {/* Stats row */}
            {filterType === 'all' && (
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
            )}

            {filterType !== 'all' && (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                <div style={{ padding: '0.625rem 1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: filterType === 'text-to-image' ? 'var(--accent-primary)' : '#FF8C42' }}>
                    {filterCounts[filterType]}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {filterType === 'text-to-image' ? 'Text to Image' : 'Image to Image'}
                  </div>
                </div>
              </div>
            )}

            {/* Empty filter state */}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                  {filterType === 'text-to-image' ? 'No text-to-image generations yet' : 'No image-to-image generations yet'}
                </p>
              </div>
            )}

            {/* Grid */}
            {filtered.length > 0 && (
              <div style={{
                columns: '5 200px',
                columnGap: '0.75rem',
              }}>
                {filtered.map((gen, index) => (
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
                    {gen.type === 'image-to-image' && gen.inputImageUrl ? (
                      // I2I card — comparison slider thumbnail
                      <>
                        <div
                          onClick={() => setSelected(gen)}
                          style={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            position: 'relative',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-subtle)',
                            aspectRatio: '1/1',
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
                          <ComparisonSlider
                            beforeSrc={gen.inputImageUrl!}
                            afterSrc={gen.thumbnailUrl || gen.imageUrl}
                            beforeLabel="Original"
                            afterLabel="Generated"
                          />
                        </div>
                        {/* Action buttons */}
                        <div style={{
                          display: 'flex',
                          gap: '0.375rem',
                          marginTop: '0.5rem',
                        }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); downloadImage(gen.imageUrl, `ai-image-${gen.id}.png`); }}
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(gen.prompt);
                              setCopiedId(gen.id);
                              setTimeout(() => setCopiedId(null), 2000);
                            }}
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
                            {copiedId === gen.id ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                      </>
                    ) : (
                      // T2I card — regular image
                      <>
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
                          {/* Hover overlay */}
                          <div style={{
                            position: 'absolute',
                            inset: 0,
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
                              fontWeight: 500,
                              color: 'white',
                              fontSize: '0.8125rem',
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              marginBottom: '0.5rem',
                              lineHeight: 1.5,
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

                        {/* Action buttons */}
                        <div style={{
                          display: 'flex',
                          gap: '0.375rem',
                          marginTop: '0.5rem',
                        }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); downloadImage(gen.imageUrl, `ai-image-${gen.id}.png`); }}
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(gen.prompt);
                              setCopiedId(gen.id);
                              setTimeout(() => setCopiedId(null), 2000);
                            }}
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
                            {copiedId === gen.id ? '✓ Copied' : 'Copy Prompt'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                <button
                  onClick={() => fetchGenerations(page - 1)}
                  disabled={page <= 1}
                  style={{
                    padding: '0.5rem 1rem',
                    background: page <= 1 ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '8px',
                    color: page <= 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                    cursor: page <= 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  ← Prev
                </button>
                <span style={{ padding: '0.5rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => fetchGenerations(page + 1)}
                  disabled={page >= totalPages}
                  style={{
                    padding: '0.5rem 1rem',
                    background: page >= totalPages ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '8px',
                    color: page >= totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                    cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 8, 7, 0.88)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease',
            padding: '1.5rem',
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setSelected(null)}
            style={{
              position: 'fixed',
              top: '1.25rem',
              right: '1.25rem',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
              flexDirection: 'row',
              alignItems: 'stretch',
              maxWidth: '95vw',
              maxHeight: '92vh',
              width: '1100px',
              height: '680px',
              animation: 'scaleIn 0.3s ease',
              gap: '1.25rem',
              background: 'rgba(20, 16, 14, 0.95)',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '1.5rem',
              overflow: 'hidden',
            }}
          >
            {/* Left: image area — 70% */}
            <div style={{ flex: '0 0 70%', position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#1a1614' }}>
              {selected.type === 'image-to-image' && selected.inputImageUrl ? (
                <ComparisonSlider
                  beforeSrc={selected.inputImageUrl}
                  afterSrc={selected.imageUrl}
                  beforeLabel="Original"
                  afterLabel="Generated"
                />
              ) : (
                <img
                  src={selected.imageUrl}
                  alt={selected.prompt}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </div>

            {/* Right: info panel — 30% */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'hidden' }}>
              {/* Type badge */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '0.25rem 0.625rem',
                  background: selected.type === 'image-to-image' ? 'rgba(255,140,66,0.2)' : 'rgba(52,98,91,0.25)',
                  border: `1px solid ${selected.type === 'image-to-image' ? 'rgba(255,140,66,0.5)' : 'rgba(52,98,91,0.5)'}`,
                  borderRadius: '6px',
                  color: selected.type === 'image-to-image' ? '#FF8C42' : 'rgba(52,98,91,1)',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                }}>
                  {selected.type === 'image-to-image' ? 'Image to Image' : 'Text to Image'}
                </span>
                <span style={{ padding: '0.25rem 0.625rem', background: 'rgba(52,98,91,0.25)', border: '1px solid rgba(52,98,91,0.5)', borderRadius: '6px', color: 'rgba(52,98,91,1)', fontSize: '0.6875rem', fontWeight: 700 }}>
                  {MODEL_LABELS[selected.model] || selected.model}
                </span>
                <span style={{ padding: '0.25rem 0.625rem', background: 'rgba(255,140,66,0.15)', border: '1px solid rgba(255,140,66,0.3)', borderRadius: '6px', color: '#FF8C42', fontSize: '0.6875rem', fontWeight: 700 }}>
                  {QUALITY_LABELS[selected.quality] || selected.quality}
                </span>
                <span style={{ padding: '0.25rem 0.625rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '0.6875rem', fontWeight: 600 }}>
                  ⚡ {selected.creditsCost} credits
                </span>
              </div>

              {/* Prompt label */}
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Prompt
              </div>

              {/* Prompt text */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.65, wordBreak: 'break-word' }}>
                  {selected.prompt}
                </p>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  onClick={() => {
                    copyToClipboard(selected.prompt);
                    const t = document.getElementById('lc-text');
                    if (t) {
                      t.textContent = 'Copied!';
                      setTimeout(() => { if (t) t.textContent = 'Copy'; }, 2000);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    transition: 'background 0.2s',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="14" height="14" x="8" y="8" rx="2"/>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                  </svg>
                  <span id="lc-text">Copy</span>
                </button>
                <button
                  onClick={() => downloadImage(selected.imageUrl, `ai-image-${selected.id}.png`)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0',
                    background: 'var(--gradient-primary)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    boxShadow: '0 2px 8px rgba(52,98,91,0.35)',
                    transition: 'background 0.2s',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" x2="12" y1="15" y2="3"/>
                  </svg>
                  Download
                </button>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    padding: '0.5rem 0.875rem',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  ✕
                </button>
              </div>
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
