'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth, UserButton, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

type TabType = 'text-to-image' | 'image-to-image';

const ASPECT_RATIOS = [
  { label: 'Auto', value: 'auto' },
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '3:4', value: '3:4' },
  { label: '9:16', value: '9:16' },
  { label: '16:9', value: '16:9' },
];

const QUALITY_OPTIONS = [
  { label: 'Standard', value: 'standard', desc: '1K resolution' },
  { label: 'HD', value: 'hd', desc: '2K resolution' },
  { label: 'Ultra', value: 'ultra', desc: '4K resolution' },
];

const MODEL_OPTIONS = [
  {
    label: 'GPT Image 2',
    value: 'gpt-image-2',
    description: 'OpenAI GPT Image 2 - Best quality',
    costByResolution: { '1K': 2, '2K': 3, '4K': 5 },
  },
  {
    label: 'Nano Banana Pro',
    value: 'nano-banana-pro',
    description: 'Gemini 3 Pro - High quality',
    costByResolution: { '1K': 1, '2K': 2, '4K': 3 },
  },
  {
    label: 'Nano Banana',
    value: 'nano-banana',
    description: 'Gemini 2.5 Flash - Fast & efficient',
    costByResolution: { '1K': 1, '2K': 1, '4K': 2 },
  },
];

// ─── Demo Data: 5 real before/after image pairs ─────────────────────────────────
// before = low-quality/dark feel, after = enhanced/bright result (different photos)
const DEMO_PAIR = {
  imageUrls: [
    {
      before: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=40',
      after:  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85',
      prompt: "Ultra-realistic 8K full-body portrait of a stylish young man leaning casually against a clean light-gray wall. He is wearing a mustard yellow V-neck sweater with black-and-white striped trim on the neckline and cuffs, slim-fit black trousers, mustard-colored socks, and black sneakers with white soles. Hands in pockets, one leg crossed over the other, relaxed confident pose. The man has a well-groomed beard and voluminous styled hair, sharp and natural look. On the wall next to him, create a bold black-and-white stylized vector portrait of the same man with modern geometric elements. Below the graphic, add clean bold text: 'PROMPTHERO' in large letters, and beneath it, 'Facebook: @GptHive' in smaller font. Lighting: soft, even, professional studio quality. Mood: modern, minimalistic, premium personal branding aesthetic.",
    },
    {
      before: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&q=40',
      after:  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=85',
      prompt: "Ultra-realistic 8K full-body portrait of a stylish young man leaning casually against a clean light-gray wall. He is wearing a mustard yellow V-neck sweater with black-and-white striped trim on the neckline and cuffs, slim-fit black trousers, mustard-colored socks, and black sneakers with white soles. Hands in pockets, one leg crossed over the other, relaxed confident pose. The man has a well-groomed beard and voluminous styled hair, sharp and natural look. On the wall next to him, create a bold black-and-white stylized vector portrait of the same man with modern geometric elements. Below the graphic, add clean bold text: 'PROMPTHERO' in large letters, and beneath it, 'Facebook: @GptHive' in smaller font. Lighting: soft, even, professional studio quality. Mood: modern, minimalistic, premium personal branding aesthetic.",
    },
    {
      before: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=40',
      after:  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=85',
      prompt: "Ultra-realistic 8K full-body portrait of a stylish young man leaning casually against a clean light-gray wall. He is wearing a mustard yellow V-neck sweater with black-and-white striped trim on the neckline and cuffs, slim-fit black trousers, mustard-colored socks, and black sneakers with white soles. Hands in pockets, one leg crossed over the other, relaxed confident pose. The man has a well-groomed beard and voluminous styled hair, sharp and natural look. On the wall next to him, create a bold black-and-white stylized vector portrait of the same man with modern geometric elements. Below the graphic, add clean bold text: 'PROMPTHERO' in large letters, and beneath it, 'Facebook: @GptHive' in smaller font. Lighting: soft, even, professional studio quality. Mood: modern, minimalistic, premium personal branding aesthetic.",
    },
    {
      before: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&q=40',
      after:  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=85',
      prompt: "Ultra-realistic 8K full-body portrait of a stylish young man leaning casually against a clean light-gray wall. He is wearing a mustard yellow V-neck sweater with black-and-white striped trim on the neckline and cuffs, slim-fit black trousers, mustard-colored socks, and black sneakers with white soles. Hands in pockets, one leg crossed over the other, relaxed confident pose. The man has a well-groomed beard and voluminous styled hair, sharp and natural look. On the wall next to him, create a bold black-and-white stylized vector portrait of the same man with modern geometric elements. Below the graphic, add clean bold text: 'PROMPTHERO' in large letters, and beneath it, 'Facebook: @GptHive' in smaller font. Lighting: soft, even, professional studio quality. Mood: modern, minimalistic, premium personal branding aesthetic.",
    },
    {
      before: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=40',
      after:  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=85',
      prompt: "Ultra-realistic 8K full-body portrait of a stylish young man leaning casually against a clean light-gray wall. He is wearing a mustard yellow V-neck sweater with black-and-white striped trim on the neckline and cuffs, slim-fit black trousers, mustard-colored socks, and black sneakers with white soles. Hands in pockets, one leg crossed over the other, relaxed confident pose. The man has a well-groomed beard and voluminous styled hair, sharp and natural look. On the wall next to him, create a bold black-and-white stylized vector portrait of the same man with modern geometric elements. Below the graphic, add clean bold text: 'PROMPTHERO' in large letters, and beneath it, 'Facebook: @GptHive' in smaller font. Lighting: soft, even, professional studio quality. Mood: modern, minimalistic, premium personal branding aesthetic.",
    },
  ],
};

