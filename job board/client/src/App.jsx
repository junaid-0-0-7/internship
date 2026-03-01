import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import JobDetailPage from './pages/JobDetailPage';
import PostJobPage from './pages/PostJobPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/job/:id" element={<JobDetailPage />} />
            <Route path="/post-job" element={<PostJobPage />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <div className="footer-content">
            <div className="footer-glitch">FIND_YOUR_NEXT_MOVE</div>
            <p className="footer-text">© 2026 DARK JOBS • WHERE TALENT MEETS OPPORTUNITY</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
