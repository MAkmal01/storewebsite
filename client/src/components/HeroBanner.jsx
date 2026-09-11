import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HERO_CONTENT = {
  headline: 'ROYAL COLLECTION',
  subheadline: 'TIMELESS LUXURY & ELEGANCE',
  description: 'Curated premium watches, fine jewellery, and luxury accessories delivered to your doorstep across Pakistan.',
  cta: 'Explore Collection',
  ctaPath: '/collections/all',
};

// Two hero images using real unsplash photos that match DN Store aesthetic
const SLIDES = [
  {
    bg: 'linear-gradient(120deg, #1a1a18 0%, #2d2d2a 100%)',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1400&auto=format&fit=crop', // Watches image
    accent: '#c5a46a',
  },
  {
    bg: 'linear-gradient(120deg, #0d1a12 0%, #1b3b2b 100%)',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1400&auto=format&fit=crop', // Perfumes image
    accent: '#6ec07d',
  },
];

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        background: SLIDES[0].bg,
        minHeight: 'clamp(480px, 80vh, 720px)',
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <img
        src={SLIDES[0].image}
        alt="DN Store Summer Elite 2026 Collection"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          opacity: 0.55,
        }}
      />

      {/* Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(3,3,2,0.85) 0%, rgba(3,3,2,0.5) 55%, rgba(3,3,2,0.15) 100%)',
        }}
      />

      {/* Content */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 24px',
          maxWidth: '640px',
        }}
      >
        {/* Eyebrow */}
        <span
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#c5a46a',
            marginBottom: '20px',
            padding: '6px 14px',
            border: '1px solid rgba(197,164,106,0.4)',
            borderRadius: 'var(--radius-pill)',
            width: 'fit-content',
          }}
        >
          Royal Choice Exclusive
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
            color: '#ffffff',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            marginBottom: '20px',
          }}
        >
          {HERO_CONTENT.headline}
          <br />
          <span style={{ fontSize: 'clamp(1rem, 2.5vw, 1.6rem)', fontWeight: 400, opacity: 0.85, letterSpacing: '0.05em' }}>
            {HERO_CONTENT.subheadline}
          </span>
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'rgba(255,255,255,0.8)',
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            lineHeight: 1.7,
            marginBottom: '36px',
            maxWidth: '380px',
          }}
        >
          {HERO_CONTENT.description}
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            id="hero-cta-btn"
            onClick={() => navigate(HERO_CONTENT.ctaPath)}
            className="btn btn-primary"
            style={{
              background: '#c5a46a',
              borderColor: '#c5a46a',
              color: '#fff',
              padding: '16px 32px',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {HERO_CONTENT.cta} <ArrowRight size={16} />
          </button>
          <button
            id="hero-combos-btn"
            onClick={() => navigate('/collections/gifts')}
            className="btn btn-secondary"
            style={{
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.4)',
              padding: '16px 28px',
              fontSize: '14px',
            }}
          >
            Gift Sets
          </button>
        </div>

        {/* Trust Indicators */}
        <div style={{ display: 'flex', gap: '24px', marginTop: '48px', flexWrap: 'wrap' }}>
          {['COD Available', 'Free Delivery over Rs. 10K', '7-Day Exchange'].map((trust) => (
            <div key={trust} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#c5a46a', fontSize: '14px' }}>✓</span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', fontWeight: 500 }}>
                {trust}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