// ─── Helper: copy text to clipboard ────────────────────────────────────────────
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

// ─── Helper: map user ratio value → CSS aspect-ratio string + container hint ─────
const RATIO_MAP: Record<string, { css: string; isPortrait: boolean }> = {
  'auto': { css: '4/3',  isPortrait: false },
  '1:1':  { css: '1/1',  isPortrait: false },
  '4:3':  { css: '4/3',  isPortrait: false },
  '3:4':  { css: '3/4',  isPortrait: true  },
  '9:16': { css: '9/16', isPortrait: true  },
  '16:9': { css: '16/9', isPortrait: false },
};

// Preview container — taller to show images fully; bgSrc enables frosted-glass backdrop
function getContainerStyle(aspectRatio: string, bgSrc?: string) {
  const ratio = RATIO_MAP[aspectRatio] || RATIO_MAP['auto'];
  const base: React.CSSProperties = {
    borderRadius: '12px',
    overflow: 'hidden',
    flexShrink: 0,
  };
  if (bgSrc) {
    // Frosted glass: blurred image as background + dark overlay
    return {
      ...base,
      position: 'relative' as const,
      backgroundImage: `url(${bgSrc})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'blur(24px) saturate(160%)',
      transform: 'scale(1.05)', // slight scale to hide blurred edges
    };
  }
  if (ratio.isPortrait) {
    return {
      ...base,
      aspectRatio: ratio.css,
      maxHeight: '680px',
      width: '100%',
      margin: '0 auto',
    };
  }
  return {
    ...base,
    aspectRatio: ratio.css,
    maxHeight: '680px',
    width: '100%',
  };
}

// ─── Shared: base container style used by both SimpleImage and ComparisonSlider ─
function getBaseContainerStyle(aspectRatio: string): React.CSSProperties {
  const ratio = RATIO_MAP[aspectRatio] || RATIO_MAP['auto'];
  return ratio.isPortrait
    ? { aspectRatio: ratio.css, maxHeight: '680px', width: '100%', margin: '0 auto' }
    : { aspectRatio: ratio.css, maxHeight: '680px', width: '100%' };
}

// ─── Comparison Slider — drag to reveal before/after ──────────────────────────
function ComparisonSlider({ beforeSrc, afterSrc, beforeLabel, afterLabel, overlay, aspectRatio = 'auto', bgSrc }: {
  beforeSrc: string; afterSrc: string; beforeLabel?: string; afterLabel?: string;
  overlay?: React.ReactNode; aspectRatio?: string; bgSrc?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderX, setSliderX] = useState(50);

  useEffect(() => { setSliderX(50); }, [beforeSrc, afterSrc, aspectRatio]);

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
        flexShrink: 0,
        width: '100%',
        height: '100%',
        minHeight: '320px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#1a1614',
      }}
    >
      {bgSrc && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${bgSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(24px) saturate(160%)',
          transform: 'scale(1.05)',
          zIndex: 0,
        }} />
      )}
      {bgSrc && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'rgba(26, 22, 20, 0.65)',
          zIndex: 1,
        }} />
      )}
      <img src={beforeSrc} alt="Before" draggable={false}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          background: bgSrc ? 'transparent' : '#1a1614',
          zIndex: 2,
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        width: `${sliderX}%`, height: '100%',
        overflow: 'hidden',
      }}>
        <img src={afterSrc} alt="After" draggable={false}
          style={{
            position: 'absolute', inset: 0,
            width: `${100 / (sliderX / 100)}%`, height: '100%',
            objectFit: 'cover',
            background: bgSrc ? 'transparent' : '#1a1614',
          }}
        />
      </div>
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: `${sliderX}%`, width: '2px',
        background: 'white', transform: 'translateX(-50%)',
        boxShadow: '0 0 8px rgba(0,0,0,0.4)', pointerEvents: 'none', zIndex: 3,
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: `${sliderX}%`,
        transform: 'translate(-50%, -50%)',
        width: '40px', height: '40px', borderRadius: '50%',
        background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'col-resize', zIndex: 4,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" style={{ marginRight: '2px' }}>
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" style={{ marginLeft: '2px' }}>
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
      <div style={{
        position: 'absolute', bottom: '10px', left: '10px',
        padding: '3px 10px', background: 'rgba(0,0,0,0.55)', borderRadius: '6px',
        color: 'white', fontSize: '0.6875rem', fontWeight: 600,
        letterSpacing: '0.04em', textTransform: 'uppercase', pointerEvents: 'none', zIndex: 3,
      }}>{beforeLabel || 'Original'}</div>
      <div style={{
        position: 'absolute', bottom: '10px', right: '10px',
        padding: '3px 10px', background: 'rgba(0,0,0,0.55)', borderRadius: '6px',
        color: 'white', fontSize: '0.6875rem', fontWeight: 600,
        letterSpacing: '0.04em', textTransform: 'uppercase', pointerEvents: 'none', zIndex: 3,
      }}>{afterLabel || 'Generated'}</div>
      {overlay && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          display: 'flex', gap: '0.5rem', zIndex: 5,
        }}>
          {overlay}
        </div>
      )}
    </div>
  );
}

// ─── Comparison Slider Demo — resets to 50% when switching thumbnails ────────────
function ComparisonSliderDemo({ beforeSrc, afterSrc, beforeLabel = 'Before', afterLabel = 'After', aspectRatio = 'auto' }: {
  beforeSrc: string; afterSrc: string; beforeLabel?: string; afterLabel?: string; aspectRatio?: string;
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

  const ratio = RATIO_MAP[aspectRatio] || RATIO_MAP['auto'];
  const containerBase: React.CSSProperties = ratio.isPortrait
    ? { aspectRatio: ratio.css, maxHeight: '680px', width: '100%', margin: '0 auto' }
    : { aspectRatio: ratio.css, maxHeight: '680px', width: '100%' };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchMove={handleTouchMove}
      style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'col-resize',
        userSelect: 'none',
        background: '#1a1614',
        flexShrink: 0,
        ...containerBase,
      }}
    >
      <img src={beforeSrc} alt="Before" draggable={false}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
      <div style={{ position: 'absolute', inset: 0, width: `${sliderX}%`, height: '100%', overflow: 'hidden' }}>
        <img src={afterSrc} alt="After" draggable={false}
          style={{ position: 'absolute', inset: 0, width: `${100 / (sliderX / 100)}%`, height: '100%', objectFit: 'contain' }} />
      </div>
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: `${sliderX}%`, width: '2px',
        background: 'white', transform: 'translateX(-50%)',
        boxShadow: '0 0 8px rgba(0,0,0,0.4)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: `${sliderX}%`,
        transform: 'translate(-50%, -50%)',
        width: '40px', height: '40px', borderRadius: '50%',
        background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'col-resize', zIndex: 2,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" style={{ marginRight: '2px' }}>
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" style={{ marginLeft: '2px' }}>
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
      <div style={{
        position: 'absolute', bottom: '10px', left: '10px',
        padding: '3px 10px', background: 'rgba(0,0,0,0.55)', borderRadius: '6px',
        color: 'white', fontSize: '0.6875rem', fontWeight: 600,
        letterSpacing: '0.04em', textTransform: 'uppercase', pointerEvents: 'none',
      }}>{beforeLabel}</div>
      <div style={{
        position: 'absolute', bottom: '10px', right: '10px',
        padding: '3px 10px', background: 'rgba(0,0,0,0.55)', borderRadius: '6px',
        color: 'white', fontSize: '0.6875rem', fontWeight: 600,
        letterSpacing: '0.04em', textTransform: 'uppercase', pointerEvents: 'none',
      }}>{afterLabel}</div>
    </div>
  );
}

// ─── Shared Thumbnail Grid Component ──────────────────────────────────────────
function ThumbnailGrid({
  selectedIndex,
  onSelect,
  previewMode = 'gallery',
}: {
  selectedIndex: number;
  onSelect: (index: number) => void;
  previewMode?: 'gallery' | 'comparison';
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '0.5rem',
    }}>
      {DEMO_PAIR.imageUrls.map((pair, i) => (
        <div
          key={i}
          style={{
            position: 'relative',
            borderRadius: '8px',
            overflow: 'visible',
            border: selectedIndex === i
              ? '2px solid var(--accent-primary)'
              : '2px solid transparent',
            transition: 'all 0.2s ease',
          }}
        >
          {/* Thumbnail image */}
          <button
            onClick={() => onSelect(i)}
            style={{
              display: 'block',
              width: '100%',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
              padding: 0,
              background: 'var(--bg-secondary)',
              aspectRatio: '1/1',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
          >
            <img
              src={pair.after}
              alt={`Demo ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </button>

          {/* Action buttons overlay — shown on hover */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
            padding: '1.5rem 0.25rem 0.25rem',
            display: 'flex',
            gap: '0.25rem',
            opacity: 0,
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none',
            zIndex: 5,
          }}
            className="thumbnail-actions"
          >
            <button
              onClick={(e) => { e.stopPropagation(); copyToClipboard(pair.prompt); }}
              title="Copy prompt"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                padding: '0.3rem 0',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '6px',
                color: 'white',
                fontSize: '0.625rem',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.2s ease',
              }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect width="14" height="14" x="8" y="8" rx="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              Copy
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(pair.prompt); // sets prompt in parent via onSelect logic
              }}
              title="Try this prompt"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                padding: '0.3rem 0',
                background: 'var(--gradient-primary)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '0.625rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(255,140,66,0.4)',
                transition: 'background 0.2s ease',
              }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Try It
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Simple Image Component — no slider, just a clean image ─────────────────
function SimpleImage({ src, label, overlay, aspectRatio = 'auto', bgSrc }: {
  src: string; label?: string; overlay?: React.ReactNode;
  aspectRatio?: string; bgSrc?: string;
}) {
  const containerBase = getBaseContainerStyle(aspectRatio);

  return (
    <div style={{
      position: 'relative',
      borderRadius: '12px',
      overflow: 'hidden',
      flexShrink: 0,
      ...containerBase,
    }}>
      {/* Frosted glass background layer */}
      {bgSrc && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${bgSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px) saturate(150%)',
          transform: 'scale(1.06)',
          zIndex: 0,
        }} />
      )}
      {/* Dark overlay on top of blurred bg */}
      {bgSrc && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(26, 22, 20, 0.55)',
          zIndex: 1,
        }} />
      )}
      {/* Actual image — always on top of everything */}
      <img
        src={src}
        alt={label || 'Image'}
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          background: bgSrc ? 'transparent' : '#1a1614',
          zIndex: 2,
        }}
      />
      {label && (
        <div style={{
          position: 'absolute',
          bottom: '10px', left: '10px',
          padding: '3px 10px',
          background: 'rgba(0,0,0,0.55)',
          borderRadius: '6px',
          color: 'white',
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          zIndex: 3,
        }}>
          {label}
        </div>
      )}
      {overlay && (
        <div style={{
          position: 'absolute',
          top: '10px', right: '10px',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 3,
        }}>
          {overlay}
        </div>
      )}
    </div>
  );
}


