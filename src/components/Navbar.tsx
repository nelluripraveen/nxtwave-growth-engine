import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Trophy, GraduationCap, Share2, Home, User, LayoutDashboard, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { store } from '../store/dataStore';
import type { Student } from '../types';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentStudent(store.getCurrentStudent());
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);
  
  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    store.logout();
    setCurrentStudent(null);
    setProfileOpen(false);
    navigate('/');
  };

  const links = currentStudent
    ? [
        { to: '/', icon: <Home size={16} />, label: 'Home' },
        { to: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
        { to: '/leaderboard', icon: <Trophy size={16} />, label: 'Leaderboard' },
        { to: '/colleges', icon: <GraduationCap size={16} />, label: 'College Challenge' },
        { to: '/share', icon: <Share2 size={16} />, label: 'Share' },
      ]
    : [
        { to: '/', icon: <Home size={16} />, label: 'Home' },
        { to: '/login', icon: <LogOut size={16} style={{ transform: 'rotate(180deg)' }} />, label: 'Login' },
        { to: '/register', icon: <User size={16} />, label: 'Register' },
      ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10, 10, 18, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', height: 60, gap: 8 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 'auto' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--gradient-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <Zap size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
            NxtWave <span className="gradient-text">AI Workshop</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-desktop" style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          
          {/* Profile Dropdown */}
          {currentStudent && (
            <div ref={profileRef} style={{ position: 'relative', marginLeft: 8 }}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="nav-link"
                style={{ 
                  background: profileOpen ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <div style={{ 
                  width: 24, height: 24, borderRadius: '50%', 
                  background: 'var(--gradient-brand)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 'bold', color: 'white'
                }}>
                  {currentStudent.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 14 }}>Profile</span>
                <ChevronDown size={14} />
              </button>
              
              {profileOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 8,
                  width: 180,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  backdropFilter: 'blur(20px)',
                  padding: 8,
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{currentStudent.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{currentStudent.referralCode}</div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      width: '100%', padding: '10px 12px',
                      background: 'transparent', border: 'none',
                      color: '#f87171', fontSize: 14, fontWeight: 500,
                      cursor: 'pointer', textAlign: 'left',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: 4,
          }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="nav-mobile-menu" style={{
          flexDirection: 'column',
          padding: '8px 16px 16px',
          borderTop: '1px solid var(--border)',
          gap: 4,
          background: 'rgba(10, 10, 18, 0.95)',
        }}>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              style={{ padding: '10px 14px' }}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          
          {currentStudent && (
            <button 
              onClick={handleLogout}
              className="nav-link"
              style={{ 
                padding: '10px 14px', 
                background: 'transparent', border: 'none',
                color: '#f87171', textAlign: 'left',
                width: '100%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
