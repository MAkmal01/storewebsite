import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { CartProvider } from './context/CartContext.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';

import AnnouncementBar from './components/AnnouncementBar.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import SearchModal from './components/SearchModal.jsx';
import TrackOrderModal from './components/TrackOrderModal.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';

// Reusable Quick View Modal wrapper component for pages
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from './context/CartContext.jsx';

function QuickViewModal({ product, onClose }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product?.variants?.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.variants?.colors?.[0]?.name || '');

  if (!product) return null;

  return (
    <div className="modal-overlay open" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
        <div style={{ background: '#f4f4f0', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={product.images[0]} alt={product.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
        </div>
        <div style={{ padding: '32px 32px 32px 24px', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
          
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{product.title}</h2>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Rs. {product.price.toLocaleString('en-PK')}</p>
          
          {product.variants?.sizes?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Size</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.variants.sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)} className={`variant-pill ${selectedSize === s ? 'selected' : ''}`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {product.variants?.colors?.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Color</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.variants.colors.map((c) => (
                  <button key={c.name} onClick={() => setSelectedColor(c.name)} className={`color-swatch ${selectedColor === c.name ? 'selected' : ''}`} style={{ background: c.hex }} title={c.name} />
                ))}
              </div>
            </div>
          )}
          
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '14px' }}
            disabled={!product.inStock}
            onClick={() => {
              addItem(product, selectedSize, selectedColor, 1);
              onClose();
            }}
          >
            <ShoppingBag size={16} /> {!product.inStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

function MainLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isAdminRoute && <AnnouncementBar />}
      {!isAdminRoute && (
        <Navbar 
          onSearchOpen={() => setIsSearchOpen(true)} 
          onTrackOrderOpen={() => setIsTrackOrderOpen(true)} 
        />
      )}
      
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage onQuickView={setQuickViewProduct} />} />
          <Route path="/collections/:category" element={<CatalogPage onQuickView={setQuickViewProduct} />} />
          <Route path="/product/:slug" element={<ProductDetailPage onQuickView={setQuickViewProduct} />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      
      {!isAdminRoute && <Footer />}

      {/* Overlays / Modals */}
      {!isAdminRoute && <CartDrawer />}
      {!isAdminRoute && <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
      {!isAdminRoute && <TrackOrderModal isOpen={isTrackOrderOpen} onClose={() => setIsTrackOrderOpen(false)} />}
      
      {!isAdminRoute && quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <CartProvider>
          <MainLayout />
        </CartProvider>
      </AdminAuthProvider>
    </Router>
  );
}
