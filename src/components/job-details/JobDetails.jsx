import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  Bookmark, 
  Share2, 
  Building, 
  Calendar,
  Users,
  Globe,
  FileText,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useJobActions } from '../../hooks/useApi';
import apiService from '../../services/api';
import { LoadingState, ErrorState } from '../ui';

const JobDetails = ({ jobId, onBack }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { saveJob, applyToJob } = useJobActions();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getJobById(jobId);
        setJob(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const handleSaveJob = async () => {
    try {
      setIsSaving(true);
      await saveJob(jobId);
      console.log('Job saved successfully');
    } catch (err) {
      console.error('Failed to save job:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyToJob = async () => {
    try {
      setIsApplying(true);
      await applyToJob(jobId);
      console.log('Application submitted successfully');
    } catch (err) {
      console.error('Failed to apply to job:', err);
    } finally {
      setIsApplying(false);
    }
  };

  const handleRetry = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getJobById(jobId);
      setJob(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="job-details-section">
        <div className="container">
          <LoadingState 
            title="Loading job details..."
            description="Please wait while we fetch the job information"
          />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="job-details-section">
        <div className="container">
          <ErrorState 
            icon={FileText}
            title="Something went wrong"
            message={error}
            onRetry={handleRetry}
            retryLabel="Try Again"
            isRetrying={loading}
          />
        </div>
      </section>
    );
  }

  if (!job) {
    return (
      <section className="job-details-section">
        <div className="container">
          <ErrorState 
            icon={FileText}
            title="Job not found"
            message="The job you're looking for doesn't exist or has been removed."
            onRetry={onBack}
            retryLabel="Go Back"
            showRetryButton={true}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="job-details-section">
      <div className="container">
        {/* Header */}
        <div className="job-details-header">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
            Back to Jobs
          </button>
          
          <div className="header-actions">
            <button className="btn btn-secondary">
              <Share2 size={16} />
              <span className='header-action-text'>Share</span>
            </button>
            <button 
              className="btn btn-secondary"
              onClick={handleSaveJob}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Bookmark size={16} />
              )}
              <span className='header-action-text'>{isSaving ? 'Saving...' : 'Save Job'}</span>
            </button>
          </div>
        </div>

        {/* Job Content */}
        <div className="job-details-content">
          <div className="job-main-info">
            <div className="company-section">
              <div className="company-logo-large">
                {job.logo ? (
                  <img src={job.logo} alt={`${job.company} logo`} />
                ) : (
                  <div className="logo-placeholder-large">
                    {job.company.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="company-details">
                <h1 className="job-title-large">{job.title}</h1>
                <p className="company-name-large">{job.company}</p>
                <div className="job-meta-large">
                  <div className="meta-item-large">
                    <MapPin size={18} />
                    <span>{job.location}</span>
                  </div>
                  <div className="meta-item-large">
                    <DollarSign size={18} />
                    <span>{job.salary}</span>
                  </div>
                  <div className="meta-item-large">
                    <Clock size={18} />
                    <span>{job.type}</span>
                  </div>
                  <div className="meta-item-large">
                    <Calendar size={18} />
                    <span>Posted {job.posted}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="apply-section">
              <button 
                className="btn btn-primary apply-btn-large"
                onClick={handleApplyToJob}
                disabled={isApplying}
              >
                {isApplying ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Apply Now
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Job Description */}
          <div className="job-description-section">
            <h2>Job Description</h2>
            <div className="description-content">
              <p>{job.description}</p>
              
              <h3>Key Responsibilities</h3>
              <ul>
                <li>Develop and maintain scalable web applications using modern technologies</li>
                <li>Collaborate with cross-functional teams to deliver high-quality products</li>
                <li>Write clean, maintainable, and well-documented code</li>
                <li>Participate in code reviews and contribute to team best practices</li>
                <li>Stay up-to-date with industry trends and emerging technologies</li>
              </ul>

              <h3>Requirements</h3>
              <ul>
                <li>Bachelor's degree in Computer Science or related field</li>
                <li>3+ years of experience in frontend development</li>
                <li>Strong proficiency in React, TypeScript, and modern JavaScript</li>
                <li>Experience with responsive design and cross-browser compatibility</li>
                <li>Knowledge of version control systems (Git)</li>
              </ul>

              <h3>Nice to Have</h3>
              <ul>
                <li>Experience with Node.js and backend development</li>
                <li>Knowledge of testing frameworks (Jest, Cypress)</li>
                <li>Experience with cloud platforms (AWS, Azure)</li>
                <li>Understanding of CI/CD pipelines</li>
              </ul>
            </div>
          </div>

          {/* Skills & Tags */}
          <div className="skills-section">
            <h3>Required Skills</h3>
            <div className="skills-grid">
              {job.tags.map((tag, index) => (
                <span key={index} className="skill-tag-large">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Company Information */}
          <div className="company-info-section">
            <h3>About {job.company}</h3>
            <div className="company-stats">
              <div className="stat-item-large">
                <Building size={20} />
                <div>
                  <div className="stat-value-large">500+</div>
                  <div className="stat-label-large">Employees</div>
                </div>
              </div>
              <div className="stat-item-large">
                <Globe size={20} />
                <div>
                  <div className="stat-value-large">Global</div>
                  <div className="stat-label-large">Location</div>
                </div>
              </div>
              <div className="stat-item-large">
                <Users size={20} />
                <div>
                  <div className="stat-value-large">50+</div>
                  <div className="stat-label-large">Open Positions</div>
                </div>
              </div>
            </div>
            <p className="company-description">
              {job.company} is a leading technology company focused on innovation and growth. 
              We're looking for talented individuals who are passionate about technology and 
              want to make a difference in the world.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobDetails; 