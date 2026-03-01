import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/JobDetail.css';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/jobs/${id}`);
      setJob(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load job details.');
      setLoading(false);
      console.error('Error fetching job details:', err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading">Loading job details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!job) return <div className="error-message">Job not found</div>;

  return (
    <div className="job-detail-page">
      <div className="job-detail-container">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Back to Jobs
        </button>

        <div className="job-detail-header">
          {job.featured && <div className="featured-badge-large">★ FEATURED POSITION</div>}
          <h1 className="job-detail-title">{job.title}</h1>
          <div className="job-detail-company-info">
            <h2 className="job-detail-company">{job.company}</h2>
            <p className="job-detail-location">📍 {job.location}</p>
          </div>
        </div>

        <div className="job-detail-meta">
          <div className="meta-item">
            <span className="meta-label">Job Type</span>
            <span className="meta-value">{job.type}</span>
          </div>
          {job.salary && (
            <div className="meta-item">
              <span className="meta-label">Salary</span>
              <span className="meta-value">{job.salary}</span>
            </div>
          )}
          <div className="meta-item">
            <span className="meta-label">Posted</span>
            <span className="meta-value">{formatDate(job.postedDate)}</span>
          </div>
        </div>

        {job.tags && job.tags.length > 0 && (
          <div className="job-detail-tags">
            {job.tags.map((tag, index) => (
              <span key={index} className="detail-tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="job-detail-content">
          <section className="content-section">
            <h3 className="section-heading">Job Description</h3>
            <div className="section-text">
              {job.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>

          {job.requirements && job.requirements.length > 0 && (
            <section className="content-section">
              <h3 className="section-heading">Requirements</h3>
              <ul className="requirements-list">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="job-detail-footer">
          <button 
            className="btn-apply-large"
            onClick={() => {
              if (job.applicationUrl) {
                window.open(job.applicationUrl, '_blank');
              } else {
                alert('Application link not available');
              }
            }}
          >
            Apply for this Position →
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
