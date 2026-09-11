import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Loader, Filter } from 'lucide-react';
import { getProducts } from '../api/products.js';
import ProductCard from '../components/ProductCard.jsx';

const CATEGORY_LABELS = {
  all: 'All Products',
  watches: 'Watches',
  wallets: 'Wallets',
  perfumes: 'Perfumes',
  jewellery: 'Jewellery',
  gifts: 'Gift Items',
  'mobile-accessories': 'Mobile Accessories',
  new: 'New Arrivals',
};

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'title-asc', label: 'A–Z' },
];

export default function CatalogPage({ onQuickView }) {
  const { category = 'all' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchQuery = searchParams.get('search') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        sort,
        limit: 40,
      };
      if (category && category !== 'all' && category !== 'new') {
        params.category = category;
      }
      if (category === 'combos') {
        delete params.category;
        params.combo = 'true';
      }
      if (inStockOnly) params.inStock = 'true';
      if (searchQuery) params.search = searchQuery;

      const data = await getProducts(params);
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, sort, inStockOnly, searchQuery]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  const pageTitle = searchQuery
    ? `Search: "${searchQuery}"`
    : CATEGORY_LABELS[category] || 'Shop All';

  return (
    <div style={{ minHeight: '80vh' }}>
      {/* Page Header */}
      <div
        style={{
          background: '#030302',
          padding: '48px 24px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '10px', fontWeight: 600 }}>
            Royal Choice Collections
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, color: '#fff' }}>
            {pageTitle}
          </h1>
          {total > 0 && (
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '8px' }}>
              {total} product{total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: '24px 24px 80px' }}>
        {/* Filter/Sort Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 0',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              id="toggle-filters-btn"
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary"
              style={{ padding: '10px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <SlidersHorizontal size={15} />
              Filters
              {inStockOnly && (
                <span style={{ background: 'var(--color-fg)', color: '#fff', fontSize: '10px', padding: '1px 6px', borderRadius: 'var(--radius-pill)' }}>
                  1
                </span>
              )}
            </button>

            {inStockOnly && (
              <button
                onClick={() => setInStockOnly(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-fg-muted)', background: 'rgba(3,3,2,0.06)', padding: '6px 10px', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer' }}
              >
                In Stock Only <X size={12} />
              </button>
            )}

            {searchQuery && (
              <span style={{ fontSize: '12px', color: 'var(--color-fg-muted)', padding: '6px 12px', background: 'rgba(3,3,2,0.05)', borderRadius: 'var(--radius-pill)' }}>
                Search: "{searchQuery}"
              </span>
            )}
          </div>

          {/* Sort Dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                appearance: 'none',
                padding: '10px 36px 10px 14px',
                border: '1.5px solid var(--color-border-md)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
                background: '#fff',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '180px',
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-fg-subtle)' }} />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={{
            padding: '20px',
            background: '#fafafa',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-fg)', cursor: 'pointer' }}
              />
              In Stock Only
            </label>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.entries(CATEGORY_LABELS).filter(([k]) => k !== 'all' && k !== 'new').map(([slug, label]) => (
                <button
                  key={slug}
                  onClick={() => navigate(`/collections/${slug}`)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 500,
                    border: '1.5px solid',
                    borderColor: category === slug ? 'var(--color-fg)' : 'var(--color-border-md)',
                    background: category === slug ? 'var(--color-fg)' : 'transparent',
                    color: category === slug ? '#fff' : 'var(--color-fg)',
                    borderRadius: 'var(--radius-pill)',
                    cursor: 'pointer',
                    transition: 'all var(--transition)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Loader size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-fg-subtle)' }} />
          </div>
        )}

        {/* No Results */}
        {!loading && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>
              No products found
            </p>
            <p style={{ color: 'var(--color-fg-muted)', marginBottom: '24px' }}>
              {searchQuery ? `No results for "${searchQuery}".` : 'This collection is coming soon.'}
            </p>
            <button onClick={() => navigate('/collections/all')} className="btn btn-primary">
              Browse All Products
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onQuickView={onQuickView} />
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