// ─── Types ────────────────────────────────────────────────────────────────────
interface GenState {
  status: 'idle' | 'generating' | 'complete' | 'error';
  progress: number;
  imageUrls: string[];
  imageUrl: string | null;  // single image for demo mode
  error: string | null;
}

export default function ImageGenerator({ isDemo = false }: { isDemo?: boolean }) {
  const [activeTab, setActiveTab] = useState<TabType>('text-to-image');
  const [prompt, setPrompt] = useState('');
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const pendingPromptRef = useRef<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('auto');
  const [quality, setQuality] = useState('standard');
  const [model, setModel] = useState('gpt-image-2');

  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [aspectRatioDropdownOpen, setAspectRatioDropdownOpen] = useState(false);
  const [qualityDropdownOpen, setQualityDropdownOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [insufficientCredits, setInsufficientCredits] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [state, setState] = useState<GenState>({
    status: 'idle', progress: 0, imageUrls: [], imageUrl: null, error: null
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  // previewMode: 'gallery' = click-to-browse single image, 'comparison' = before/after slider, 'single' = static single image
  const [previewMode, setPreviewMode] = useState<'gallery' | 'comparison' | 'single'>('gallery');
  const [galleryIndex, setGalleryIndex] = useState(0);

  const modelRef = useRef<HTMLDivElement>(null);
  const aspectRatioRef = useRef<HTMLDivElement>(null);
  const qualityRef = useRef<HTMLDivElement>(null);
  const { isSignedIn, userId } = useAuth();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
      }
      if (aspectRatioRef.current && !aspectRatioRef.current.contains(e.target as Node)) {
        setAspectRatioDropdownOpen(false);
      }
      if (qualityRef.current && !qualityRef.current.contains(e.target as Node)) {
        setQualityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // Fetch user credits on mount
  useEffect(() => {
    if (userId) {
      fetch('/api/user')
        .then(res => res.json())
        .then(data => {
          if (data.credits !== undefined) {
            setCredits(data.credits);
          }
        })
        .catch(() => {});
    }
  }, [userId]);

  // Sync previewMode when tab or uploaded images change
  useEffect(() => {
    if (activeTab === 'text-to-image') {
      setPreviewMode(state.status === 'idle' ? 'gallery' : 'single');
    } else {
      // image-to-image
      if (state.status === 'idle') {
        setPreviewMode(uploadedImages.length > 0 ? 'single' : 'comparison');
      } else {
        setPreviewMode('comparison');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, uploadedImages.length, state.status]);

  // Fill prompt when switching to T2I via Try It
  useEffect(() => {
    if (activeTab === 'text-to-image' && pendingPromptRef.current) {
      setPrompt(pendingPromptRef.current);
      pendingPromptRef.current = null;
    }
  }, [activeTab]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const remaining = 5 - uploadedImages.length;
    const toProcess = files.slice(0, remaining);
    const newImages: string[] = [];
    toProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setUploadedImages(prev => [...prev, result].slice(0, 5));
      };
      reader.readAsDataURL(file);
      newImages.push(''); // placeholder
    });
  };

  const handleGenerate = async () => {
    const currentPrompt = activeTab === 'text-to-image' ? prompt : 'Image transformation';
    if (activeTab === 'text-to-image' && !prompt.trim()) return;

    if (credits !== null && credits <= 0) {
      setInsufficientCredits(true);
      return;
    }

    setState({ status: 'generating', progress: 0, imageUrls: [], imageUrl: null, error: null });
    setInsufficientCredits(false);

    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 20, 90)
      }));
    }, 400);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: currentPrompt, 
          aspectRatio, 
          quality, 
          model,
          inputImageUrl: activeTab === 'image-to-image' ? uploadedImages[0] : undefined,
          resolution: quality === 'hd' ? '2K' : (quality === 'ultra' ? '4K' : '1K'),
        }),
      });
      const data = await res.json();
      clearInterval(interval);

      if (data.error) {
        setState({ status: 'error', progress: 0, imageUrls: [], imageUrl: null, error: data.error });
        if (data.error.includes('credits') || data.error.includes('Credit')) {
          setInsufficientCredits(true);
        }
      } else {
        if (isDemo) {
          setState({ status: 'complete', progress: 100, imageUrls: [], imageUrl: data.imageUrl, error: null });
        } else {
          setState({ status: 'complete', progress: 100, imageUrls: [data.imageUrl], imageUrl: data.imageUrl, error: null });
          setImageUrl(data.imageUrl);
        }
        const selectedModel = MODEL_OPTIONS.find(m => m.value === model);
        const resolutionMap: Record<string, string> = { standard: '1K', hd: '2K', ultra: '4K' };
        const res = resolutionMap[quality] || '1K';
        const cost = selectedModel?.costByResolution[res as keyof typeof selectedModel.costByResolution] || 1;
        if (credits !== null) {
          setCredits(prev => prev !== null ? prev - cost : null);
        }
      }
    } catch {
      clearInterval(interval);
      setState({ status: 'error', progress: 0, imageUrls: [], imageUrl: null, error: 'Network error' });
    }
  };

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-image-${Date.now()}.png`;
    link.click();
  };

  return (
    <section className="generator-section" id="generator">
      <div className="orb orb-1" style={{ opacity: 0.2 }} />
      <div className="orb orb-2" style={{ opacity: 0.15 }} />
      
      <div className="generator-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}>
            AI Image Generator
          </h2>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.25rem',
          marginBottom: '1.75rem',
          background: 'var(--bg-card)',
          borderRadius: '12px',
          padding: '4px',
          width: 'fit-content',
          margin: '0 auto 2rem',
          border: '1px solid var(--border-subtle)',
        }}>
          <button
            onClick={() => setActiveTab('text-to-image')}
            style={{
              padding: '0.625rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              background: activeTab === 'text-to-image' ? 'var(--gradient-primary)' : 'transparent',
              color: activeTab === 'text-to-image' ? 'white' : 'var(--text-secondary)',
              boxShadow: activeTab === 'text-to-image' ? '0 2px 8px rgba(52, 98, 91, 0.3)' : 'none',
            }}
          >
            Text to Image
          </button>
          <button
            onClick={() => setActiveTab('image-to-image')}
            style={{
              padding: '0.625rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              background: activeTab === 'image-to-image' ? 'var(--gradient-primary)' : 'transparent',
              color: activeTab === 'image-to-image' ? 'white' : 'var(--text-secondary)',
              boxShadow: activeTab === 'image-to-image' ? '0 2px 8px rgba(52, 98, 91, 0.3)' : 'none',
            }}
          >
            Image to Image
          </button>
        </div>

        {/* Two-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}>
          {/* Left Column - Form */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
          }}>
            {/* Model Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}>
                Model
              </label>
              <div ref={modelRef} style={{ position: 'relative', zIndex: 20 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setModelDropdownOpen(!modelDropdownOpen); }}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-primary)',
                    border: `1px solid ${modelDropdownOpen ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                    boxShadow: modelDropdownOpen ? '0 0 0 3px rgba(52, 98, 91, 0.12)' : 'none',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {MODEL_OPTIONS.find(m => m.value === model)?.label}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ transform: modelDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {modelDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '10px',
                    padding: '0.375rem',
                    zIndex: 50,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}>
                    {MODEL_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setModel(option.value); setModelDropdownOpen(false); }}
                        style={{
                          width: '100%',
                          padding: '0.625rem 0.75rem',
                          background: model === option.value ? 'var(--bg-tertiary)' : 'transparent',
                          border: model === option.value ? '1px solid var(--border-default)' : '1px solid transparent',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '2px',
                        }}
                      >
                        <span style={{ textAlign: 'left' }}>
                          <span style={{ fontWeight: 600, display: 'block', fontSize: '0.8125rem' }}>{option.label}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>{option.description}</span>
                        </span>
                        {model === option.value && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Image-to-Image Prompt — shown after Model dropdown, before Image Upload */}
            {activeTab === 'image-to-image' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}>
                  Prompt
                </label>
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe how you want to transform this image..."
                    maxLength={3000}
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '0.875rem 1rem',
                      paddingBottom: '2rem',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      lineHeight: 1.6,
                      resize: 'vertical',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-primary)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52, 98, 91, 0.12)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-default)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: '0.5rem',
                    right: '0.75rem',
                    fontSize: '0.6875rem',
                    color: 'var(--text-muted)',
                  }}>
                    {prompt.length}/3000
                  </span>
                </div>
              </div>
            )}

            {/* Image Upload - only for Image to Image */}
            {activeTab === 'image-to-image' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}>
                  Upload Images (up to 5)
                </label>
                <div style={{
                  border: '2px dashed var(--border-default)',
                  borderRadius: '10px',
                  padding: '1rem',
                  textAlign: 'center',
                  background: 'var(--bg-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}>
                  {uploadedImages.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {/* Image cards grid + Add More card */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                        {uploadedImages.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative', width: '72px', height: '72px' }}>
                            <img
                              src={img}
                              alt={`Uploaded ${idx + 1}`}
                              style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '12px',
                                objectFit: 'cover',
                                border: '2px solid var(--border-subtle)',
                              }}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedImages(prev => prev.filter((_, i) => i !== idx));
                              }}
                              style={{
                                position: 'absolute',
                                top: '-7px',
                                right: '-7px',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: '#EF4444',
                                border: '2px solid var(--bg-primary)',
                                color: 'white',
                                fontSize: '11px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                              }}
                            >×</button>
                          </div>
                        ))}
                        {uploadedImages.length < 5 && (
                          <label
                            htmlFor="image-upload"
                            onClick={(e) => e.currentTarget.querySelector('input')?.click()}
                            style={{
                              width: '72px',
                              height: '72px',
                              borderRadius: '12px',
                              border: '2px dashed var(--border-default)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.15rem',
                              cursor: 'pointer',
                              color: 'var(--text-muted)',
                              background: 'var(--bg-secondary)',
                              transition: 'all 0.2s',
                            }}
                          >
                            <span style={{ fontSize: '1.25rem', fontWeight: 300, lineHeight: 1 }}>+</span>
                            <span style={{ fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Add</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              style={{ display: 'none' }}
                              id="image-upload"
                            />
                          </label>
                        )}
                      </div>
                      {uploadedImages.length > 0 && (
                        <button
                          onClick={() => setUploadedImages([])}
                          style={{
                            alignSelf: 'flex-start',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '8px',
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#EF4444',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                          Remove All
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: '0.75rem' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                        Drop images here or click to upload (up to 5)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        id="image-upload-choose"
                      />
                      <label
                        htmlFor="image-upload-choose"
                        style={{
                          display: 'inline-block',
                          padding: '0.5rem 1rem',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-default)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                        }}
                      >
                        Choose Files
                      </label>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Prompt - only for Text to Image */}
            {activeTab === 'text-to-image' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}>
                  Prompt
                </label>
                <div style={{ position: 'relative' }}>
                  <textarea
                    ref={promptRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the details of the image, such as color, shape, texture, etc."
                    maxLength={3000}
                    style={{
                      width: '100%',
                      minHeight: '120px',
                      padding: '0.875rem 1rem',
                      paddingBottom: '2rem',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      lineHeight: 1.6,
                      resize: 'vertical',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-primary)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52, 98, 91, 0.12)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-default)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: '0.5rem',
                    right: '0.75rem',
                    fontSize: '0.6875rem',
                    color: 'var(--text-muted)',
                  }}>
                    {prompt.length}/3000
                  </span>
                </div>
              </div>
            )}

            {/* Aspect Ratio */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}>
                Aspect Ratio
              </label>
              <div ref={aspectRatioRef} style={{ position: 'relative', zIndex: 15 }}>
                <button
                  onClick={() => setAspectRatioDropdownOpen(!aspectRatioDropdownOpen)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.625rem 0.875rem',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{aspectRatio}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {aspectRatioDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '10px',
                    padding: '0.375rem',
                    zIndex: 50,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}>
                    {ASPECT_RATIOS.map((ratio) => (
                      <button
                        key={ratio.value}
                        onClick={() => { setAspectRatio(ratio.value); setAspectRatioDropdownOpen(false); }}
                        style={{
                          width: '100%',
                          padding: '0.625rem 0.75rem',
                          background: aspectRatio === ratio.value ? 'var(--bg-tertiary)' : 'transparent',
                          border: aspectRatio === ratio.value ? '1px solid var(--border-default)' : '1px solid transparent',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '2px',
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{ratio.label}</span>
                        {aspectRatio === ratio.value && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quality */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}>
                Quality
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
              }}>
                {QUALITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setQuality(option.value)}
                    style={{
                      padding: '0.625rem 0.5rem',
                      background: quality === option.value ? 'var(--accent-primary)' : 'var(--bg-card)',
                      border: quality === option.value ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                      borderRadius: '10px',
                      color: quality === option.value ? 'white' : 'var(--text-primary)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>{option.label}</span>
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: 400,
                      opacity: quality === option.value ? 0.8 : 0.6,
                    }}>
                      {option.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <button style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: 'var(--gradient-primary)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(52, 98, 91, 0.3)',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                  </svg>
                  Sign In to Generate
                </button>
              </SignInButton>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={
                  state.status === 'generating' ||
                  (activeTab === 'text-to-image' && !prompt.trim()) ||
                  (activeTab === 'image-to-image' && (uploadedImages.length === 0 || !prompt.trim()))
                }
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: state.status === 'generating' ||
                    (activeTab === 'text-to-image' && !prompt.trim()) ||
                    (activeTab === 'image-to-image' && (uploadedImages.length === 0 || !prompt.trim()))
                    ? 'var(--bg-tertiary)'
                    : 'var(--gradient-primary)',
                  border: 'none',
                  borderRadius: '10px',
                  color: state.status === 'generating' ||
                    (activeTab === 'text-to-image' && !prompt.trim()) ||
                    (activeTab === 'image-to-image' && (uploadedImages.length === 0 || !prompt.trim()))
                    ? 'var(--text-muted)'
                    : 'white',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: state.status === 'generating' ||
                    (activeTab === 'text-to-image' && !prompt.trim()) ||
                    (activeTab === 'image-to-image' && (uploadedImages.length === 0 || !prompt.trim()))
                    ? 'not-allowed'
                    : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  boxShadow: state.status === 'generating' ||
                    (activeTab === 'text-to-image' && !prompt.trim()) ||
                    (activeTab === 'image-to-image' && (uploadedImages.length === 0 || !prompt.trim()))
                    ? 'none'
                    : '0 4px 12px rgba(52, 98, 91, 0.3)',
                }}
              >
                {state.status === 'generating' ? (
                  <>
                    <span style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.4)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    Generating...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
                    </svg>
                    {(() => {
                      const resolutionMap: Record<string, string> = { standard: '1K', hd: '2K', ultra: '4K' };
                      const res = resolutionMap[quality] || '1K';
                      const cost = MODEL_OPTIONS.find(m => m.value === model)?.costByResolution[res as keyof typeof MODEL_OPTIONS[0]['costByResolution']] || 1;
                      return `${cost} Credits`;
                    })()}
                  </>
                )}
              </button>
            )}

            {/* Credits info + My Images — two separate actions */}
            {isSignedIn && credits !== null && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                {/* Credits balance */}
                <div style={{
                  flex: 1,
                  padding: '0.625rem 0.875rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '0.8125rem',
                  gap: '0.5rem',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  <span style={{ color: 'var(--text-secondary)' }}>{credits} credits</span>
                </div>
                {/* My Images link */}
                <a href="/my-images" style={{
                  flex: 1,
                  padding: '0.625rem 0.875rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'var(--accent-primary)',
                  textDecoration: 'none',
                  border: '1px solid var(--border-default)',
                  transition: 'all 0.2s ease',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                  My Images
                </a>
              </div>
            )}

            {/* Insufficient Credits */}
            {insufficientCredits && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                textAlign: 'center',
              }}>
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Insufficient credits
                </p>
                <Link href="/pricing" style={{
                  color: 'var(--accent-primary)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}>
                  Buy Credits →
                </Link>
              </div>
            )}
          </div>

          {/* Right Column - Preview */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <label style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              display: 'none',
            }}>
              Image Preview
            </label>



            {/* Error State */}
            {state.status === 'error' && (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '2rem',
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: '1px solid rgba(220, 69, 69, 0.2)',
                textAlign: 'center',
              }}>
                <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9375rem' }}>
                  {state.error}
                </p>
                <button
                  onClick={() => {
                    setState({ status: 'idle', progress: 0, imageUrls: [], imageUrl: null, error: null });
                    setActiveTab('text-to-image');
                    setPreviewMode('gallery');
                    setGalleryIndex(0);
                  }}
                  style={{
                    padding: '0.625rem 1rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* IDLE STATE — tab + upload-dependent preview */}
            {state.status === 'idle' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Preview label */}
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                }}>
                  Image Preview
                </div>

                {/* T2I idle: gallery — click thumbnail to browse full-size demo image */}
                {activeTab === 'text-to-image' && previewMode === 'gallery' && (
                  <div style={{ aspectRatio: '1/1', width: '100%', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    <SimpleImage
                      src={DEMO_PAIR.imageUrls[galleryIndex].after}
                      label="Gallery"
                      aspectRatio="1:1"
                      bgSrc={DEMO_PAIR.imageUrls[galleryIndex].after}
                    />
                  </div>
                )}

                {/* I2I idle + no upload: comparison demo slider */}
                {activeTab === 'image-to-image' && previewMode === 'comparison' && (
                  <div style={{ aspectRatio: '1/1', width: '100%', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    <ComparisonSliderDemo
                      beforeSrc={DEMO_PAIR.imageUrls[selectedIndex].before}
                      afterSrc={DEMO_PAIR.imageUrls[selectedIndex].after}
                      aspectRatio="1:1"
                    />
                  </div>
                )}

                {/* I2I idle + uploaded (no generation yet): single preview image — objectFit cover, 1:1 container */}
                {activeTab === 'image-to-image' && previewMode === 'single' && uploadedImages.length > 0 && (
                  <div style={{ aspectRatio: '1/1', width: '100%', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    <img
                      src={uploadedImages[0]}
                      alt="Uploaded preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                )}

                {/* Fixed Demo Thumbnails — always shown in idle */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '0.5rem',
                  marginTop: '0.875rem',
                  marginBottom: '0.875rem',
                }}>
                  {DEMO_PAIR.imageUrls.map((pair, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      {/* Thumbnail image only */}
                      <div
                        className="t2i-thumb"
                        onClick={() => {
                          setSelectedIndex(i);
                          if (activeTab === 'text-to-image') {
                            setGalleryIndex(i);
                          } else {
                            setPreviewMode('comparison');
                          }
                        }}
                        onMouseOver={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.transform = 'translateY(-3px)';
                          el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
                        }}
                        onMouseOut={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.transform = 'translateY(0)';
                          el.style.boxShadow = 'none';
                        }}
                        style={{
                          position: 'relative',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          border: (previewMode === 'gallery' ? galleryIndex === i : selectedIndex === i)
                            ? '2px solid var(--accent-primary)'
                            : '2px solid var(--border-subtle)',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          background: 'var(--bg-card)',
                        }}
                      >
                        <div style={{ aspectRatio: '1/1' }}>
                          <img
                            src={pair.after}
                            alt={`Demo ${i + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        </div>
                      </div>

                      {/* Try It button below the image */}
                      <button
                        onClick={() => {
                          const targetPrompt = pair.prompt;
                          const isAlreadyT2I = activeTab === 'text-to-image';
                          setActiveTab('text-to-image');
                          setPreviewMode('gallery');
                          setGalleryIndex(i);
                          setTimeout(() => {
                            if (promptRef.current) {
                              promptRef.current.focus();
                              const nativeSetter = Object.getOwnPropertyDescriptor(
                                window.HTMLTextAreaElement.prototype, 'value'
                              )?.set;
                              nativeSetter?.call(promptRef.current, targetPrompt);
                              promptRef.current.dispatchEvent(
                                new Event('input', { bubbles: true, cancelable: true })
                              );
                            } else {
                              setPrompt(targetPrompt);
                            }
                          }, isAlreadyT2I ? 0 : 50);
                        }}
                        title="Try this prompt"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.3rem',
                          width: '100%',
                          padding: '0.35rem 0',
                          background: 'var(--gradient-primary)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(255,140,66,0.3)',
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                        Try It
                      </button>
                    </div>
                  ))}
                </div>

                {/* Hint text per mode */}
                {activeTab === 'text-to-image' && previewMode === 'gallery' && (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                    ← Click thumbnails to preview • Enter prompt to generate →
                  </p>
                )}
                {activeTab === 'image-to-image' && previewMode === 'comparison' && (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                    ← Drag to compare before &amp; after • Upload your image to start →
                  </p>
                )}
              </div>
            )}

            {/* Generating Progress */}
            {state.status === 'generating' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{
                  height: '6px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  marginBottom: '1rem',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${state.progress}%`,
                    background: 'var(--gradient-primary)',
                    borderRadius: '9999px',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {state.progress < 30 && 'Initializing model...'}
                  {state.progress >= 30 && state.progress < 60 && 'Generating image...'}
                  {state.progress >= 60 && state.progress < 90 && 'Refining details...'}
                  {state.progress >= 90 && 'Finalizing...'}
                </p>
              </div>
            )}

            {/* COMPLETE STATE — T2I: single generated image | I2I: before/after comparison */}
            {state.status === 'complete' && (state.imageUrls.length > 0 || !!state.imageUrl) && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Preview label */}
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                }}>
                  Image Preview
                </div>

                {/* T2I complete: single generated image with overlay buttons */}
                {activeTab === 'text-to-image' && (
                  <div style={{ aspectRatio: '1/1', width: '100%', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    <SimpleImage
                      src={isDemo ? (state.imageUrl || '') : state.imageUrls[selectedIndex]}
                      label="Generated"
                      aspectRatio="1:1"
                      overlay={
                      <>
                        <button
                          onClick={() => handleDownload(isDemo ? state.imageUrl! : state.imageUrls[selectedIndex])}
                          style={{ padding: '0.5rem 0.875rem', background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', backdropFilter: 'blur(8px)' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                          Download
                        </button>
                        <a href="/my-images"
                          style={{ padding: '0.5rem 0.875rem', background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', backdropFilter: 'blur(8px)' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                          My Images
                        </a>
                      </>
                    }
                    />
                  </div>
                )}

                {/* I2I complete: comparison slider with overlay buttons */}
                {activeTab === 'image-to-image' && (
                  <div style={{ aspectRatio: '1/1', width: '100%', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    <ComparisonSlider
                      beforeSrc={uploadedImages[0] || ''}
                      afterSrc={isDemo ? (state.imageUrl || '') : state.imageUrls[selectedIndex]}
                      beforeLabel="Original"
                      afterLabel="Generated"
                      aspectRatio="1:1"
                      overlay={
                      <>
                        <button
                          onClick={() => handleDownload(isDemo ? state.imageUrl! : state.imageUrls[selectedIndex])}
                          style={{ padding: '0.5rem 0.875rem', background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', backdropFilter: 'blur(8px)' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                          Download
                        </button>
                        <a href="/my-images"
                          style={{ padding: '0.5rem 0.875rem', background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', textDecoration: 'none', backdropFilter: 'blur(8px)' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                          My Images
                        </a>
                      </>
                    }
                    />
                  </div>
                )}

                {/* Fixed Demo Thumbnails */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '0.5rem',
                  marginTop: '0.875rem',
                }}>
                  {DEMO_PAIR.imageUrls.map((pair, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedIndex(i)}
                      style={{
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: selectedIndex === i ? '2px solid var(--accent-primary)' : '2px solid transparent',
                        cursor: 'pointer',
                        padding: 0,
                        background: 'var(--bg-secondary)',
                        aspectRatio: '1/1',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <img
                        src={pair.after}
                        alt={`Demo ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </section>
  );
}
