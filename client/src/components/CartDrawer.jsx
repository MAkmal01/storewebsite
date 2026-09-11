import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

const formatPrice = (p) => `Rs. ${p?.toLocaleString('en-PK')}`;

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    totalItems,
    subtotal,
    shippingFee,
    discount,
    total,
    freeShippingProgress,
    amountToFreeShipping,
    updateQuantity,
    removeItem,
    couponCode,
    setCouponCode,
    appliedCoupon,
    applyCoupon,
    FREE_SHIPPING_THRESHOLD,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${isCartOpen ? 'open' : ''}`}
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Cart Panel */}
      <aside
        id="cart-drawer"
        className={`cart-drawer ${isCartOpen ? 'open' : ''}`}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px' }}>
              Your Cart
            </span>
            {totalItems > 0 && (
              <span style={{
                background: 'var(--color-fg)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
              }}>
                {totalItems}
              </span>
            )}
          </div>
          <button
            id="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            style={{ padding: '6px', borderRadius: '8px' }}
            className="btn-ghost"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {subtotal > 0 && (
          <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <p style={{ fontSize: '12px', fontWeight: 500 }}>
                {amountToFreeShipping === 0 ? (
                  <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>🎉 You've unlocked FREE Delivery!</span>
                ) : (
                  <>
                    Add <strong>{formatPrice(amountToFreeShipping)}</strong> more for free delivery
                  </>
                )}
              </p>
              <span style={{ fontSize: '11px', color: 'var(--color-fg-subtle)' }}>
                {Math.round(freeShippingProgress)}%
              </span>
            </div>
            <div className="shipping-progress-track">
              <div
                className="shipping-progress-fill"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: '16px' }}>
            <div style={{ width: '72px', height: '72px', background: 'rgba(3,3,2,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={30} style={{ color: 'var(--color-fg-subtle)' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '18px', marginBottom: '6px' }}>Your cart is empty</p>
              <p style={{ color: 'var(--color-fg-muted)', fontSize: '14px' }}>Explore the latest Royal Choice drops</p>
            </div>
            <button
              onClick={() => { setIsCartOpen(false); navigate('/collections/all'); }}
              className="btn btn-primary"
              id="cart-shop-btn"
            >
              Shop Now <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Cart Items */}
        {items.length > 0 && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item) => (
                <div
                  key={`${item._id}-${item.selectedSize}-${item.selectedColor}`}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '14px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    background: '#fafafa',
                  }}
                >
                  {/* Product Image */}
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={() => setIsCartOpen(false)}
                    style={{ flexShrink: 0 }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '72px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                  </Link>

                  {/* Item Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={() => setIsCartOpen(false)}
                    >
                      <p style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 600,
                        fontSize: '13px',
                        lineHeight: 1.3,
                        marginBottom: '4px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {item.title}
                      </p>
                    </Link>

                    {(item.selectedSize || item.selectedColor) && (
                      <p style={{ fontSize: '11px', color: 'var(--color-fg-subtle)', marginBottom: '8px' }}>
                        {item.selectedSize && `Size: ${item.selectedSize}`}
                        {item.selectedSize && item.selectedColor && ' · '}
                        {item.selectedColor && `Color: ${item.selectedColor}`}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      {/* Quantity */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor, -1)}
                          className="qty-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor, 1)}
                          className="qty-btn"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price & Remove */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px' }}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item._id, item.selectedSize, item.selectedColor)}
                          aria-label="Remove item"
                          style={{ padding: '4px', color: 'var(--color-fg-subtle)', transition: 'color var(--transition)' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-fg-subtle)')}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code */}
            <form onSubmit={handleCouponSubmit} style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Tag size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-fg-subtle)' }} />
                  <input
                    id="coupon-input"
                    type="text"
                    placeholder="Coupon code (e.g. DN10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="form-input"
                    style={{ paddingLeft: '36px', fontSize: '13px', padding: '10px 12px 10px 34px' }}
                  />
                </div>
                <button type="submit" className="btn btn-secondary" style={{ padding: '10px 16px', fontSize: '13px' }}>
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--color-success)', fontWeight: 600 }}>
                  ✓ {appliedCoupon.label} applied!
                </p>
              )}
            </form>
          </div>
        )}

        {/* Footer Summary */}
        {items.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--color-border)',
            flexShrink: 0,
            background: '#fafafa',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--color-fg-muted)' }}>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-success)' }}>
                  <span>Discount</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--color-fg-muted)' }}>Shipping</span>
                <span style={{ color: shippingFee === 0 ? 'var(--color-success)' : 'inherit' }}>
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>
              <div style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px' }}>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--color-fg-subtle)', marginTop: '2px' }}>
                Cash on Delivery (COD) · Inclusive of all taxes
              </p>
            </div>

            <button
              id="checkout-btn"
              className="btn btn-primary"
              onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
              style={{ width: '100%', padding: '16px', fontSize: '15px', fontWeight: 600, letterSpacing: '0.04em' }}
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>

            <button
              onClick={() => setIsCartOpen(false)}
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: '8px', fontSize: '13px', color: 'var(--color-fg-muted)' }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
