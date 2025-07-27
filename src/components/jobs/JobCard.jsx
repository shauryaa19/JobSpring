import React from 'react';
import { MapPin, Clock, DollarSign, CheckCircle, AlertCircle, XCircle, User } from 'lucide-react';

const JobCard = ({ job, onSave, onApply, onCardClick }) => {
  const handleCardClick = (e) => {
    // Don't trigger card click if clicking on action buttons
    if (e.target.closest('.card-actions') || e.target.closest('.save-job-btn')) {
      return;
    }
    onCardClick && onCardClick(job.id);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    onSave && onSave(job.id);
  };

  const handleApplyClick = (e) => {
    e.stopPropagation();
    onApply && onApply(job.id);
  };

  const getCompatibilityData = (percentage) => {
    if (percentage >= 70) {
      return {
        color: 'var(--success)',
        icon: CheckCircle,
        label: 'Excellent Match'
      };
    } else if (percentage >= 40) {
      return {
        color: 'var(--warning)',
        icon: AlertCircle,
        label: 'Good Match'
      };
    } else {
      return {
        color: 'var(--error)',
        icon: XCircle,
        label: 'Fair Match'
      };
    }
  };

  const compatibilityData = getCompatibilityData(job.compatibility);
  const CompatibilityIcon = compatibilityData.icon;

  const formatExperience = (experience) => {
    switch (experience) {
      case 'entry':
        return 'Entry Level';
      case 'mid':
        return 'Mid Level';
      case 'senior':
        return 'Senior Level';
      case 'lead':
        return 'Lead/Principal';
      default:
        return experience;
    }
  };

  return (
    <div className="job-card" onClick={handleCardClick}>
      {/* Header Section */}
      <div className="job-card-header">
        <div className="company-info">
          <div className="company-logo">
            {job.logo ? (
              <img src={job.logo} alt={`${job.company} logo`} />
            ) : (
              <div className="logo-placeholder">
                {job.company.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="job-details">
            <h3 className="job-title">{job.title}</h3>
            <p className="company-name">{job.company}</p>
          </div>
        </div>
        
        <div 
          className="compatibility-indicator"
          title={compatibilityData.label}
        >
          <CompatibilityIcon 
            size={24} 
            style={{ color: compatibilityData.color }}
            className="compatibility-icon"
          />
          <span 
            className="compatibility-percentage"
            style={{ color: compatibilityData.color }}
          >
            {job.compatibility}%
          </span>
        </div>
      </div>

      {/* Meta Information Section */}
      <div className="job-meta">
        <div className="meta-item">
          <MapPin size={16} />
          <span>{job.location}</span>
        </div>
        <div className="meta-item">
          <DollarSign size={16} />
          <span>{job.salary}</span>
        </div>
        <div className="meta-item">
          <Clock size={16} />
          <span>{job.type}</span>
        </div>
        <div className="meta-item">
          <User size={16} />
          <span>{formatExperience(job.experience)}</span>
        </div>
      </div>

      {/* Tags Section - Fixed Height */}
      <div className="job-tags-container">
        <div className="job-tags">
          {job.tags.map((tag, index) => (
            <span key={index} className="job-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="job-card-footer">
        <span className="posted-time">{job.posted}</span>
        <div className="card-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleSaveClick}
          >
            Save
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleApplyClick}
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;