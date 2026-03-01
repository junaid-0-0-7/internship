import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Hero */}
      <section style={{
        padding: '100px 0 80px',
        position: 'relative',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(200,149,108,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '-10%',
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(92,126,165,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container">
          <div style={{ maxWidth: 800 }} className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
              <div style={{ height: 1, width: 40, background: 'var(--accent)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Knowledge Platform
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(64px, 10vw, 120px)',
              letterSpacing: '0.02em',
              lineHeight: 0.95,
              color: 'var(--text)',
              marginBottom: 32,
            }}>
              TEST<br />
              <span style={{ color: 'var(--accent)', WebkitTextStroke: '1px var(--accent)', WebkitTextFillColor: 'transparent' }}>YOUR</span><br />
              MIND
            </h1>

            <p style={{
              fontSize: 20,
              color: 'var(--text2)',
              maxWidth: 520,
              fontStyle: 'italic',
              lineHeight: 1.7,
              marginBottom: 48,
            }}>
              Craft intricate quizzes or challenge yourself with the community's finest knowledge. Every question is a brushstroke in the portrait of understanding.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link className="btn btn-primary btn-lg" to="/quizzes">
                <span>⬡</span> Browse Quizzes
              </Link>
              {user ? (
                <Link className="btn btn-outline btn-lg" to="/create">
                  <span>✦</span> Create a Quiz
                </Link>
              ) : (
                <Link className="btn btn-outline btn-lg" to="/register">
                  <span>✦</span> Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
            {[
              {
                icon: '◈',
                title: 'Craft Quizzes',
                desc: 'Build multi-question experiences with custom options, correct answers, and detailed explanations.',
                color: 'var(--accent)',
              },
              {
                icon: '◉',
                title: 'Challenge Others',
                desc: 'Share your knowledge with the world. Set difficulty levels, time limits, and categories.',
                color: 'var(--blue)',
              },
              {
                icon: '◎',
                title: 'Track Progress',
                desc: 'See immediate feedback, detailed breakdowns, and compare results on the leaderboard.',
                color: 'var(--green)',
              },
            ].map((f, i) => (
              <div key={i} className="card" style={{
                padding: '40px 32px',
                borderRadius: 0,
                border: 'none',
                borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                animation: `fadeIn 0.4s ease ${i * 0.1}s both`,
              }}>
                <span style={{ fontSize: 32, color: f.color, display: 'block', marginBottom: 20 }}>{f.icon}</span>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 28,
                  letterSpacing: '0.05em',
                  color: 'var(--text)',
                  marginBottom: 12,
                }}>{f.title}</h3>
                <p style={{ color: 'var(--text2)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24 }}>
            — Ready to begin? —
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 64px)', color: 'var(--text)', marginBottom: 16 }}>
            Join the Community
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 18, marginBottom: 40, fontStyle: 'italic' }}>
            Register for free and start creating or taking quizzes today.
          </p>
          {!user && (
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link className="btn btn-primary btn-lg" to="/register">Create Account</Link>
              <Link className="btn btn-ghost btn-lg" to="/login">Sign In</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
