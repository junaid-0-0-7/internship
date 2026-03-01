import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/PostJob.css';

const PostJobPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: '',
    tags: '',
    applicationUrl: '',
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(req => req.trim() !== ''),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      };

      await axios.post('/api/jobs', jobData);
      alert('Job posted successfully!');
      navigate('/');
    } catch (err) {
      setError('Failed to post job. Please try again.');
      console.error('Error posting job:', err);
      setLoading(false);
    }
  };

  return (
    <div className="post-job-page">
      <div className="post-job-container">
        <div className="post-job-header">
          <h1 className="post-job-title">POST A NEW POSITION</h1>
          <p className="post-job-subtitle">Fill out the form below to list your opportunity</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="post-job-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Job Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="e.g. Senior Frontend Developer"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company" className="form-label">Company *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Company name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="e.g. Remote, San Francisco, CA"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type" className="form-label">Job Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="salary" className="form-label">Salary Range</label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. $80k - $120k"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Job Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="form-textarea"
              rows="8"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="requirements" className="form-label">Requirements</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              className="form-textarea"
              rows="6"
              placeholder="Enter each requirement on a new line..."
            />
            <small className="form-hint">One requirement per line</small>
          </div>

          <div className="form-group">
            <label htmlFor="tags" className="form-label">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="form-input"
              placeholder="React, Node.js, MongoDB, etc."
            />
            <small className="form-hint">Separate tags with commas</small>
          </div>

          <div className="form-group">
            <label htmlFor="applicationUrl" className="form-label">Application URL *</label>
            <input
              type="url"
              id="applicationUrl"
              name="applicationUrl"
              value={formData.applicationUrl}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="https://company.com/careers/apply"
            />
          </div>

          <div className="form-group-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span>Mark as featured position</span>
            </label>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Job →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
