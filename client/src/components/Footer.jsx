import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail, Heart } from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Shop All', path: '/collections/all' },
  { label: 'New Arrivals', path: '/collections/new' },
  { label: 'Watches', path: '/collections/watches' },
  { label: 'Wallets', path: '/collections/wallets' },
  { label: 'Perfumes', path: '/collections/perfumes' },
  { label: 'Jewellery', path: '/collections/jewellery' },
  { label: 'Gift Items', path: '/collections/gifts' },
  { label: 'Mobile Acc.', path: '/collections/mobile-accessories' },
];

const HELP_LINKS = [
  { label: 'Track My Order', path: '#' },
  { label: 'Shipping & Delivery', path: '#' },
  { label: '7-Day Exchange Policy', path: '#' },
  { label: 'Cash on Delivery (COD)', path: '#' },
  { label: 'Size Guide', path: '#' },
  { label: 'Contact Us', path: '#' },
  { label: 'Privacy Policy', path: '#' },
  { label: 'Terms of Service', path: '#' },
];

const SOCIAL = [
  { icon: <Instagram size={18} />, label: 'Instagram', href: 'https://instagram.com/royalchoice.pk' },
  { icon: <Facebook size={18} />, label: 'Facebook', href: 'https://facebook.com/royalchoice.pk' },
  { icon: <Youtube size={18} />, label: 'YouTube', href: '#' },
  { icon: <Twitter size={18} />, label: 'TikTok', href: '#' },
];

const PAYMENT_METHODS = ['COD', 'Bank Transfer'];

export default function Footer() {
  const year = new Date().getFullYear();

  const linkStyle = {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.65)',
    display: 'block',
    padding: '4px 0',
    transition: 'color var(--transition)',
    textDecoration: 'none',
  };

  const hoverLink = (e) => (e.target.style.color = '#fff');
  const blurLink = (e) => (e.target.style.color = 'rgba(255,255,255,0.65)');

  return (
    <footer className="footer">
      {/* Main Footer Grid */}
      <div className="container" style={{ padding: '64px 24px 48px' }}>
        <div
          id="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr 1fr 1fr',
            gap: '40px',
          }}
        >
          {/* Brand Column */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '24px', color: '#fff', letterSpacing: '-0.02em', marginBottom: '2px' }}>
                ROYAL CHOICE
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                THE MARK OF ROYALTY
              </p>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '24px', maxWidth: '260px' }}>
              Pakistan's premier destination for luxury watches, fine jewellery, premium wallets, and exclusive gift items. Nationwide Cash on Delivery.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    color: 'rgba(255,255,255,0.7)',
                    transition: 'all var(--transition)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { icon: <MapPin size={13} />, text: 'Karachi, Lahore, Islamabad, Pakistan' },
                { icon: <Phone size={13} />, text: '03400104206' },
                { icon: <Mail size={13} />, text: 'babuajmal55@gmail.com' },
              ].map((c) => (
                <div key={c.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                  <span style={{ marginTop: '1px', flexShrink: 0 }}>{c.icon}</span>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shop */}
          <div>
            <p className="footer-title">Quick Shop</p>
            <nav>
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  style={linkStyle}
                  onMouseEnter={hoverLink}
                  onMouseLeave={blurLink}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Help & Support */}
          <div>
            <p className="footer-title">Help & Support</p>
            <nav>
              {HELP_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  style={linkStyle}
                  onMouseEnter={hoverLink}
                  onMouseLeave={blurLink}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Payment & Trust */}
          <div>
            <p className="footer-title">We Accept</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>
                    {method === 'COD' ? '💵' : method === 'EasyPaisa' ? '📱' : method === 'JazzCash' ? '📲' : '🏦'}
                  </span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
                    {method}
                  </span>
                </div>
              ))}
            </div>

            <p className="footer-title" style={{ marginTop: '20px' }}>Our Guarantee</p>
            {['100% Authentic Products', '7-Day Exchange Policy', 'Secure Cash on Delivery', '2–5 Day Delivery'].map((g) => (
              <div key={g} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ color: '#c5a46a', fontSize: '12px' }}>✓</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>{g}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              © {year} Royal Choice. All rights reserved.
            </p>
            <Link 
              to="/admin" 
              style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.target.style.color = '#E4C783')}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.35)')}
            >
              Admin Portal
            </Link>
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Made with <Heart size={11} fill="#c5a46a" stroke="none" /> in Pakistan
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 540px) {
          #footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
