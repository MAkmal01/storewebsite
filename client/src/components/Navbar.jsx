import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, User, Package } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

const NAV_LINKS = [
  { label: 'New Arrivals', path: '/collections/new' },
  { label: 'Watches', path: '/collections/watches' },
  { label: 'Wallets', path: '/collections/wallets' },
  { label: 'Perfumes', path: '/collections/perfumes' },
  { label: 'Jewellery', path: '/collections/jewellery' },
  { label: 'Gift Items', path: '/collections/gifts' },
  { label: 'Mobile Acc.', path: '/collections/mobile-accessories' },
];

export default function Navbar({ onSearchOpen, onTrackOrderOpen }) {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#fff',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'box-shadow 0.2s ease',
      }}
    >
      {/* Main Header Row */}
      <div
        className="container"
        style={{
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Mobile Menu Toggle */}
        <button
          id="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: 'none',
            padding: '8px',
            borderRadius: '8px',
          }}
          className="btn-ghost"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo and Photo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to="/"
            id="site-logo"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              lineHeight: 1,
              flex: '0 0 auto',
            }}
          >
            <>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '24px',
                  letterSpacing: '-0.03em',
                  color: 'var(--color-fg)',
                }}
              >
                ROYAL CHOICE
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '8px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-fg-subtle)',
                  fontWeight: 500,
                }}
              >
                THE MARK OF ROYALTY
              </span>
            </>
          </Link>
          <img 
            className="store-photo"
            src="/images/photo.jfif" 
            alt="Store Photo" 
            style={{ 
              height: '36px', 
              width: 'auto', 
              objectFit: 'contain',
              borderRadius: '4px'
            }} 
          />
        </div>

        {/* Desktop Nav Links */}
        <nav
          id="main-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.01em',
                padding: '8px 10px',
                borderRadius: '4px',
                color:
                  location.pathname === link.path
                    ? 'var(--color-fg)'
                    : 'var(--color-fg-muted)',
                transition: 'color var(--transition)',
                whiteSpace: 'nowrap',
                borderBottom: location.pathname === link.path ? '2px solid var(--color-fg)' : '2px solid transparent',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: '0 0 auto' }}>
          <button
            id="search-btn"
            onClick={onSearchOpen}
            className="btn-ghost"
            style={{ padding: '10px', borderRadius: '8px' }}
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <button
            id="track-order-btn"
            onClick={onTrackOrderOpen}
            className="btn-ghost"
            style={{ padding: '10px', borderRadius: '8px' }}
            title="Track Order"
            aria-label="Track Order"
          >
            <Package size={20} />
          </button>

          <button
            id="cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="btn-ghost"
            style={{ padding: '10px', borderRadius: '8px', position: 'relative' }}
            aria-label={`Cart (${totalItems} items)`}
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'var(--color-fg)',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav"
          style={{
            borderTop: '1px solid var(--color-border)',
            background: '#fff',
            padding: '12px 0 20px',
          }}
        >
          <div className="container">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'block',
                  padding: '12px 0',
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: location.pathname === link.path ? 'var(--color-fg)' : 'var(--color-fg-muted)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={onTrackOrderOpen}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '12px 0',
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--color-fg-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Track My Order
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 950px) {
          #main-nav { display: none !important; }
          #mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 480px) {
          #site-logo > span:first-of-type { font-size: 18px !important; }
          #site-logo > span:last-of-type { font-size: 6px !important; }
          .store-photo { height: 28px !important; }
          .container { gap: 8px !important; }
        }
      `}</style>
    </header>
  );
}
