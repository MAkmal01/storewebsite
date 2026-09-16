import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, ChevronLeft, ChevronRight, Star, ChevronDown, ChevronUp, Loader, Check } from 'lucide-react';
import { getProductBySlug, getProducts } from '../api/products.js';
import { getProductReviews, createReview } from '../api/orders.js';
import { useCart } from '../context/CartContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

const formatPrice = (p) => `Rs. ${p?.toLocaleString('en-PK')}`;

function StarRating({ rating, interactive = false, onRate }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={interactive ? 22 : 14}
          fill={s <= (interactive ? (hovered || rating) : Math.round(rating)) ? '#C6A96B' : 'none'}
          stroke={s <= (interactive ? (hovered || rating) : Math.round(rating)) ? '#C6A96B' : '#d1d1d1'}
          style={{ cursor: interactive ? 'pointer' : 'default', transition: 'all 0.1s' }}
          onMouseEnter={() => interactive && setHovered(s)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate && onRate(s)}
        />
      ))}
    </div>
  );
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="accordion-btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <div className={`accordion-body ${open ? 'open' : ''}`}>
        <div style={{ padding: '0 0 16px', color: 'var(--color-fg-muted)', fontSize: '14px', lineHeight: 1.7 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({ onQuickView }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewMeta, setReviewMeta] = useState({ totalReviews: 0, avgRating: 5 });
  const [reviewForm, setReviewForm] = useState({ authorName: '', rating: 5, title: '', content: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    setSelectedSize('');
    setSelectedColor('');
    setQty(1);
    setAdded(false);

    getProductBySlug(slug)
      .then(({ product: p, relatedProducts }) => {
        setProduct(p);
        setRelated(relatedProducts || []);
        if (p.variants?.sizes?.length) setSelectedSize(p.variants.sizes[0]);
        if (p.variants?.colors?.length) setSelectedColor(p.variants.colors[0].name);
        // Fetch reviews
        return getProductReviews(p._id);
      })
      .then((data) => {
        setReviews(data.reviews || []);
        setReviewMeta({ totalReviews: data.totalReviews, avgRating: data.avgRating });
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, selectedSize, selectedColor, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!product || !reviewForm.content || !reviewForm.authorName) return;
    setReviewLoading(true);
    try {
      await createReview({ productId: product._id, ...reviewForm });
      setReviewSuccess(true);
      setReviewForm({ authorName: '', rating: 5, title: '', content: '' });
      const data = await getProductReviews(product._id);
      setReviews(data.reviews || []);
      setReviewMeta({ totalReviews: data.totalReviews, avgRating: data.avgRating });
    } catch {}
    setReviewLoading(false);
  };

  const discount = product?.comparePrice > product?.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '120px 0' }}>
        <Loader size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-fg-subtle)' }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px' }}>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Product not found</p>
        <button onClick={() => navigate('/collections/all')} className="btn btn-primary">Back to Shop</button>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container" style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--color-fg-subtle)', display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit' }}>Home</button>
        <span>/</span>
        <button onClick={() => navigate(`/collections/${product.category}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit', textTransform: 'capitalize' }}>{product.category}</button>
        <span>/</span>
        <span style={{ color: 'var(--color-fg)', fontWeight: 500 }}>{product.title}</span>
      </div>

      {/* Main Product Layout */}
      <div id="product-detail-layout" className="container" style={{ padding: '8px 24px 64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
        {/* Left: Image Gallery */}
        <div id="product-gallery">
          {/* Main Image */}
          <div style={{ position: 'relative', background: '#f4f4f0', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '12px', aspectRatio: '4/5' }}>
            <img
              src={product.images[activeImg]}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }}
            />
            {product.badge && (
              <span className={`badge badge-${product.badge.toLowerCase()}`} style={{ position: 'absolute', top: '16px', left: '16px' }}>
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="badge badge-sale" style={{ position: 'absolute', top: product.badge ? '42px' : '16px', left: '16px' }}>
                −{discount}%
              </span>
            )}
            {/* Arrow navigation */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg((prev) => (prev - 1 + product.images.length) % product.images.length)}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveImg((prev) => (prev + 1) % product.images.length)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  id={`thumb-${i}`}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: '72px',
                    height: '80px',
                    border: `2px solid ${activeImg === i ? 'var(--color-fg)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    padding: 0,
                    cursor: 'pointer',
                    background: 'none',
                    transition: 'border-color var(--transition)',
                    flexShrink: 0,
                  }}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div id="product-info">
          {/* Category */}
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '10px' }}>
            {product.category}
          </p>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '12px' }}>
            {product.title}
          </h1>

          {/* Rating */}
          {reviewMeta.totalReviews > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <StarRating rating={reviewMeta.avgRating} />
              <span style={{ fontSize: '13px', color: 'var(--color-fg-muted)', fontWeight: 500 }}>
                {reviewMeta.avgRating} ({reviewMeta.totalReviews} review{reviewMeta.totalReviews !== 1 ? 's' : ''})
              </span>
            </div>
          )}

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 800 }}>
              {formatPrice(product.price)}
            </span>
            {product.comparePrice > product.price && (
              <>
                <span style={{ fontSize: '18px', color: 'var(--color-fg-subtle)', textDecoration: 'line-through' }}>
                  {formatPrice(product.comparePrice)}
                </span>
                <span className="badge badge-sale" style={{ fontSize: '12px' }}>
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p style={{ color: 'var(--color-fg-muted)', fontSize: '14px', lineHeight: 1.8, marginBottom: '28px' }}>
            {product.description}
          </p>

          <div className="divider" style={{ marginBottom: '24px' }} />

          {/* Color Selector */}
          {product.variants?.colors?.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                Color: <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{selectedColor}</span>
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.variants.colors.map((color) => (
                  <button
                    key={color.name}
                    id={`color-${color.name.replace(/\s/g,'-')}`}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                    className={`color-swatch ${selectedColor === color.name ? 'selected' : ''}`}
                    style={{ background: color.hex }}
                    aria-label={`Color: ${color.name}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.variants?.sizes?.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Size: <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{selectedSize}</span>
                </p>
                <button style={{ fontSize: '11px', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Size Guide
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.variants.sizes.map((size) => (
                  <button
                    key={size}
                    id={`size-${size}`}
                    onClick={() => setSelectedSize(size)}
                    className={`variant-pill ${selectedSize === size ? 'selected' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1.5px solid var(--color-border-md)', borderRadius: 'var(--radius-md)', padding: '8px 12px' }}>
              <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px', minWidth: '24px', textAlign: 'center' }}>{qty}</span>
              <button className="qty-btn" onClick={() => setQty(qty + 1)} aria-label="Increase">+</button>
            </div>

            <button
              id="add-to-cart-main"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="btn btn-primary"
              style={{
                flex: 1,
                fontSize: '15px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                padding: '16px 24px',
                background: added ? '#166534' : undefined,
                borderColor: added ? '#166534' : undefined,
                minWidth: '200px',
              }}
            >
              {!product.inStock ? (
                'Sold Out'
              ) : added ? (
                <><Check size={16} /> Added to Cart!</>
              ) : (
                <><ShoppingBag size={16} /> Add to Cart</>
              )}
            </button>
          </div>

          {/* Stock Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: product.inStock ? '#3ED660' : '#C8C8C8', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: 'var(--color-fg-muted)', fontWeight: 500 }}>
              {!product.inStock ? 'Sold Out' : product.stockQuantity <= 5 ? `Only ${product.stockQuantity} left in stock!` : 'In Stock — Ready to Ship'}
            </span>
          </div>

          {/* COD Notice */}
          <div style={{ background: '#f9f5ef', border: '1px solid rgba(197,164,106,0.3)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: '28px' }}>
            <p style={{ fontSize: '13px', color: 'var(--color-fg)', lineHeight: 1.6 }}>
              💵 <strong>Cash on Delivery (COD)</strong> available across all Pakistan. Pay at your doorstep. Delivery in 2–5 business days.
            </p>
          </div>

          {/* Accordions */}
          <Accordion title="Product Details">
            {Array.isArray(product.details) && product.details.length > 0 ? (
              <ul style={{ paddingLeft: '16px' }}>
                {product.details.map((d, i) => <li key={i} style={{ marginBottom: '4px' }}>{d}</li>)}
              </ul>
            ) : typeof product.details === 'string' && product.details.trim() ? (
              <p style={{ whiteSpace: 'pre-line' }}>{product.details}</p>
            ) : <p>No additional details available.</p>}
          </Accordion>

          <Accordion title="Care Instructions">
            {Array.isArray(product.careInstructions) && product.careInstructions.length > 0 ? (
              <ul style={{ paddingLeft: '16px' }}>
                {product.careInstructions.map((c, i) => <li key={i} style={{ marginBottom: '4px' }}>{c}</li>)}
              </ul>
            ) : typeof product.careInstructions === 'string' && product.careInstructions.trim() ? (
              <p style={{ whiteSpace: 'pre-line' }}>{product.careInstructions}</p>
            ) : <p>Please follow standard garment care instructions.</p>}
          </Accordion>

          <Accordion title="Shipping & Returns">
            <p style={{ marginBottom: '8px' }}>🚚 Standard shipping fee of <strong>Rs. 300</strong> on all orders.</p>
            <p style={{ marginBottom: '8px' }}>📦 Delivery within <strong>2–5 business days</strong> across Pakistan.</p>
            <p>🔄 <strong>7-Day Easy Exchange</strong> on all products (subject to availability & unworn condition).</p>
          </Accordion>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ background: '#fafaf8', padding: '64px 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{ padding: '0 24px', maxWidth: '900px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, marginBottom: '4px' }}>Customer Reviews</h2>
              {reviewMeta.totalReviews > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <StarRating rating={reviewMeta.avgRating} />
                  <span style={{ fontSize: '14px', color: 'var(--color-fg-muted)', fontWeight: 500 }}>
                    {reviewMeta.avgRating} out of 5 · {reviewMeta.totalReviews} review{reviewMeta.totalReviews !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Review List */}
          {reviews.length === 0 ? (
            <p style={{ color: 'var(--color-fg-muted)', marginBottom: '32px' }}>Be the first to write a review!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
              {reviews.map((review) => (
                <div key={review._id} style={{ background: '#fff', padding: '20px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{review.authorName}</p>
                      <StarRating rating={review.rating} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                      {review.verifiedBuyer && (
                        <span style={{ fontSize: '11px', color: '#166534', fontWeight: 600, background: '#dcfce7', padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
                          ✓ Verified Buyer
                        </span>
                      )}
                      <span style={{ fontSize: '11px', color: 'var(--color-fg-subtle)' }}>
                        {new Date(review.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  {review.title && (
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '14px', marginBottom: '6px', marginTop: '10px' }}>
                      {review.title}
                    </p>
                  )}
                  <p style={{ fontSize: '14px', color: 'var(--color-fg-muted)', lineHeight: 1.7 }}>{review.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Review Form */}
          <div style={{ background: '#fff', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Write a Review</h3>
            {reviewSuccess ? (
              <p style={{ color: '#166534', fontWeight: 600, padding: '16px', background: '#dcfce7', borderRadius: 'var(--radius-md)' }}>
                ✓ Thank you! Your review has been submitted.
              </p>
            ) : (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div id="review-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label">Your Name *</label>
                    <input className="form-input" required value={reviewForm.authorName} onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })} placeholder="Ahmed Khan" />
                  </div>
                  <div>
                    <label className="form-label">Rating *</label>
                    <StarRating rating={reviewForm.rating} interactive onRate={(r) => setReviewForm({ ...reviewForm, rating: r })} />
                  </div>
                </div>
                <div>
                  <label className="form-label">Review Title</label>
                  <input className="form-input" value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} placeholder="Give your review a title" />
                </div>
                <div>
                  <label className="form-label">Your Review *</label>
                  <textarea
                    className="form-input"
                    required
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    style={{ resize: 'vertical', minHeight: '100px' }}
                  />
                </div>
                <button id="submit-review-btn" type="submit" disabled={reviewLoading} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                  {reviewLoading ? 'Submitting…' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section style={{ padding: '64px 0' }}>
          <div className="container" style={{ padding: '0 24px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, marginBottom: '28px', textAlign: 'center' }}>
              You May Also Like
            </h2>
            <div className="product-grid">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} onQuickView={onQuickView} />
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          #product-detail-layout { grid-template-columns: 1fr !important; gap: 32px !important; }
          #review-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
