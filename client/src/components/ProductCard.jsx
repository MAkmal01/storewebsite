import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

const formatPrice = (p) => `Rs. ${p?.toLocaleString('en-PK')}`;

function StarRating({ rating, count }) {
  return (
    <div className="stars" style={{ gap: '1px' }}>
      {[1,2,3,4,5].map((s) => (
        <Star
          key={s}
          size={11}
          fill={s <= Math.round(rating) ? '#C6A96B' : 'none'}
          stroke={s <= Math.round(rating) ? '#C6A96B' : '#c4c4c4'}
        />
      ))}
      {count !== undefined && (
        <span style={{ marginLeft: '4px', fontSize: '11px', color: 'var(--color-fg-subtle)' }}>
          ({count})
        </span>
      )}
    </div>
  );
}

export default function ProductCard({ product, onQuickView }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.variants?.sizes?.[0] || '', product.variants?.colors?.[0]?.name || '');
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const hasTwoImages = product.images?.length > 1;

  return (
    <div
      className="product-card"
      onMouseEnter={() => { setHovered(true); if (hasTwoImages) setImgIndex(1); }}
      onMouseLeave={() => { setHovered(false); setImgIndex(0); }}
    >
      {/* Image Area */}
      <Link to={`/product/${product.slug}`} style={{ display: 'block', position: 'relative' }}>
        <div
          className="img-zoom-wrap"
          style={{ aspectRatio: '3/4', background: '#f4f4f0', position: 'relative', overflow: 'hidden' }}
        >
          {product.images?.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={product.title}
              style={{
                position: i === 0 ? 'relative' : 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: imgIndex === i ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
              loading="lazy"
            />
          ))}
        </div>

        {/* Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {product.badge && (
            <span className={`badge badge-${product.badge.toLowerCase()}`}>
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="badge badge-sale">−{discount}%</span>
          )}
          {!product.inStock && (
            <span className="badge" style={{ background: '#6b7280', color: '#fff' }}>SOLD OUT</span>
          )}
        </div>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            id={`quick-view-${product._id}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(product); }}
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: `translateX(-50%) translateY(${hovered ? '0' : '10px'})`,
              background: 'rgba(255,255,255,0.95)',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '8px 16px',
              fontSize: '12px',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <Eye size={13} /> Quick View
          </button>
        )}
      </Link>

      {/* Info Area */}
      <div style={{ padding: '12px 8px 14px' }}>
        {/* Rating */}
        {product.reviewsCount > 0 && (
          <div style={{ marginBottom: '6px' }}>
            <StarRating rating={product.rating} count={product.reviewsCount} />
          </div>
        )}

        <Link to={`/product/${product.slug}`}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: '13px',
            lineHeight: 1.35,
            marginBottom: '6px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: 'var(--color-fg)',
          }}>
            {product.title}
          </h3>
        </Link>

        {/* Price Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px' }}>
            {formatPrice(product.price)}
          </span>
          {product.comparePrice > product.price && (
            <span style={{ fontSize: '12px', color: 'var(--color-fg-subtle)', textDecoration: 'line-through' }}>
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          id={`add-cart-${product._id}`}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            background: added ? '#166534' : undefined,
            borderColor: added ? '#166534' : undefined,
          }}
        >
          {!product.inStock ? (
            'Sold Out'
          ) : added ? (
            '✓ Added to Cart'
          ) : (
            <><ShoppingBag size={13} /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}
