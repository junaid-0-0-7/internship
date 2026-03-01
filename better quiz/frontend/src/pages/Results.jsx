import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, score, total, quizTitle, elapsed } = location.state || {};

  if (!results) {
    navigate('/quizzes');
    return null;
  }

  const percentage = Math.round((score / total) * 100);

  let grade, gradeColor, gradeMsg;
  if (percentage >= 90) { grade = 'S'; gradeColor = 'var(--gold)'; gradeMsg = 'Masterful'; }
  else if (percentage >= 80) { grade = 'A'; gradeColor = 'var(--green)'; gradeMsg = 'Excellent'; }
  else if (percentage >= 70) { grade = 'B'; gradeColor = 'var(--blue)'; gradeMsg = 'Good'; }
  else if (percentage >= 60) { grade = 'C'; gradeColor = 'var(--accent)'; gradeMsg = 'Satisfactory'; }
  else { grade = 'F'; gradeColor = 'var(--red)'; gradeMsg = 'Keep practicing'; }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '48px 16px 80px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Header */}
        <div className="card fade-in" style={{ padding: '48px 40px', marginBottom: 32, textAlign: 'center', background: 'var(--surface)', borderColor: gradeColor + '40' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(80px, 15vw, 120px)',
            color: gradeColor,
            lineHeight: 1,
            letterSpacing: '0.05em',
            marginBottom: 8,
          }}>
            {grade}
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 24 }}>
            {gradeMsg}
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text)', marginBottom: 24 }}>
            {quizTitle}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 32 }}>
            <StatBig label="Score" value={`${score} / ${total}`} color={gradeColor} />
            <StatBig label="Percentage" value={`${percentage}%`} color={gradeColor} />
            <StatBig label="Time" value={`${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`} color="var(--text2)" />
          </div>

          {/* Score bar */}
          <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, maxWidth: 400, margin: '0 auto 32px' }}>
            <div style={{
              height: '100%',
              background: gradeColor,
              borderRadius: 3,
              width: `${percentage}%`,
              transition: 'width 1s ease',
              boxShadow: `0 0 12px ${gradeColor}60`,
            }} />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="btn btn-primary" to="/quizzes">Browse More Quizzes</Link>
            <Link className="btn btn-outline" to="/create">Create a Quiz</Link>
          </div>
        </div>

        {/* Question breakdown */}
        <div style={{ marginBottom: 24 }}>
          <p className="label">Review</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: '0.05em', marginBottom: 24 }}>ANSWER BREAKDOWN</h2>
        </div>

        {results.map((r, i) => (
          <div
            key={i}
            className="card fade-in"
            style={{
              padding: '24px 28px',
              marginBottom: 12,
              borderColor: r.isCorrect ? 'rgba(92,158,106,0.3)' : 'rgba(196,92,92,0.2)',
              animation: `fadeIn 0.3s ease ${i * 0.06}s both`,
            }}
          >
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 24,
                color: r.isCorrect ? 'var(--green)' : 'var(--red)',
                lineHeight: 1,
                minWidth: 28,
              }}>
                {r.isCorrect ? '✓' : '✗'}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', marginBottom: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Question {i + 1}
                </p>
                <p style={{ fontSize: 17, color: 'var(--text)', lineHeight: 1.5, marginBottom: 12 }}>{r.questionText}</p>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {r.chosen !== undefined && r.chosen >= 0 && r.chosen !== r.correct && (
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--red)', display: 'block', marginBottom: 3 }}>YOUR ANSWER</span>
                      <span style={{ color: 'var(--red)', fontSize: 15 }}>{r.options[r.chosen]}</span>
                    </div>
                  )}
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)', display: 'block', marginBottom: 3 }}>CORRECT ANSWER</span>
                    <span style={{ color: 'var(--green)', fontSize: 15 }}>{r.options[r.correct]}</span>
                  </div>
                </div>

                {r.explanation && (
                  <p style={{ marginTop: 12, color: 'var(--text3)', fontStyle: 'italic', fontSize: 15, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                    {r.explanation}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBig({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
    </div>
  );
}
