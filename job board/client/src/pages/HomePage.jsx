import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const jobTypes = ['All', 'Full-time', 'Part-time', 'Remote', 'Contract', 'Freelance'];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/jobs');
      setJobs(response.data);
      setFilteredJobs(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load jobs. Please try again later.');
      setLoading(false);
      console.error('Error fetching jobs:', err);
    }
  };

  const handleSearch = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilter !== 'All') {
      filtered = filtered.filter(job => job.type === activeFilter);
    }

    setFilteredJobs(filtered);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    let filtered = jobs;

    if (filter !== 'All') {
      filtered = filtered.filter(job => job.type === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, activeFilter]);

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            DISCOVER YOUR<br />NEXT CAREER MOVE
          </h1>
          <p className="hero-subtitle">
            Connecting exceptional talent with groundbreaking opportunities in tech, design, and beyond.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{jobs.length}+</span>
              <span className="stat-label">Active Jobs</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Companies</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Candidates</span>
            </div>
          </div>
        </div>
      </section>

      <section className="search-section">
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search jobs by title, company, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn-search" onClick={handleSearch}>
              Search
            </button>
          </div>
          
          <div className="filter-tags">
            {jobTypes.map((type) => (
              <button
                key={type}
                className={`filter-tag ${activeFilter === type ? 'active' : ''}`}
                onClick={() => handleFilterClick(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="jobs-section">
        <div className="jobs-container">
          <h2 className="section-title">
            {activeFilter === 'All' ? 'All Positions' : `${activeFilter} Positions`}
          </h2>

          {loading && <div className="loading">Loading opportunities...</div>}
          
          {error && <div className="error-message">{error}</div>}

          {!loading && !error && filteredJobs.length === 0 && (
            <div className="error-message">
              No jobs found matching your criteria. Try adjusting your search.
            </div>
          )}

          {!loading && !error && filteredJobs.length > 0 && (
            <div className="jobs-grid">
              {filteredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;
