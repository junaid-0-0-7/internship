import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function TakeQuiz() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    axios.get(`/api/quizzes/${id}`)
      .then(r => { setQuiz(r.data.quiz); setLoading(false); })
      .catch(() => navigate('/quizzes'));
  }, [id]);

  useEffect(() => {
    if (!started || !quiz) return;
    startTimeRef.current = Date.now();

    if (quiz.timeLimit > 0) setTimeLeft(quiz.timeLimit);

    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      if (quiz.timeLimit > 0) {
        const remaining = quiz.timeLimit - Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          handleFinish(true);
        } else {
          setTimeLeft(remaining);
        }
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [started]);

  const handleStart = () => {
    if (!user && !guestName.trim()) return;
    setStarted(true);
  };

  const handleSelect = (optIndex) => {
    if (confirmed) return;
    setSelected(optIndex);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setConfirmed(true);

    // Auto-advance after 1.2 seconds
    setTimeout(() => {
      if (current + 1 < quiz.questions.length) {
        setCurrent(c => c + 1);
        setSelected(null);
        setConfirmed(false);
      } else {
        handleFinish(false, newAnswers);
      }
    }, 1200);
  };

  const handleFinish = async (timedOut = false, finalAnswers = null) => {
    clearInterval(timerRef.current);
    const ans = finalAnswers || [...answers];

    // Fill unanswered with -1
    while (ans.length < quiz.questions.length) ans.push(-1);

    setSubmitting(true);
    try {
      const r = await axios.post('/api/attempts', {
        quizId: id,
        answers: ans,
        timeTaken: elapsed,
        guestName: user ? undefined : guestName,
      });
      navigate('/results', { state: { results: r.data.results, score: r.data.score, total: r.data.total, quizTitle: quiz.title, elapsed } });
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading quiz...</div>;
  if (!quiz) return null;

  // Pre-start screen
  if (!started) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div className="fade-in" style={{ maxWidth: 560, width: '100%' }}>
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>⬡</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: '0.03em', marginBottom: 8 }}>
              {quiz.title}
            </h1>
            {quiz.description && (
              <p style={{ color: 'var(--text3)', fontStyle: 'italic', marginBottom: 24 }}>{quiz.description}</p>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
              <Stat label="Questions" value={quiz.questions.length} />
              <Stat label="Difficulty" value={quiz.difficulty} />
              {quiz.timeLimit > 0 && <Stat label="Time Limit" value={`${Math.floor(quiz.timeLimit / 60)}:${String(quiz.timeLimit % 60).padStart(2, '0')}`} />}
            </div>
            <div className="divider" />
            {!user && (
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label className="label">Your Name (as guest)</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="Enter your name..."
                />
              </div>
            )}
            <button
              className="btn btn-primary btn-lg"
              onClick={handleStart}
              disabled={!user && !guestName.trim()}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Begin Quiz
            </button>
            {!user && (
              <p style={{ marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' }}>
                Or <Link to="/login">sign in</Link> for personalized tracking
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (submitting) return <div className="loading">Calculating results...</div>;

  const question = quiz.questions[current];
  const progress = ((current) / quiz.questions.length) * 100;

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '48px 16px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text3)' }}>
              {current + 1} / {quiz.questions.length}
            </span>
            <div style={{ display: 'flex', gap: 16 }}>
              {quiz.timeLimit > 0 && (
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  color: timeLeft <= 30 ? 'var(--red)' : 'var(--accent)',
                  fontWeight: 500,
                }}>
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </span>
              )}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text3)' }}>
                {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
              </span>
            </div>
          </div>
          <div style={{ height: 3, background: 'var(--border)', borderRadius: 2 }}>
            <div style={{
              height: '100%',
              background: 'var(--accent)',
              borderRadius: 2,
              width: `${progress}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Question */}
        <div className="fade-in" key={current}>
          <div className="card" style={{ padding: '40px 40px 32px', marginBottom: 24 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20 }}>
              Question {current + 1}
            </p>
            <h2 style={{
              fontSize: 22,
              lineHeight: 1.5,
              color: 'var(--text)',
              fontWeight: 400,
            }}>
              {question.text}
            </h2>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {question.options.map((opt, oi) => {
              let borderColor = 'var(--border)';
              let bg = 'var(--surface)';
              let textColor = 'var(--text)';

              if (confirmed) {
                if (oi === question.correctIndex) {
                  borderColor = 'var(--green)';
                  bg = 'rgba(92,158,106,0.1)';
                  textColor = 'var(--green)';
                } else if (oi === selected) {
                  borderColor = 'var(--red)';
                  bg = 'rgba(196,92,92,0.08)';
                  textColor = 'var(--red)';
                }
              } else if (oi === selected) {
                borderColor = 'var(--accent)';
                bg = 'rgba(200,149,108,0.08)';
              }

              return (
                <button
                  key={oi}
                  onClick={() => handleSelect(oi)}
                  style={{
                    background: bg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 'var(--radius)',
                    padding: '16px 20px',
                    textAlign: 'left',
                    cursor: confirmed ? 'default' : 'pointer',
                    color: textColor,
                    fontFamily: 'var(--font-body)',
                    fontSize: 17,
                    lineHeight: 1.5,
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    transform: !confirmed && oi === selected ? 'translateX(4px)' : 'none',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    minWidth: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: `1px solid ${borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: textColor,
                    flexShrink: 0,
                  }}>
                    {confirmed && oi === question.correctIndex ? '✓' : confirmed && oi === selected ? '✗' : String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {confirmed && question.explanation && (
            <div style={{
              background: 'rgba(92,126,165,0.08)',
              border: '1px solid rgba(92,126,165,0.2)',
              borderRadius: 'var(--radius)',
              padding: '16px 20px',
              marginBottom: 24,
              animation: 'fadeIn 0.3s ease',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--blue)', display: 'block', marginBottom: 6 }}>EXPLANATION</span>
              <p style={{ color: 'var(--text2)', fontStyle: 'italic' }}>{question.explanation}</p>
            </div>
          )}

          {/* Confirm button */}
          {!confirmed && (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleConfirm}
              disabled={selected === null}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Confirm Answer
            </button>
          )}

          {confirmed && (
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text3)', animation: 'pulse 1s infinite' }}>
              {current + 1 < quiz.questions.length ? 'Advancing to next question...' : 'Calculating results...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--accent)' }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
    </div>
  );
}
