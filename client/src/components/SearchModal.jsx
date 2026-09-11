import { useState, useEffect, useRef } from 'react';
import { X, Search, ArrowRight, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/products.js';
import ProductCard from './ProductCard.jsx';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await getProducts({ search: query.trim(), limit: 8 });
        setResults(data.products || []);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleKey = (e) => {
    if (e.key === 'Escape') onClose();
  };

  const formatPrice = (p) => `Rs. ${p?.toLocaleString('en-PK')}`;

  return (
    <>
      <div className={`search-modal ${isOpen ? 'open' : ''}`} onKeyDown={handleKey}>
        <button
          id="search-close-btn"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            padding: '8px',
            borderRadius: '50%',
            background: 'rgba(3,3,2,0.08)',
          }}
          aria-label="Close search"
        >
          <X size={20} />
        </button>

        <div style={{ width: '100%', maxWidth: '640px' }}>
          <p style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-fg-subtle)',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            Search Royal Choice
          </p>

          <div style={{ position: 'relative', marginBottom: '32px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-fg-subtle)',
              }}
            />
            <input
              ref={inputRef}
              id="search-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, styles, collections…"
              style={{
                width: '100%',
                padding: '18px 18px 18px 48px',
                border: '2px solid var(--color-border-md)',
                borderRadius: 'var(--radius-xl)',
                fontSize: '16px',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                transition: 'border-color var(--transition)',
                background: '#fff',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-fg)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-md)')}
            />
            {loading && (
              <Loader
                size={16}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-fg-subtle)',
                  animation: 'spin 1s linear infinite',
                }}
              />
            )}
          </div>

          {!query && (
            <div>
              <p style={{ fontSize: '12px', color: 'var(--color-fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', fontWeight: 600 }}>
                Popular Searches
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Chronograph Watch', 'Leather Wallet', 'Oud Perfume', 'Tennis Bracelet', 'Gift Sets', 'Power Bank'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    style={{
                      padding: '8px 14px',
                      border: '1.5px solid var(--color-border-md)',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '13px',
                      fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                      background: 'transparent',
                      transition: 'all var(--transition)',
                    }}
                    onMouseEnter={(e) => { e.target.style.background = 'var(--color-fg)'; e.target.style.color = '#fff'; e.target.style.borderColor = 'var(--color-fg)'; }}
                    onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'inherit'; e.target.style.borderColor = 'var(--color-border-md)'; }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && (
            <div>
              {results.length === 0 && !loading && (
                <p style={{ textAlign: 'center', color: 'var(--color-fg-subtle)', padding: '32px 0' }}>
                  No products found for "{query}"
                </p>
              )}
              {results.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--color-fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                      Results ({results.length})
                    </p>
                    <button
                      onClick={() => { navigate(`/collections/all?search=${query}`); onClose(); }}
                      style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      View all <ArrowRight size={12} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {results.map((product) => (
                      <button
                        key={product._id}
                        onClick={() => { navigate(`/product/${product.slug}`); onClose(); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left',
                          transition: 'background var(--transition)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(3,3,2,0.04)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                      >
                        <img
                          src={product.images?.[0]}
                          alt={product.title}
                          style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '14px', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {product.title}
                          </p>
                          <p style={{ fontSize: '13px', color: 'var(--color-fg-muted)' }}>
                            {formatPrice(product.price)}
                            {product.comparePrice > product.price && (
                              <span style={{ marginLeft: '8px', textDecoration: 'line-through', color: 'var(--color-fg-subtle)', fontSize: '12px' }}>
                                {formatPrice(product.comparePrice)}
                              </span>
                            )}
                          </p>
                        </div>
                        <ArrowRight size={14} style={{ color: 'var(--color-fg-subtle)', flexShrink: 0 }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </>
  );
}
