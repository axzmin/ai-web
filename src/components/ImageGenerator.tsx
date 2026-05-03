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
    },
    {
      before: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=40',
      after:  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=85',
    },
    {
      before: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&q=40',
      after:  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=85',
    },
    {
      before: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&q=40',
      after:  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=85',
    },
    {
      before: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=40',
      after:  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=85',
    },
  ],
};

// ─── Comparison Slider Component ───────────────────────────────────────────
function ComparisonSlider({ beforeSrc, afterSrc, beforeLabel, afterLabel }: { beforeSrc: string; afterSrc: string; beforeLabel?: string; afterLabel?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderX, setSliderX] = useState(50); // percentage 0–100

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const move = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);
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
      onTouchMove={handleTouchMove}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4/3',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'col-resize',
        userSelect: 'none',
        background: 'var(--bg-secondary)',
        flexShrink: 0,
      }}
    >
      {/* Before image (full width, underneath) */}
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
        }}
      />

      {/* After image (clipped by slider position, on top) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: `${sliderX}%`,
          height: '100%',
          overflow: 'hidden',
        }}
      >
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

      {/* Vertical divider line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${sliderX}%`,
          width: '2px',
          background: 'white',
          transform: 'translateX(-50%)',
          boxShadow: '0 0 8px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        }}
      />

      {/* Circle handle */}
      <div
        onMouseDown={handleMouseDown}
        style={{
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
          zIndex: 2,
        }}
      >
        {/* Left arrow */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" style={{ marginRight: '2px' }}>
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        {/* Right arrow */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" style={{ marginLeft: '2px' }}>
          <polyline points="9 18 15 12 9 6"/>
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
      }}>
        {beforeLabel || 'Original'}
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
      }}>
        {afterLabel || 'Enhanced'}
      </div>
    </div>
  );
}


// ─── Comparison Slider Demo — resets to 50% when switching thumbnails ────────
function ComparisonSliderDemo({ beforeSrc, afterSrc }: { beforeSrc: string; afterSrc: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderX, setSliderX] = useState(50);

  // Reset slider to middle when switching thumbnails
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

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4/3',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'col-resize',
        userSelect: 'none',
        background: 'var(--bg-secondary)',
        flexShrink: 0,
      }}
    >
      <img src={beforeSrc} alt="Before" draggable={false}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, width: `${sliderX}%`, height: '100%', overflow: 'hidden' }}>
        <img src={afterSrc} alt="After" draggable={false}
          style={{ position: 'absolute', inset: 0, width: `${100 / (sliderX / 100)}%`, height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: `${sliderX}%`, width: '2px',
        background: 'white', transform: 'translateX(-50%)',
        boxShadow: '0 0 8px rgba(0,0,0,0.4)', pointerEvents: 'none',
      }} />
      <div onMouseDown={handleMouseDown}
        style={{
          position: 'absolute', top: '75%', left: `${sliderX}%`,
          transform: 'translate(-50%, -50%)',
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'col-resize', zIndex: 2,
        }}
      >
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
      }}>Before</div>
      <div style={{
        position: 'absolute', bottom: '10px', right: '10px',
        padding: '3px 10px', background: 'rgba(0,0,0,0.55)', borderRadius: '6px',
        color: 'white', fontSize: '0.6875rem', fontWeight: 600,
        letterSpacing: '0.04em', textTransform: 'uppercase', pointerEvents: 'none',
      }}>After</div>
    </div>
  );
}


