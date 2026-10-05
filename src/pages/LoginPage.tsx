import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, Brain } from 'lucide-react';
import { store } from '../store/dataStore';
import { useToast } from '../components/Toast';

export function LoginPage() {
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      store.login(email);
      showToast('Login successful! 🎉', 'success');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err: any) {
      setError(err.message || 'Invalid email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px 80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {ToastComponent}
      <div style={{ width: '100%', maxWidth: 440 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="badge badge-violet" style={{ marginBottom: 16, display: 'inline-flex' }}>
            <Brain size={12} />
            Welcome Back
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
            Student <span className="gradient-text">Login</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Enter your email to access your dashboard and referrals.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="input-label" htmlFor="login-email">
                <Mail size={11} style={{ display: 'inline', marginRight: 4 }} />
                Email Address
              </label>
              <input
                id="login-email"
                className="input-field"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                disabled={loading}
              />
              {error && (
                <div style={{ color: '#f87171', fontSize: 13, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertCircle size={14} />{error}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: 4, padding: '15px 24px', fontSize: 16, width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Logging in...' : <>Login <ArrowRight size={18} /></>}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>
                Register Free
              </Link>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
}
