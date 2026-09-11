import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { Lock, User, Eye, EyeOff, Crown } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #F9F9F9 0%, #f0ead6 50%, #F9F9F9 100%)',
      fontFamily: 'var(--font-body, "Poppins", sans-serif)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '48px 40px',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(185,147,75,0.2)',
        boxShadow: '0 25px 60px rgba(122,91,39,0.12), 0 0 0 1px rgba(228,199,131,0.15)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #B9934B, #E4C783)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(185,147,75,0.3)',
          }}>
            <Crown size={28} color="#fff" />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading, "Comfortaa", cursive)',
            fontSize: '24px',
            fontWeight: 700,
            color: '#7A5B27',
            marginBottom: '6px',
          }}>Royal Choice</h1>
          <p style={{ color: 'rgba(122,91,39,0.6)', fontSize: '14px' }}>Admin Panel</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.2)',
            color: '#991b1b',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            marginBottom: '20px',
            textAlign: 'center',
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7A5B27', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(122,91,39,0.4)' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 44px',
                  border: '1.5px solid rgba(122,91,39,0.2)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'rgba(249,249,249,0.6)',
                  color: '#7A5B27',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#B9934B'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(122,91,39,0.2)'}
              />
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7A5B27', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(122,91,39,0.4)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                style={{
                  width: '100%',
                  padding: '14px 48px 14px 44px',
                  border: '1.5px solid rgba(122,91,39,0.2)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'rgba(249,249,249,0.6)',
                  color: '#7A5B27',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#B9934B'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(122,91,39,0.2)'}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(122,91,39,0.5)',
              }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '14px',
            background: loading ? 'rgba(185,147,75,0.5)' : 'linear-gradient(135deg, #B9934B, #7A5B27)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 16px rgba(185,147,75,0.3)',
            letterSpacing: '0.5px',
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}