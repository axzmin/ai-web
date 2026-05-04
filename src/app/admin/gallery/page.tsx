'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string;
  inputImageUrl: string | null;
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

// ─── Image upload helper ─────────────────────────────────────────────────────
async function uploadToCloudflare(imageData: string, filename: string): Promise<string> {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageData, filename }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.url;
}

// ─── Add Modal ───────────────────────────────────────────────────────────────
function AddGalleryModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [genType, setGenType] = useState<'text-to-image' | 'image-to-image'>('text-to-image');
  const [imageUrl, setImageUrl] = useState('');
  const [inputImageUrl, setInputImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [inputPreview, setInputPreview] = useState('');
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [seed, setSeed] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleImageChange(url: string, setter: (v: string) => void, previewSetter: (v: string) => void) {
    setter(url);
    previewSetter(url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl || !prompt) { setError('Image and prompt are required'); return; }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          inputImageUrl: genType === 'image-to-image' ? inputImageUrl : null,
          prompt,
          title: title || null,
          description: description || null,
          tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
          seed: seed ? parseInt(seed) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); return; }
      onAdded();
      onClose();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: 620,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Add Gallery Item</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1.25rem' }}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Type selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Type</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['text-to-image', 'image-to-image'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setGenType(t); setInputImageUrl(''); setInputPreview(''); }}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: genType === t ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    background: genType === t ? 'rgba(255,140,66,0.08)' : 'transparent',
                    color: genType === t ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  {t === 'text-to-image' ? '🎨 Text-to-Image' : '🖼️ Image-to-Image'}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div style={{ display: 'grid', gridTemplateColumns: genType === 'image-to-image' ? '1fr 1fr' : '1fr', gap: '0.75rem' }}>
            {/* Generated / Main image */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                {genType === 'image-to-image' ? 'Output Image *' : 'Image *'}
              </label>
              <ImageUpload url={imageUrl} preview={imagePreview} onChange={url => handleImageChange(url, setImageUrl, setImagePreview)} />
            </div>

            {/* Input image (I2I only) */}
            {genType === 'image-to-image' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                  Input Image (Original) *
                </label>
                <ImageUpload url={inputImageUrl} preview={inputPreview} onChange={url => handleImageChange(url, setInputImageUrl, setInputPreview)} />
              </div>
            )}
          </div>

          {/* Prompt */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Prompt *</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe the image..."
              rows={3}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '0.625rem 0.875rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Optional display title"
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '0.625rem 0.875rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional short description..."
              rows={2}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '0.625rem 0.875rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Tags + Seed row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Tags</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '0.625rem 0.875rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>Seed</label>
              <input
                type="number"
                value={seed}
                onChange={e => setSeed(e.target.value)}
                placeholder="—"
                style={{
                  width: '120px',
                  padding: '0.625rem 0.875rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.8125rem', margin: 0 }}>{error}</p>}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.625rem 1.25rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '0.625rem 1.25rem',
                background: saving ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Add to Gallery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Image upload component ─────────────────────────────────────────────────
function ImageUpload({ url, preview, onChange }: { url: string; preview: string; onChange: (url: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = e => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
      const filename = `gallery/${Date.now()}-${file.name}`;
      const uploadedUrl = await uploadToCloudflare(dataUrl, filename);
      onChange(uploadedUrl);
    } catch {
      console.error('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  }

  if (preview) {
    return (
      <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="preview" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute', top: 6, right: 6,
            width: 28, height: 28, borderRadius: '6px',
            background: 'rgba(0,0,0,0.6)', border: 'none',
            color: 'white', cursor: 'pointer', fontSize: '0.75rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: '2px dashed',
        borderColor: dragging ? 'var(--accent-primary)' : 'var(--border-subtle)',
        borderRadius: '8px',
        aspectRatio: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.375rem',
        cursor: 'pointer',
        background: dragging ? 'rgba(255,140,66,0.05)' : 'transparent',
        transition: 'all 0.15s',
      }}
    >
      {uploading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
          <div style={{ width: 24, height: 24, border: '2px solid var(--border-subtle)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: 0 }}>Uploading...</p>
        </div>
      ) : (
        <>
          <span style={{ fontSize: '1.5rem' }}>📷</span>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: 0, textAlign: 'center', padding: '0 0.5rem' }}>
            Drop image or click to upload
          </p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={e => { const file = e.target.files?.[0]; if (file) handleFile(file); }}
        style={{ display: 'none' }}
      />
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AdminGalleryPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

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
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>🖼️ Gallery</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{total} items</span>
          <button
            onClick={() => fetchItems(page)}
            style={{ padding: '0.5rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500, transition: 'all 0.15s' }}
            onMouseOver={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onMouseOut={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          >
            ↻ Refresh
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', color: 'white', fontWeight: 600, transition: 'opacity 0.15s' }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={e => (e.currentTarget.style.opacity = '1')}
          >
            + Add Item
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Loading...</p>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No gallery items yet</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Add items to populate the public gallery</p>
          <button
            onClick={() => setAddModalOpen(true)}
            style={{ padding: '0.625rem 1.25rem', background: 'var(--accent-primary)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
          >
            + Add First Item
          </button>
        </div>
      ) : (
        <>
          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {items.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.15s',
                }}
                onMouseOver={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)')}
                onMouseOut={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                {/* Image(s) */}
                <div style={{ position: 'relative', background: 'var(--bg-tertiary)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.inputImageUrl || item.generation?.thumbnailUrl || item.generation?.imageUrl || item.imageUrl}
                    alt={item.title || item.prompt}
                    style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
                  />
                  {item.inputImageUrl && (
                    <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.65)', borderRadius: '6px', padding: '2px 8px', fontSize: '0.6875rem', color: 'white' }}>
                      I2I
                    </div>
                  )}
                  {confirmDelete === item.id ? (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>Delete this item?</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={e => { e.stopPropagation(); handleDelete(item.id); }}
                          disabled={deleting}
                          style={{ padding: '0.3rem 0.875rem', background: '#EF4444', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}
                        >
                          {deleting ? '...' : 'Delete'}
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); setConfirmDelete(null); }}
                          style={{ padding: '0.3rem 0.875rem', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.8125rem' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={e => { e.stopPropagation(); setConfirmDelete(item.id); }}
                      style={{ position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: '6px', background: 'rgba(0,0,0,0.55)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.15s' }}
                      title="Delete"
                      className="delete-btn"
                    >
                      🗑
                    </button>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '0.75rem' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)', margin: '0 0 0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title || 'Untitled'}
                  </p>
                  {item.generation?.user && (
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', margin: '0 0 0.25rem' }}>
                      by {item.generation.user.name || item.generation.user.email}
                    </p>
                  )}
                  <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.prompt}
                  </p>
                  {item.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
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
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} style={{ padding: '0.5rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1, color: 'var(--text-primary)', fontSize: '0.875rem' }}>← Prev</button>
              <span style={{ padding: '0.5rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ padding: '0.5rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1, color: 'var(--text-primary)', fontSize: '0.875rem' }}>Next →</button>
            </div>
          )}
        </>
      )}

      {/* Add Modal */}
      {addModalOpen && (
        <AddGalleryModal
          onClose={() => setAddModalOpen(false)}
          onAdded={() => { fetchItems(1); setPage(1); }}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        div:hover .delete-btn { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
