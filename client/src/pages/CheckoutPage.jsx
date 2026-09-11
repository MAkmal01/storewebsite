import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShoppingBag, CheckCircle, MapPin, Loader, Tag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { createOrder } from '../api/orders.js';

const formatPrice = (p) => `Rs. ${p?.toLocaleString('en-PK')}`;

const PROVINCES = ['Sindh', 'Punjab', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'AJ&K', 'ICT (Islamabad)'];
const CITIES_BY_PROVINCE = {
  Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana'],
  Punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot'],
  'Khyber Pakhtunkhwa': ['Peshawar', 'Abbottabad', 'Swat', 'Mardan'],
  Balochistan: ['Quetta', 'Gwadar'],
  'Gilgit-Baltistan': ['Gilgit', 'Skardu'],
  'AJ&K': ['Muzaffarabad', 'Mirpur'],
  'ICT (Islamabad)': ['Islamabad'],
};

const STEPS = ['Cart Review', 'Shipping Details', 'Confirm & Place Order'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    shippingFee,
    discount,
    total,
    appliedCoupon,
    couponCode,
    setCouponCode,
    applyCoupon,
    clearCart,
  } = useCart();

  const [step, setStep] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    province: '',
    city: '',
    postalCode: '',
    notes: '',
    paymentMethod: 'COD',
  });

  const cities = form.province ? (CITIES_BY_PROVINCE[form.province] || []) : [];

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const payload = {
        customer: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
        },
        shippingAddress: {
          street: form.street,
          apartment: form.apartment,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
        },
        items: items.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          image: item.image,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        })),
        paymentMethod: form.paymentMethod,
        discountCode: appliedCoupon?.code || '',
        notes: form.notes,
      };

      const result = await createOrder(payload);
      setOrder(result.order);
      clearCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && !order) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px' }}>
        <ShoppingBag size={48} style={{ color: 'var(--color-fg-subtle)', marginBottom: '16px' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, marginBottom: '10px' }}>Your cart is empty</h2>
        <button onClick={() => navigate('/collections/all')} className="btn btn-primary">Browse Products</button>
      </div>
    );
  }

  // Order success screen
  if (order) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={36} style={{ color: '#16a34a' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 800, marginBottom: '10px', color: 'var(--color-fg)' }}>
            Order Placed! 🎉
          </h1>
          <p style={{ color: 'var(--color-fg-muted)', fontSize: '15px', marginBottom: '28px', lineHeight: 1.7 }}>
            Thank you, <strong>{order.customer?.fullName}</strong>! Your order has been confirmed and will be delivered within 2–5 business days.
          </p>

          <div style={{ background: '#f9f5ef', border: '1.5px dashed #c5a46a', borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', color: 'var(--color-fg-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Order ID</p>
            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '24px', letterSpacing: '0.04em', color: 'var(--color-fg)' }}>
              {order.orderNumber}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--color-fg-muted)', marginTop: '6px' }}>
              Save this number to track your order
            </p>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: '28px', textAlign: 'left' }}>
            {[
              ['Payment', order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod],
              ['Status', order.orderStatus],
              ['Total Paid', formatPrice(order.totalAmount)],
              ['Shipping To', `${order.shippingAddress?.city}, ${order.shippingAddress?.province}`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border)', fontSize: '14px', lastChild: { border: 'none' } }}>
                <span style={{ color: 'var(--color-fg-muted)' }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/')} className="btn btn-secondary">Back to Home</button>
            <button onClick={() => navigate('/collections/all')} className="btn btn-primary">
              Continue Shopping <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', background: '#fafaf8' }}>
      {/* Page Header */}
      <div style={{ background: '#030302', padding: '32px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '28px', color: '#fff' }}>Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="container" style={{ padding: '24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
          {STEPS.map((s, i) => {
            const n = i + 1;
            const active = step === n;
            const done = step > n;
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '13px',
                    background: done ? '#16a34a' : active ? 'var(--color-fg)' : 'var(--color-border)',
                    color: done || active ? '#fff' : 'var(--color-fg-subtle)',
                    transition: 'all 0.3s ease',
                  }}>
                    {done ? '✓' : n}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: active ? 'var(--color-fg)' : 'var(--color-fg-subtle)', whiteSpace: 'nowrap' }}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: '2px', background: step > n ? '#16a34a' : 'var(--color-border)', margin: '0 8px', marginBottom: '18px', transition: 'background 0.3s ease' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <div className="container" style={{ padding: '0 24px 80px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start', maxWidth: '1100px' }}>
        {/* Left: Steps */}
        <div>
          {/* Step 1: Cart Review */}
          {step === 1 && (
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '28px', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '18px', marginBottom: '20px' }}>Review Your Items</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {items.map((item) => (
                  <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}`} style={{ display: 'flex', gap: '14px', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <img src={item.image} alt={item.title} style={{ width: '60px', height: '68px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{item.title}</p>
                      <p style={{ fontSize: '11px', color: 'var(--color-fg-subtle)', marginBottom: '6px' }}>
                        {item.selectedSize && `Size: ${item.selectedSize}`}{item.selectedSize && item.selectedColor && ' · '}{item.selectedColor && `Color: ${item.selectedColor}`}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--color-fg-muted)' }}>Qty: {item.quantity}</span>
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px' }}>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <form onSubmit={(e) => { e.preventDefault(); applyCoupon(couponCode); }} style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Tag size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-fg-subtle)' }} />
                  <input
                    id="checkout-coupon-input"
                    type="text"
                    placeholder="Coupon code (e.g. DN10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="form-input"
                    style={{ paddingLeft: '34px', fontSize: '13px', padding: '10px 12px 10px 34px' }}
                  />
                </div>
                <button type="submit" className="btn btn-secondary" style={{ padding: '10px 16px', fontSize: '13px' }}>Apply</button>
              </form>
              {appliedCoupon && (
                <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--color-success)', fontWeight: 600 }}>
                  ✓ {appliedCoupon.label} applied!
                </p>
              )}

              <button id="proceed-to-shipping-btn" onClick={() => setStep(2)} className="btn btn-primary" style={{ width: '100%', marginTop: '24px', padding: '16px', fontSize: '15px' }}>
                Proceed to Shipping <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Step 2: Shipping Info */}
          {step === 2 && (
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '28px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} /> Shipping Details
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input id="checkout-fullname" className="form-input" required value={form.fullName} onChange={(e) => updateForm('fullName', e.target.value)} placeholder="Muhammad Ali" />
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input id="checkout-phone" className="form-input" required value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} placeholder="03XX-XXXXXXX" type="tel" />
                  </div>
                </div>

                <div>
                  <label className="form-label">Email Address *</label>
                  <input id="checkout-email" className="form-input" required value={form.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="you@example.com" type="email" />
                </div>

                <div>
                  <label className="form-label">Street Address *</label>
                  <input id="checkout-street" className="form-input" required value={form.street} onChange={(e) => updateForm('street', e.target.value)} placeholder="House No., Street, Area" />
                </div>

                <div>
                  <label className="form-label">Apartment / Floor (Optional)</label>
                  <input id="checkout-apt" className="form-input" value={form.apartment} onChange={(e) => updateForm('apartment', e.target.value)} placeholder="Flat 3B, Floor 2 (optional)" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label">Province *</label>
                    <select
                      id="checkout-province"
                      className="form-input"
                      required
                      value={form.province}
                      onChange={(e) => { updateForm('province', e.target.value); updateForm('city', ''); }}
                      style={{ appearance: 'none' }}
                    >
                      <option value="">Select Province</option>
                      {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">City *</label>
                    <select
                      id="checkout-city"
                      className="form-input"
                      required
                      value={form.city}
                      onChange={(e) => updateForm('city', e.target.value)}
                      disabled={!form.province}
                      style={{ appearance: 'none' }}
                    >
                      <option value="">Select City</option>
                      {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Payment Method *</label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {[
                      { value: 'COD', label: '💵 Cash on Delivery' },
                      { value: 'BANK_TRANSFER', label: '💳 Full Payment (Advance)' },
                    ].map((pm) => (
                      <label key={pm.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 16px', border: `2px solid ${form.paymentMethod === pm.value ? 'var(--color-fg)' : 'var(--color-border-md)'}`, borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 500, flex: '1 0 auto', background: form.paymentMethod === pm.value ? 'rgba(3,3,2,0.04)' : '#fff', transition: 'all var(--transition)' }}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={pm.value}
                          checked={form.paymentMethod === pm.value}
                          onChange={(e) => updateForm('paymentMethod', e.target.value)}
                          style={{ accentColor: 'var(--color-fg)' }}
                        />
                        {pm.label}
                      </label>
                    ))}
                  </div>

                  {form.paymentMethod === 'COD' && (
                    <div style={{ marginTop: '12px', padding: '16px', background: '#f9fafb', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '14px', color: 'var(--color-fg)', lineHeight: '1.6' }}>
                      <p style={{ marginBottom: '12px', color: 'var(--color-fg-muted)', fontSize: '13px' }}>
                        TO confirm your order send 300DC in advance , remaining amount will be paid when order is delievered to your doorstep
                      </p>
                      <p><strong>Bank:</strong> Askari Bank</p>
                      <p><strong>Account Title:</strong> Muhammad Akmal</p>
                      <p><strong>Account No:</strong> 07690200021840</p>
                      <p><strong>IBAN No:</strong> PK77ASCM0007690200021840</p>
                      <p style={{ marginTop: '8px' }}>
                        <strong>Important:</strong> after making payment, it is mandatory to send payment screenshot on whatsapp at: <strong>03400104206</strong><br/>
                        your order will be confirmed after payment verification
                      </p>
                    </div>
                  )}
                  {form.paymentMethod === 'BANK_TRANSFER' && (
                    <div style={{ marginTop: '12px', padding: '16px', background: '#f9fafb', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '14px', color: 'var(--color-fg)', lineHeight: '1.6' }}>
                      <p><strong>Bank:</strong> Askari Bank</p>
                      <p><strong>Account Title:</strong> Muhammad Akmal</p>
                      <p><strong>Account No:</strong> 07690200021840</p>
                      <p><strong>IBAN No:</strong> PK77ASCM0007690200021840</p>
                      <p style={{ marginTop: '8px' }}>
                        <strong>Important:</strong> after making payment, it is mandatory to send payment screenshot on whatsapp at: <strong>03400104206</strong><br/>
                        your order will be confirmed after payment verification
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="form-label">Order Notes (Optional)</label>
                  <textarea className="form-input" value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} placeholder="Special instructions for your order or delivery…" rows={3} style={{ resize: 'vertical' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button onClick={() => setStep(1)} className="btn btn-secondary" style={{ padding: '14px 20px' }}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  id="proceed-to-confirm-btn"
                  onClick={() => {
                    if (!form.fullName || !form.phone || !form.email || !form.street || !form.city || !form.province) {
                      alert('Please fill in all required fields.');
                      return;
                    }
                    setStep(3);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '14px', fontSize: '15px' }}
                >
                  Review & Confirm <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '28px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '18px', marginBottom: '24px' }}>Confirm Your Order</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#f9fafb', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', color: 'var(--color-fg-muted)' }}>Delivery Address</p>
                  <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '4px' }}>{form.fullName}</p>
                  <p style={{ fontSize: '14px', color: 'var(--color-fg-muted)' }}>{form.phone} · {form.email}</p>
                  <p style={{ fontSize: '14px', color: 'var(--color-fg-muted)', marginTop: '6px' }}>
                    {form.street}{form.apartment && `, ${form.apartment}`},{' '}
                    {form.city}, {form.province}
                  </p>
                </div>

                <div style={{ background: '#f9fafb', borderRadius: 'var(--radius-md)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Truck size={18} style={{ color: 'var(--color-accent)' }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>
                      {form.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Full Payment (Advance)'}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--color-fg-muted)' }}>Estimated delivery: 2–5 business days</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setStep(2)} className="btn btn-secondary" style={{ padding: '14px 20px' }}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  id="place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '16px', fontSize: '16px', fontWeight: 700, background: placing ? '#374151' : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {placing ? (
                    <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Placing Order…</>
                  ) : (
                    <><CheckCircle size={16} /> Place Order ({formatPrice(total)})</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
              Order Summary
            </h3>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {items.map((item) => (
                <div key={`${item._id}-${item.selectedSize}`} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={item.image} alt={item.title} style={{ width: '44px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--color-fg)', color: '#fff', fontSize: '9px', fontWeight: 700, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.quantity}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                    {item.selectedSize && <p style={{ fontSize: '10px', color: 'var(--color-fg-subtle)' }}>Size: {item.selectedSize}</p>}
                  </div>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="divider" style={{ marginBottom: '12px' }} />

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--color-fg-muted)' }}>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-success)' }}>
                  <span>Discount</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--color-fg-muted)' }}>Shipping</span>
                <span style={{ color: shippingFee === 0 ? 'var(--color-success)' : 'inherit' }}>
                  {shippingFee === 0 ? 'FREE 🎉' : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px' }}>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--color-fg-subtle)' }}>
                Inclusive of all taxes · COD accepted
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