// ─── Simple Image Component — no slider, just a clean image ─────────────────
function SimpleImage({ src, label }: { src: string; label?: string }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '4/3',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'var(--bg-secondary)',
      flexShrink: 0,
    }}>
      <img
        src={src}
        alt={label || 'Image'}
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {label && (
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
        }}>
          {label}
        </div>
      )}
    </div>
  );
}


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
  const [aspectRatio, setAspectRatio] = useState('auto');
  const [quality, setQuality] = useState('standard');
  const [model, setModel] = useState('gpt-image-2');

  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [aspectRatioDropdownOpen, setAspectRatioDropdownOpen] = useState(false);
  const [qualityDropdownOpen, setQualityDropdownOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [insufficientCredits, setInsufficientCredits] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
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

  // Sync previewMode when tab or uploaded image changes
  useEffect(() => {
    if (activeTab === 'text-to-image') {
      setPreviewMode(state.status === 'idle' ? 'gallery' : 'single');
    } else {
      // image-to-image
      if (state.status === 'idle') {
        setPreviewMode(uploadedImage ? 'single' : 'comparison');
      } else {
        setPreviewMode('comparison');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, uploadedImage, state.status]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
          inputImageUrl: activeTab === 'image-to-image' ? uploadedImage : undefined,
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
                  Upload Image
                </label>
                <div style={{
                  border: '2px dashed var(--border-default)',
                  borderRadius: '10px',
                  padding: '2rem',
                  textAlign: 'center',
                  background: 'var(--bg-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}>
                  {uploadedImage ? (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '150px',
                          borderRadius: '8px',
                          objectFit: 'contain',
                        }}
                      />
                      <button
                        onClick={() => setUploadedImage(null)}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'var(--ship-red)',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: '0.75rem' }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                        Drop an image here or click to upload
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
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
                        Choose File
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
                  (activeTab === 'image-to-image' && (!uploadedImage || !prompt.trim()))
                }
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: state.status === 'generating' ||
                    (activeTab === 'text-to-image' && !prompt.trim()) ||
                    (activeTab === 'image-to-image' && (!uploadedImage || !prompt.trim()))
                    ? 'var(--bg-tertiary)'
                    : 'var(--gradient-primary)',
                  border: 'none',
                  borderRadius: '10px',
                  color: state.status === 'generating' ||
                    (activeTab === 'text-to-image' && !prompt.trim()) ||
                    (activeTab === 'image-to-image' && (!uploadedImage || !prompt.trim()))
                    ? 'var(--text-muted)'
                    : 'white',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: state.status === 'generating' ||
                    (activeTab === 'text-to-image' && !prompt.trim()) ||
                    (activeTab === 'image-to-image' && (!uploadedImage || !prompt.trim()))
                    ? 'not-allowed'
                    : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  boxShadow: state.status === 'generating' ||
                    (activeTab === 'text-to-image' && !prompt.trim()) ||
                    (activeTab === 'image-to-image' && (!uploadedImage || !prompt.trim()))
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

            {/* Credits info */}
            {isSignedIn && credits !== null && (
              <div style={{
                marginTop: '0.75rem',
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
                <span style={{ color: 'var(--text-secondary)' }}>{credits} credits remaining</span>
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

            {/* Generated Images - Comparison Slider */}
            {state.status === 'complete' && (state.imageUrls.length > 0 || !!state.imageUrl) && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Main Comparison Slider */}
                <ComparisonSlider
                  beforeSrc={uploadedImage || (isDemo ? (state.imageUrl || '') : state.imageUrls[0])}
                  afterSrc={isDemo ? (state.imageUrl || '') : state.imageUrls[selectedIndex]}
                />

                {/* Thumbnail Strip */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '0.5rem',
                  marginTop: '0.875rem',
                  marginBottom: '0.875rem',
                }}>
                  {(isDemo ? (state.imageUrl ? [state.imageUrl] : []) : state.imageUrls).map((url, i) => (
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
                        src={url}
                        alt={`Thumb ${i + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleDownload(state.imageUrls[selectedIndex])}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--gradient-primary)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" x2="12" y1="15" y2="3"/>
                    </svg>
                    Download
                  </button>
                  <button
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const newUrls = [...state.imageUrls];
                            newUrls[selectedIndex] = ev.target?.result as string;
                            setState({ ...state, imageUrls: newUrls });
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Remix
                  </button>
                  <button
                    onClick={() => setState({ status: 'idle', progress: 0, imageUrls: [], imageUrl: null, error: null })}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    New
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ url: state.imageUrls[selectedIndex] });
                      } else {
                        navigator.clipboard.writeText(state.imageUrls[selectedIndex]);
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3"/>
                      <circle cx="6" cy="12" r="3"/>
                      <circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    Share
                  </button>
                  <button
                    onClick={() => alert('Added to favorites!')}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    Like
                  </button>
                </div>
              </div>
            )}

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
                  onClick={() => setState({ status: 'idle', progress: 0, imageUrls: [], imageUrl: null, error: null })}
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

                {/* T2I idle: gallery — click thumbnail to browse full-size demo image */}
                {activeTab === 'text-to-image' && previewMode === 'gallery' && (
                  <SimpleImage
                    src={DEMO_PAIR.imageUrls[galleryIndex].after}
                    label="Gallery"
                  />
                )}

                {/* I2I idle + no upload: comparison demo slider */}
                {activeTab === 'image-to-image' && previewMode === 'comparison' && (
                  <ComparisonSliderDemo
                    beforeSrc={DEMO_PAIR.imageUrls[selectedIndex].before}
                    afterSrc={DEMO_PAIR.imageUrls[selectedIndex].after}
                  />
                )}

                {/* I2I idle + uploaded (no generation yet): single uploaded image */}
                {activeTab === 'image-to-image' && previewMode === 'single' && uploadedImage && (
                  <SimpleImage src={uploadedImage} label="Your Image" />
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
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedIndex(i);
                        if (previewMode === 'gallery') setGalleryIndex(i);
                      }}
                      style={{
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: (previewMode === 'gallery' ? galleryIndex === i : selectedIndex === i)
                          ? '2px solid var(--accent-primary)'
                          : '2px solid transparent',
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
                {activeTab === 'image-to-image' && previewMode === 'single' && (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                    ← Add a prompt and click Generate to transform your image →
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

                {/* T2I complete: single generated image */}
                {activeTab === 'text-to-image' && (
                  <SimpleImage
                    src={isDemo ? (state.imageUrl || '') : state.imageUrls[selectedIndex]}
                    label="Generated"
                  />
                )}

                {/* I2I complete: comparison slider (uploaded vs generated) */}
                {activeTab === 'image-to-image' && (
                  <ComparisonSlider
                    beforeSrc={uploadedImage || ''}
                    afterSrc={isDemo ? (state.imageUrl || '') : state.imageUrls[selectedIndex]}
                    beforeLabel="Original"
                    afterLabel="Generated"
                  />
                )}

                {/* Fixed Demo Thumbnails */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '0.5rem',
                  marginTop: '0.875rem',
                  marginBottom: '0.875rem',
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

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleDownload(isDemo ? state.imageUrl! : state.imageUrls[selectedIndex])}
                    style={{ flex: 1, padding: '0.75rem', background: 'var(--gradient-primary)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Download
                  </button>
                  <button
                    onClick={() => setState({ status: 'idle', progress: 0, imageUrls: [], imageUrl: null, error: null })}
                    style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    New
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(isDemo ? state.imageUrl! : state.imageUrls[selectedIndex])}
                    style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    Share
                  </button>
                  <button
                    onClick={() => {}}
                    style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    Like
                  </button>
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
      `}</style>
    </section>
  );
}
