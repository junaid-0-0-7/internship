import React from 'react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    const posted = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div 
      className={`job-card ${job.featured ? 'featured' : ''}`}
      onClick={() => navigate(`/job/${job._id}`)}
    >
      {job.featured && <div className="featured-badge">FEATURED</div>}
      
      <div className="job-header">
        <h3 className="job-title">{job.title}</h3>
        <p className="job-company">{job.company}</p>
        <p className="job-location">📍 {job.location}</p>
      </div>

      <div className="job-meta">
        <span className="meta-tag">{job.type}</span>
        {job.salary && <span className="meta-tag">💰 {job.salary}</span>}
      </div>

      <p className="job-description">{job.description}</p>

      {job.tags && job.tags.length > 0 && (
        <div className="job-tags">
          {job.tags.slice(0, 4).map((tag, index) => (
            <span key={index} className="job-tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="job-footer">
        <span className="job-posted">{formatDate(job.postedDate)}</span>
        <button className="btn-apply" onClick={(e) => {
          e.stopPropagation();
          if (job.applicationUrl) {
            window.open(job.applicationUrl, '_blank');
          }
        }}>
          Apply Now →
        </button>
      </div>
    </div>
  );
};

export default JobCard;
