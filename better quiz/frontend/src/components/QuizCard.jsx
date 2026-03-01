import React from 'react';
import { Link } from 'react-router-dom';

const DIFF_COLORS = { Easy: 'green', Medium: 'blue', Hard: 'red' };

export default function QuizCard({ quiz, onDelete, showActions }) {
  const diffColor = DIFF_COLORS[quiz.difficulty] || 'blue';

  return (
    <div className="card" style={{
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      height: '100%',
    }}>
      {/* Top tags */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span className={`tag tag-${diffColor}`}>{quiz.difficulty}</span>
        <span className="tag">{quiz.category}</span>
      </div>

      {/* Title */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          letterSpacing: '0.03em',
          color: 'var(--text)',
          lineHeight: 1.2,
          marginBottom: 8,
        }}>
          {quiz.title}
        </h3>
        {quiz.description && (
          <p style={{
            color: 'var(--text3)',
            fontSize: 15,
            fontStyle: 'italic',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {quiz.description}
          </p>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <Stat label="Questions" value={quiz.questions?.length || 0} />
        <Stat label="Attempts" value={quiz.attemptCount || 0} />
        {quiz.timeLimit > 0 && <Stat label="Time" value={`${quiz.timeLimit / 60}m`} />}
      </div>

      {/* Creator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' }}>
          by {quiz.creator?.username || 'Anonymous'}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {showActions && (
            <>
              <Link className="btn btn-ghost btn-sm" to={`/edit/${quiz._id}`}>Edit</Link>
              {onDelete && (
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(quiz._id)}>Delete</button>
              )}
            </>
          )}
          <Link className="btn btn-primary btn-sm" to={`/quiz/${quiz._id}`}>Take Quiz</Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--accent)', fontWeight: 500 }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
    </div>
  );
}
