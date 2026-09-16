import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import {
  Crown, LogOut, LayoutDashboard, Package, ShoppingCart, Star,
  Plus, Pencil, Trash2, X, Save, Search
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Shared Styles                                                      */
/* ------------------------------------------------------------------ */
const S = {
  page: {
    minHeight: '100vh', display: 'flex', background: '#F9F9F9',
    fontFamily: 'var(--font-body, "Poppins", sans-serif)',
  },
  sidebar: {
    width: '260px', background: 'linear-gradient(180deg, #7A5B27 0%, #5a4219 100%)',
    color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0,
    boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
  },
  sidebarHeader: {
    padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)',
    display: 'flex', alignItems: 'center', gap: '12px',
  },
  navBtn: (active) => ({
    display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
    padding: '14px 24px', border: 'none', cursor: 'pointer', fontSize: '14px',
    fontWeight: active ? 600 : 400, color: '#fff', textAlign: 'left',
    background: active ? 'rgba(228,199,131,0.2)' : 'transparent',
    borderLeft: active ? '3px solid #E4C783' : '3px solid transparent',
    transition: 'all 0.2s',
  }),
  main: {
    flex: 1, padding: '32px 40px', overflowY: 'auto', maxHeight: '100vh',
  },
  card: {
    background: '#fff', borderRadius: '16px', padding: '24px',
    boxShadow: '0 2px 12px rgba(122,91,39,0.06)',
    border: '1px solid rgba(122,91,39,0.08)',
  },
  statCard: (color) => ({
    background: '#fff', borderRadius: '16px', padding: '24px', flex: 1,
    boxShadow: '0 2px 12px rgba(122,91,39,0.06)',
    border: '1px solid rgba(122,91,39,0.08)',
    borderTop: `4px solid ${color}`,
  }),
  th: {
    padding: '14px 16px', textAlign: 'left', fontSize: '11px',
    fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px',
    color: 'rgba(122,91,39,0.6)', borderBottom: '2px solid rgba(122,91,39,0.1)',
    background: 'rgba(249,249,249,0.8)',
  },
  td: {
    padding: '14px 16px', fontSize: '13px', color: '#7A5B27',
    borderBottom: '1px solid rgba(122,91,39,0.06)',
    verticalAlign: 'middle',
  },
  badge: (bg, color) => ({
    display: 'inline-block', padding: '4px 10px', borderRadius: '20px',
    fontSize: '11px', fontWeight: 600, background: bg, color: color,
  }),
  iconBtn: (color) => ({
    background: 'none', border: 'none', cursor: 'pointer', padding: '6px',
    borderRadius: '8px', color, transition: 'background 0.2s',
  }),
  input: {
    width: '100%', padding: '10px 14px', border: '1.5px solid rgba(122,91,39,0.2)',
    borderRadius: '10px', fontSize: '13px', outline: 'none', color: '#7A5B27',
    background: '#fff', boxSizing: 'border-box',
  },
  select: {
    padding: '8px 12px', border: '1.5px solid rgba(122,91,39,0.2)',
    borderRadius: '10px', fontSize: '13px', color: '#7A5B27',
    background: '#fff', outline: 'none', cursor: 'pointer',
  },
  primaryBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '10px 20px', background: 'linear-gradient(135deg, #B9934B, #7A5B27)',
    color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px',
    fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(185,147,75,0.25)',
  },
  dangerBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '8px 16px', background: 'rgba(220,38,38,0.08)',
    color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)',
    borderRadius: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 9999,
  },
  modalBox: {
    background: '#fff', borderRadius: '20px', padding: '32px',
    width: '90%', maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto',
    boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
  },
};

