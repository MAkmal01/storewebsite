import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { subscribeNewsletter } from '../api/orders.js';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await subscribeNewsletter(email);
      setStatus('success');
      setMessage(res.message);
      setDiscountCode(res.discountCode || 'DN10');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="newsletter"
      style={{
        background: '#f9f5ef',
        padding: '72px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '540px', margin: '0 auto' }}>
        <span style={{
          display: 'inline-block',
          background: 'var(--color-fg)',
          color: '#fff',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          padding: '5px 14px',
          borderRadius: 'var(--radius-pill)',
          marginBottom: '20px',
        }}>
          VIP Access
        </span>

        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          fontWeight: 800,
          marginBottom: '12px',
          lineHeight: 1.15,
        }}>
          Join the Royal Choice<br />Inner Circle
        </h2>

        <p style={{
          color: 'var(--color-fg-muted)',
          fontSize: '15px',
          lineHeight: 1.7,
          marginBottom: '32px',
        }}>
          Subscribe for exclusive drops, limited edition releases, and receive{' '}
          <strong style={{ color: 'var(--color-fg)' }}>10% OFF</strong> your very first order.
        </p>

        {status === 'success' ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            padding: '32px 24px',
            background: '#fff',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid #dcfce7',
          }}>
            <CheckCircle size={40} style={{ color: '#16a34a' }} />
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '18px', marginBottom: '6px' }}>
                You're in! 🎉
              </p>
              <p style={{ color: 'var(--color-fg-muted)', fontSize: '14px', marginBottom: '12px' }}>
                {message}
              </p>
              {discountCode && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#f0fdf4',
                  border: '1.5px dashed #16a34a',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 20px',
                }}>
                  <span style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>Your code:</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px', letterSpacing: '0.08em', color: '#16a34a' }}>
                    {discountCode}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '420px', margin: '0 auto' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-fg-subtle)' }} />
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="form-input"
                style={{ paddingLeft: '40px', borderRadius: 'var(--radius-pill)' }}
              />
            </div>
            <button
              type="submit"
              id="newsletter-submit-btn"
              disabled={loading}
              className="btn btn-primary"
              style={{ borderRadius: 'var(--radius-pill)', padding: '12px 20px', flexShrink: 0 }}
            >
              {loading ? '…' : <ArrowRight size={18} />}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p style={{ marginTop: '12px', color: '#dc2626', fontSize: '13px' }}>{message}</p>
        )}

        <p style={{ marginTop: '16px', fontSize: '11px', color: 'var(--color-fg-subtle)' }}>
          No spam ever. Unsubscribe anytime. 🔒
        </p>
      </div>
    </section>
  );
}
