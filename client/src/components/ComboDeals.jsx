import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader } from 'lucide-react';
import { getProducts } from '../api/products.js';
import ProductCard from './ProductCard.jsx';

const formatPrice = (p) => `Rs. ${p?.toLocaleString('en-PK')}`;

export default function ComboDeals({ onQuickView }) {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ combo: 'true', limit: 4 })
      .then((d) => setCombos(d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section" id="combo-deals" style={{ background: 'var(--color-fg)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{
            display: 'inline-block',
            background: '#c5a46a',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            padding: '6px 16px',
            borderRadius: 'var(--radius-pill)',
            marginBottom: '16px',
          }}>
            Save More · Bundle Deals
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '12px',
          }}>
            Combo Offers
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', maxWidth: '480px', margin: '0 auto' }}>
            Luxury bundles curated to elevate your complete look. Save 40–60% vs buying separately.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader size={28} style={{ animation: 'spin 1s linear infinite', color: 'rgba(255,255,255,0.4)' }} />
          </div>
        ) : (
          <div className="product-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {combos.map((product) => (
              <div key={product._id} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <ProductCard product={product} onQuickView={onQuickView} />
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link
            to="/collections/combos"
            id="view-all-combos-btn"
            className="btn"
            style={{
              background: 'transparent',
              color: '#fff',
              border: '1.5px solid rgba(255,255,255,0.3)',
              padding: '14px 32px',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            View All Combo Deals <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