/* ------------------------------------------------------------------ */
/*  Status badge helper                                                */
/* ------------------------------------------------------------------ */
const statusColors = {
  Pending: { bg: 'rgba(234,179,8,0.12)', color: '#a16207' },
  Confirmed: { bg: 'rgba(59,130,246,0.12)', color: '#1d4ed8' },
  Processing: { bg: 'rgba(168,85,247,0.12)', color: '#7c3aed' },
  Shipped: { bg: 'rgba(34,197,94,0.12)', color: '#15803d' },
  Delivered: { bg: 'rgba(34,197,94,0.2)', color: '#166534' },
  Cancelled: { bg: 'rgba(220,38,38,0.1)', color: '#991b1b' },
  Paid: { bg: 'rgba(34,197,94,0.15)', color: '#166534' },
  Failed: { bg: 'rgba(220,38,38,0.1)', color: '#991b1b' },
};
const StatusBadge = ({ status }) => {
  const c = statusColors[status] || { bg: 'rgba(0,0,0,0.06)', color: '#333' };
  return <span style={S.badge(c.bg, c.color)}>{status}</span>;
};

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */
export default function AdminDashboard() {
  const { authFetch, logout, adminUser } = useAdminAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '', description: '', price: '', comparePrice: '', category: 'watches',
    inStock: true, stockQuantity: 50, badge: '', images: [''],
    details: '', careInstructions: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  /* --- Loaders --- */
  const loadStats = async () => {
    try { const res = await authFetch('/api/admin/dashboard'); const d = await res.json(); setStats(d); } catch {}
  };
  const loadProducts = async () => {
    try { const res = await authFetch('/api/admin/products'); const d = await res.json(); setProducts(Array.isArray(d) ? d : []); } catch {}
  };
  const loadOrders = async () => {
    try { const res = await authFetch('/api/admin/orders'); const d = await res.json(); setOrders(Array.isArray(d) ? d : []); } catch {}
  };
  const loadReviews = async () => {
    try { const res = await authFetch('/api/admin/reviews'); const d = await res.json(); setReviews(Array.isArray(d) ? d : []); } catch {}
  };

  useEffect(() => {
    if (tab === 'dashboard') loadStats();
    if (tab === 'products') loadProducts();
    if (tab === 'orders') loadOrders();
    if (tab === 'reviews') loadReviews();
  }, [tab]);

  /* --- Product CRUD --- */
  const openNewProduct = () => {
    setEditingProduct(null);
    setProductForm({ 
      title: '', description: '', price: '', comparePrice: '', category: 'watches', 
      inStock: true, stockQuantity: 50, badge: '', images: [], imageFiles: [],
      details: '', careInstructions: '',
    });
    setShowProductModal(true);
  };
  const openEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({ 
      title: p.title, 
      description: p.description, 
      price: p.price, 
      comparePrice: p.comparePrice || '', 
      category: p.category, 
      inStock: p.inStock, 
      stockQuantity: p.stockQuantity, 
      badge: p.badge || '', 
      images: p.images?.length ? [...p.images] : [], 
      imageFiles: [],
      details: Array.isArray(p.details) ? p.details.join('\n') : (p.details || ''),
      careInstructions: Array.isArray(p.careInstructions) ? p.careInstructions.join('\n') : (p.careInstructions || ''),
    });
    setShowProductModal(true);
  };
  const saveProduct = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', productForm.title);
      formData.append('description', productForm.description);
      formData.append('price', Number(productForm.price));
      if (productForm.comparePrice) formData.append('comparePrice', Number(productForm.comparePrice));
      formData.append('stockQuantity', Number(productForm.stockQuantity));
      formData.append('category', productForm.category);
      formData.append('inStock', productForm.inStock);
      if (productForm.badge) formData.append('badge', productForm.badge);
      formData.append('details', productForm.details || '');
      formData.append('careInstructions', productForm.careInstructions || '');
      
      productForm.images.forEach(img => formData.append('images', img));
      if (productForm.imageFiles) {
        productForm.imageFiles.forEach(file => formData.append('images', file));
      }

      if (editingProduct) {
        await authFetch(`/api/admin/products/${editingProduct._id}`, { method: 'PUT', body: formData });
      } else {
        await authFetch('/api/admin/products', { method: 'POST', body: formData });
      }
      setShowProductModal(false);
      loadProducts();
      if (tab === 'dashboard') loadStats();
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };
  const deleteProductHandler = async (id) => {
    if (!confirm('Delete this product permanently?')) return;
    try { await authFetch(`/api/admin/products/${id}`, { method: 'DELETE' }); loadProducts(); } catch {}
  };

  /* --- Order status update --- */
  const updateOrderStatus = async (id, orderStatus) => {
    try { await authFetch(`/api/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ orderStatus }) }); loadOrders(); } catch {}
  };

  /* --- Delete review --- */
  const deleteReviewHandler = async (id) => {
    if (!confirm('Delete this review?')) return;
    try { await authFetch(`/api/admin/reviews/${id}`, { method: 'DELETE' }); loadReviews(); } catch {}
  };

  const handleLogout = () => { logout(); navigate('/admin'); };

  const filteredProducts = products.filter(p =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredOrders = orders.filter(o =>
    o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================================================================ */
  return (
    <div style={S.page}>
      {/* SIDEBAR */}
      <aside style={S.sidebar}>
        <div style={S.sidebarHeader}>
          <Crown size={24} color="#E4C783" />
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px' }}>Royal Choice</div>
            <div style={{ fontSize: '11px', opacity: 0.6 }}>Admin Panel</div>
          </div>
        </div>
        <nav style={{ flex: 1, paddingTop: '12px' }}>
          {[
            { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { key: 'products', label: 'Products', icon: Package },
            { key: 'orders', label: 'Orders', icon: ShoppingCart },
            { key: 'reviews', label: 'Reviews', icon: Star },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} style={S.navBtn(tab === key)} onClick={() => { setTab(key); setSearchTerm(''); }}>
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>Signed in as</div>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>{adminUser}</div>
          <button onClick={handleLogout} style={{ ...S.dangerBtn, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', width: '100%', justifyContent: 'center' }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={S.main}>
        {/* ---- DASHBOARD TAB ---- */}
        {tab === 'dashboard' && stats && (
          <>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#7A5B27', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>Dashboard</h1>
            <p style={{ color: 'rgba(122,91,39,0.6)', marginBottom: '32px', fontSize: '14px' }}>Welcome back! Here is your store overview.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
              <div style={S.statCard('#B9934B')}>
                <div style={{ fontSize: '12px', color: 'rgba(122,91,39,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Total Products</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#7A5B27' }}>{stats.totalProducts}</div>
              </div>
              <div style={S.statCard('#3b82f6')}>
                <div style={{ fontSize: '12px', color: 'rgba(122,91,39,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Total Orders</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#7A5B27' }}>{stats.totalOrders}</div>
              </div>
              <div style={S.statCard('#22c55e')}>
                <div style={{ fontSize: '12px', color: 'rgba(122,91,39,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Revenue</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#7A5B27' }}>Rs. {stats.revenue?.toLocaleString('en-PK')}</div>
              </div>
              <div style={S.statCard(stats.lowStockProducts > 0 ? '#ef4444' : '#22c55e')}>
                <div style={{ fontSize: '12px', color: 'rgba(122,91,39,0.5)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Low Stock</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: stats.lowStockProducts > 0 ? '#ef4444' : '#7A5B27' }}>{stats.lowStockProducts}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={S.card}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#7A5B27', marginBottom: '20px' }}>Order Status Breakdown</h3>
                {Object.entries(stats.ordersByStatus || {}).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(122,91,39,0.06)' }}>
                    <span style={{ fontSize: '13px', color: '#7A5B27', textTransform: 'capitalize' }}>{key}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#B9934B' }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={S.card}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#7A5B27', marginBottom: '20px' }}>Recent Orders</h3>
                {stats.recentOrders?.length > 0 ? stats.recentOrders.map(o => (
                  <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(122,91,39,0.06)' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#7A5B27' }}>{o.orderNumber}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(122,91,39,0.5)' }}>{o.customer?.fullName}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#B9934B' }}>Rs. {o.totalAmount?.toLocaleString('en-PK')}</div>
                      <StatusBadge status={o.orderStatus} />
                    </div>
                  </div>
                )) : <p style={{ color: 'rgba(122,91,39,0.4)', fontSize: '13px' }}>No orders yet.</p>}
              </div>
            </div>
          </>
        )}
        {tab === 'dashboard' && !stats && <p style={{ color: 'rgba(122,91,39,0.5)' }}>Loading dashboard...</p>}

        {/* ---- PRODUCTS TAB ---- */}
        {tab === 'products' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#7A5B27', fontFamily: 'var(--font-heading)' }}>Products</h1>
              <button style={S.primaryBtn} onClick={openNewProduct}><Plus size={16} /> Add Product</button>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ position: 'relative', maxWidth: '360px' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(122,91,39,0.35)' }} />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search products..." style={{ ...S.input, paddingLeft: '40px' }} />
              </div>
            </div>
            <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={S.th}>Product</th>
                    <th style={S.th}>Category</th>
                    <th style={S.th}>Price</th>
                    <th style={S.th}>Stock</th>
                    <th style={S.th}>Status</th>
                    <th style={{ ...S.th, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p._id}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(228,199,131,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td style={S.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={p.images?.[0]} alt="" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '10px', background: '#f5f3ee' }} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '13px' }}>{p.title}</div>
                            {p.badge && <span style={S.badge('rgba(185,147,75,0.12)', '#B9934B')}>{p.badge}</span>}
                          </div>
                        </div>
                      </td>
                      <td style={S.td}><span style={{ textTransform: 'capitalize' }}>{p.category}</span></td>
                      <td style={S.td}>
                        <span style={{ fontWeight: 600 }}>Rs. {p.price?.toLocaleString('en-PK')}</span>
                        {p.comparePrice && <span style={{ fontSize: '11px', color: 'rgba(122,91,39,0.4)', textDecoration: 'line-through', marginLeft: '6px' }}>Rs. {p.comparePrice?.toLocaleString('en-PK')}</span>}
                      </td>
                      <td style={S.td}>
                        <span style={{ fontWeight: 600, color: p.stockQuantity <= 5 ? '#ef4444' : '#7A5B27' }}>{p.stockQuantity}</span>
                      </td>
                      <td style={S.td}>
                        <span style={S.badge(p.inStock ? 'rgba(34,197,94,0.12)' : 'rgba(220,38,38,0.1)', p.inStock ? '#15803d' : '#991b1b')}>
                          {p.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td style={{ ...S.td, textAlign: 'right' }}>
                        <button style={S.iconBtn('#B9934B')} title="Edit" onClick={() => openEditProduct(p)}><Pencil size={16} /></button>
                        <button style={S.iconBtn('#ef4444')} title="Delete" onClick={() => deleteProductHandler(p._id)}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: 'rgba(122,91,39,0.4)' }}>No products found.</p>}
            </div>
          </>
        )}

        {/* ---- ORDERS TAB ---- */}
        {tab === 'orders' && (
          <>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#7A5B27', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>Orders</h1>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ position: 'relative', maxWidth: '360px' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(122,91,39,0.35)' }} />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by order # or customer..." style={{ ...S.input, paddingLeft: '40px' }} />
              </div>
            </div>
            <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={S.th}>Order #</th>
                    <th style={S.th}>Customer</th>
                    <th style={S.th}>Items</th>
                    <th style={S.th}>Total</th>
                    <th style={S.th}>Payment</th>
                    <th style={S.th}>Status</th>
                    <th style={{ ...S.th, textAlign: 'right' }}>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <tr key={o._id}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(228,199,131,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td style={{ ...S.td, fontWeight: 600 }}>{o.orderNumber}</td>
                      <td style={S.td}>
                        <div style={{ fontWeight: 500 }}>{o.customer?.fullName}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(122,91,39,0.5)' }}>{o.customer?.email}</div>
                      </td>
                      <td style={S.td}>{o.items?.length || 0}</td>
                      <td style={{ ...S.td, fontWeight: 600 }}>Rs. {o.totalAmount?.toLocaleString('en-PK')}</td>
                      <td style={S.td}><StatusBadge status={o.paymentStatus} /></td>
                      <td style={S.td}><StatusBadge status={o.orderStatus} /></td>
                      <td style={{ ...S.td, textAlign: 'right' }}>
                        <select style={S.select} value={o.orderStatus} onChange={e => updateOrderStatus(o._id, e.target.value)}>
                          {['Pending','Confirmed','Processing','Shipped','Delivered','Cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: 'rgba(122,91,39,0.4)' }}>No orders found.</p>}
            </div>
          </>
        )}

        {/* ---- REVIEWS TAB ---- */}
        {tab === 'reviews' && (
          <>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#7A5B27', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>Reviews</h1>
            <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={S.th}>Product</th>
                    <th style={S.th}>Author</th>
                    <th style={S.th}>Rating</th>
                    <th style={S.th}>Review</th>
                    <th style={S.th}>Date</th>
                    <th style={{ ...S.th, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(r => (
                    <tr key={r._id}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(228,199,131,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td style={S.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {r.productId?.images?.[0] && <img src={r.productId.images[0]} alt="" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />}
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>{r.productId?.title || 'Deleted Product'}</span>
                        </div>
                      </td>
                      <td style={S.td}>
                        {r.authorName}
                        {r.verifiedBuyer && <span style={{ ...S.badge('rgba(34,197,94,0.12)', '#15803d'), marginLeft: '6px' }}>Verified</span>}
                      </td>
                      <td style={S.td}>
                        <span style={{ color: '#E4C783', fontSize: '14px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      </td>
                      <td style={{ ...S.td, maxWidth: '260px' }}>
                        {r.title && <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: '2px' }}>{r.title}</div>}
                        <div style={{ fontSize: '12px', color: 'rgba(122,91,39,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.content}</div>
                      </td>
                      <td style={{ ...S.td, fontSize: '12px', color: 'rgba(122,91,39,0.5)' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td style={{ ...S.td, textAlign: 'right' }}>
                        <button style={S.iconBtn('#ef4444')} title="Delete" onClick={() => deleteReviewHandler(r._id)}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {reviews.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: 'rgba(122,91,39,0.4)' }}>No reviews yet.</p>}
            </div>
          </>
        )}
      </main>

      {/* PRODUCT MODAL */}
      {showProductModal && (
        <div style={S.modalOverlay} onClick={() => setShowProductModal(false)}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#7A5B27', fontFamily: 'var(--font-heading)' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowProductModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A5B27' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7A5B27', marginBottom: '6px' }}>Title</label>
                <input style={S.input} value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7A5B27', marginBottom: '6px' }}>Description</label>
                <textarea style={{ ...S.input, minHeight: '80px', resize: 'vertical' }} value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7A5B27', marginBottom: '6px' }}>Price (Rs.)</label>
                  <input type="number" style={S.input} value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7A5B27', marginBottom: '6px' }}>Compare Price</label>
                  <input type="number" style={S.input} value={productForm.comparePrice} onChange={e => setProductForm({ ...productForm, comparePrice: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7A5B27', marginBottom: '6px' }}>Stock Qty</label>
                  <input type="number" style={S.input} value={productForm.stockQuantity} onChange={e => setProductForm({ ...productForm, stockQuantity: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7A5B27', marginBottom: '6px' }}>Category</label>
                  <select style={{ ...S.select, width: '100%', padding: '10px 14px' }} value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                    <option value="watches">Watches</option>
                    <option value="wallets">Wallets</option>
                    <option value="perfumes">Perfumes</option>
                    <option value="jewellery">Jewellery</option>
                    <option value="gifts">Gift Items</option>
                    <option value="mobile-accessories">Mobile Accessories</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7A5B27', marginBottom: '6px' }}>Badge</label>
                  <select style={{ ...S.select, width: '100%', padding: '10px 14px' }} value={productForm.badge} onChange={e => setProductForm({ ...productForm, badge: e.target.value })}>
                    <option value="">None</option>
                    <option value="NEW">NEW</option>
                    <option value="SALE">SALE</option>
                    <option value="HOT">HOT</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="LUXURY">LUXURY</option>
                    <option value="ESSENTIAL">ESSENTIAL</option>
                  </select>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#7A5B27' }}>Product Details (Key Specifications)</label>
                  <span style={{ fontSize: '11px', color: 'rgba(122,91,39,0.5)' }}>One bullet point per line</span>
                </div>
                <textarea
                  style={{ ...S.input, minHeight: '80px', resize: 'vertical' }}
                  value={productForm.details || ''}
                  onChange={e => setProductForm({ ...productForm, details: e.target.value })}
                  placeholder={'Material: 100% Full-grain Leather\nDimensions: 4.5" x 3.5"\n8 Card Slots, 2 Bill Compartments\nRFID Blocking'}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#7A5B27' }}>Care Instructions</label>
                  <span style={{ fontSize: '11px', color: 'rgba(122,91,39,0.5)' }}>One instruction per line</span>
                </div>
                <textarea
                  style={{ ...S.input, minHeight: '80px', resize: 'vertical' }}
                  value={productForm.careInstructions || ''}
                  onChange={e => setProductForm({ ...productForm, careInstructions: e.target.value })}
                  placeholder={'Wipe clean gently with a soft dry cloth.\nAvoid contact with water and strong chemicals.\nStore in a cool, dry place.'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7A5B27', marginBottom: '6px' }}>Images</label>
                
                {/* Existing Images */}
                {productForm.images && productForm.images.map((img, i) => (
                  <div key={`existing-${i}`} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <img src={img} alt={`Preview ${i}`} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <span style={{ fontSize: '12px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img}</span>
                    <button style={S.iconBtn('#ef4444')} onClick={() => {
                      setProductForm({ ...productForm, images: productForm.images.filter((_, j) => j !== i) });
                    }}><X size={16} /></button>
                  </div>
                ))}
                
                {/* New Files */}
                {productForm.imageFiles && productForm.imageFiles.map((file, i) => (
                  <div key={`new-${i}`} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '10px' }}>NEW</span>
                    </div>
                    <span style={{ fontSize: '12px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                    <button style={S.iconBtn('#ef4444')} onClick={() => {
                      setProductForm({ ...productForm, imageFiles: productForm.imageFiles.filter((_, j) => j !== i) });
                    }}><X size={16} /></button>
                  </div>
                ))}
                
                <label style={{ ...S.primaryBtn, padding: '6px 14px', fontSize: '12px', display: 'inline-flex', cursor: 'pointer', marginTop: '8px' }}>
                  <Plus size={14} /> Add Images
                  <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => {
                    if (e.target.files.length) {
                      const filesArray = Array.from(e.target.files);
                      setProductForm({ ...productForm, imageFiles: [...(productForm.imageFiles || []), ...filesArray] });
                    }
                  }} />
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="inStockCheck" checked={productForm.inStock} onChange={e => setProductForm({ ...productForm, inStock: e.target.checked })} />
                <label htmlFor="inStockCheck" style={{ fontSize: '13px', color: '#7A5B27', fontWeight: 500 }}>In Stock</label>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(122,91,39,0.1)' }}>
              <button onClick={() => setShowProductModal(false)} style={{ ...S.dangerBtn, background: 'rgba(122,91,39,0.06)', color: '#7A5B27', border: '1px solid rgba(122,91,39,0.15)' }}>Cancel</button>
              <button onClick={saveProduct} disabled={loading} style={S.primaryBtn}>
                <Save size={14} /> {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
