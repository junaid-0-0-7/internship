import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import QuizCard from '../components/QuizCard';

const CATEGORIES = ['All', 'General', 'Science', 'History', 'Technology', 'Arts', 'Sports', 'Geography', 'Literature', 'Mathematics'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const r = await axios.get('/api/quizzes', {
        params: { search, category, difficulty, page, limit: 12 }
      });
      setQuizzes(r.data.quizzes);
      setTotalPages(r.data.pages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuizzes(); }, [search, category, difficulty, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '48px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="label">Explore</p>
            <h1 className="section-title">QUIZ LIBRARY</h1>
          </div>
          <Link className="btn btn-primary" to="/create">✦ Create Quiz</Link>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 0, flex: '1 1 260px', minWidth: 200 }}>
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search quizzes..."
              style={{ borderRadius: 'var(--radius) 0 0 var(--radius)', borderRight: 'none' }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 var(--radius) var(--radius) 0', padding: '10px 16px' }}>
              ⌕
            </button>
          </form>

          {/* Category */}
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
            style={{ width: 'auto', minWidth: 120 }}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          {/* Difficulty */}
          <select
            value={difficulty}
            onChange={e => { setDifficulty(e.target.value); setPage(1); }}
            style={{ width: 'auto', minWidth: 110 }}
          >
            {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="loading">Loading quizzes...</div>
        ) : quizzes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>◌</span>
            <p style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>No quizzes found</p>
            <Link className="btn btn-outline" to="/create" style={{ display: 'inline-flex', marginTop: 24 }}>Create the first one</Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}>
            {quizzes.map((quiz, i) => (
              <div key={quiz._id} style={{ animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}>
                <QuizCard quiz={quiz} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text3)', padding: '7px 16px' }}>
              {page} / {totalPages}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
