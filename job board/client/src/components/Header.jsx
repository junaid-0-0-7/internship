import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="site-header">
      <div className="header-content">
        <Link to="/" className="logo">
          DARK JOBS
        </Link>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Browse Jobs</Link></li>
            <li><Link to="/post-job">Post a Job</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
