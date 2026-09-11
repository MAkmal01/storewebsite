import { useState } from 'react';
import { X, Search, Package, ArrowRight, Loader } from 'lucide-react';
import { trackOrder } from '../api/orders.js';

const formatPrice = (p) => `Rs. ${p?.toLocaleString('en-PK')}`;

export default function TrackOrderModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    setOrder(null);
    
    try {
      const result = await trackOrder(query.trim());
      setOrder(result.order);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found. Please check your order number or email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        style={{ zIndex: 300 }}
      />
      
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`} style={{ zIndex: 301 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px' }}>
              Track Order
            </span>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: '8px' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          <p style={{ fontSize: '14px', color: 'var(--color-fg-muted)', marginBottom: '20px' }}>
            Enter your Order ID or Email address to track your shipment status.
          </p>

          <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-fg-subtle)' }} />
              <input
                type="text"
                placeholder="Order ID or Email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="btn btn-primary"
              style={{ padding: '14px', fontSize: '14px' }}
            >
              {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Track Package'}
            </button>
          </form>

          {error && (
            <div style={{ padding: '16px', background: '#fee2e2', borderRadius: 'var(--radius-md)', color: '#991b1b', fontSize: '13px', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          {order && (
            <div style={{ animation: 'fadeInUp 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px' }}>
                  Order {order.orderNumber}
                </h3>
                <span style={{ 
                  background: order.orderStatus === 'Delivered' ? '#dcfce7' : 
                             order.orderStatus === 'Shipped' ? '#dbeafe' : '#f3f4f6',
                  color: order.orderStatus === 'Delivered' ? '#166534' : 
                         order.orderStatus === 'Shipped' ? '#1e40af' : '#374151',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '11px',
                  fontWeight: 600
                }}>
                  {order.orderStatus}
                </span>
              </div>

              <div className="order-timeline" style={{ marginBottom: '24px' }}>
                <div className="order-step">
                  <div className="order-step-dot" style={{ background: '#16a34a', color: '#fff' }}>✓</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>Order Placed</p>
                    <p style={{ fontSize: '11px', color: 'var(--color-fg-subtle)' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="order-step">
                  <div className="order-step-dot" style={{ 
                    background: ['Processing', 'Shipped', 'Delivered'].includes(order.orderStatus) ? '#16a34a' : 'var(--color-border)',
                    color: ['Processing', 'Shipped', 'Delivered'].includes(order.orderStatus) ? '#fff' : 'var(--color-fg-subtle)'
                  }}>
                    {['Processing', 'Shipped', 'Delivered'].includes(order.orderStatus) ? '✓' : '2'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>Processing</p>
                    <p style={{ fontSize: '11px', color: 'var(--color-fg-subtle)' }}>Getting your order ready</p>
                  </div>
                </div>
                <div className="order-step">
                  <div className="order-step-dot" style={{ 
                    background: ['Shipped', 'Delivered'].includes(order.orderStatus) ? '#16a34a' : 'var(--color-border)',
                    color: ['Shipped', 'Delivered'].includes(order.orderStatus) ? '#fff' : 'var(--color-fg-subtle)'
                  }}>
                    {['Shipped', 'Delivered'].includes(order.orderStatus) ? '✓' : '3'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>Shipped</p>
                    {order.trackingNumber && (
                      <p style={{ fontSize: '11px', color: 'var(--color-fg-subtle)' }}>Tracking: {order.trackingNumber}</p>
                    )}
                  </div>
                </div>
                <div className="order-step">
                  <div className="order-step-dot" style={{ 
                    background: order.orderStatus === 'Delivered' ? '#16a34a' : 'var(--color-border)',
                    color: order.orderStatus === 'Delivered' ? '#fff' : 'var(--color-fg-subtle)'
                  }}>
                    {order.orderStatus === 'Delivered' ? '✓' : '4'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>Delivered</p>
                  </div>
                </div>
              </div>

              <div style={{ background: '#f9fafb', borderRadius: 'var(--radius-md)', padding: '16px', fontSize: '13px' }}>
                <p style={{ fontWeight: 600, marginBottom: '8px' }}>Order Details</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--color-fg-muted)' }}>Items</span>
                  <span>{order.items.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--color-fg-muted)' }}>Total</span>
                  <span style={{ fontWeight: 700 }}>{formatPrice(order.totalAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-fg-muted)' }}>Payment</span>
                  <span>{order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </>
  );
}
