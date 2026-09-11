import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader } from 'lucide-react';
import { getProducts } from '../api/products.js';
import ProductCard from './ProductCard.jsx';

export default function FeaturedProducts({ onQuickView }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ featured: 'true', limit: 8 })
      .then((d) => setProducts(d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section" id="featured-products" style={{ background: '#fafaf8' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-fg-subtle)', marginBottom: '8px', fontWeight: 600 }}>
              Handpicked For You
            </p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700 }}>
              Featured Products
            </h2>
          </div>
          <Link
            to="/collections/all"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-heading)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-fg)',
              textDecoration: 'none',
              borderBottom: '1.5px solid var(--color-fg)',
              paddingBottom: '2px',
            }}
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Loader size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-fg-subtle)' }} />
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onQuickView={onQuickView} />
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
