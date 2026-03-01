import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      borderBottom: '1px solid var(--border)',
      background: 'rgba(10,9,8,0.9)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            letterSpacing: '0.05em',
            color: 'var(--text)',
          }}>QUIZARA</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>v1.0</span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
          <NavLink to="/quizzes" active={isActive('/quizzes')}>Browse</NavLink>
          {user && <NavLink to="/create" active={isActive('/create')}>Create</NavLink>}
          {user && <NavLink to="/my-quizzes" active={isActive('/my-quizzes')}>My Quizzes</NavLink>}
          <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 8px' }} />
          {user ? (
            <>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text3)', marginRight: 4 }}>
                {user.username}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost btn-sm" to="/login">Login</Link>
              <Link className="btn btn-primary btn-sm" to="/register">Register</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text)', fontSize: 22 }}
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid var(--border)',
          background: 'var(--bg2)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <Link to="/quizzes" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Browse Quizzes</Link>
          {user && <Link to="/create" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Create Quiz</Link>}
          {user && <Link to="/my-quizzes" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>My Quizzes</Link>}
          <div className="divider" style={{ margin: '8px 0' }} />
          {user ? (
            <button className="btn btn-ghost btn-sm" style={{ width: 'fit-content' }} onClick={handleLogout}>Logout ({user.username})</button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link className="btn btn-ghost btn-sm" to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link className="btn btn-primary btn-sm" to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: active ? 'var(--accent)' : 'var(--text2)',
      padding: '6px 12px',
      borderRadius: 'var(--radius)',
      background: active ? 'rgba(200,149,108,0.08)' : 'transparent',
      transition: 'all var(--transition)',
      textDecoration: 'none',
    }}>
      {children}
    </Link>
  );
}
