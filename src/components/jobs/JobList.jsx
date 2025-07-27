import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Search, SlidersHorizontal, Loader2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import JobCard from './JobCard';
import { FiltersPanel, Pagination } from '.';
import { LoadingState, ErrorState } from '../ui';
import { JOB_FILTERS } from '../../data/jobs';
import { useJobs, useJobActions } from '../../hooks/useApi';

const JobList = ({ searchQuery, selectedLocation, onJobClick }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobType: '',
    salaryRange: '',
    experience: '',
    remote: false
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { jobs, pagination, loading, error, fetchJobs, searchJobs, clearError } = useJobs();
  const { saveJob, applyToJob } = useJobActions();

  const getDynamicLimit = useCallback(() => {
    const width = window.innerWidth;
    
    if (width < 768) {
      return 4;
    }
    else if (width < 1024) {
      return 8;
    }
    else {
      return 12;
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newLimit = getDynamicLimit();
      const currentLimit = pagination?.limit || 12;
      
      if (newLimit !== currentLimit) {
        setCurrentPage(1);
        fetchDataWithLimit(newLimit);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getDynamicLimit, pagination?.limit]);

  const fetchDataWithLimit = useCallback(async (limit) => {
    try {
      if (searchQuery || selectedLocation) {
        await searchJobs(searchQuery, { 
          location: selectedLocation, 
          ...filters, 
          page: currentPage,
          limit 
        });
      } else {
        await fetchJobs({ ...filters, page: currentPage, limit });
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
  }, [searchQuery, selectedLocation, filters, currentPage, fetchJobs, searchJobs]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const limit = getDynamicLimit();
        if (searchQuery || selectedLocation) {
          await searchJobs(searchQuery, { 
            location: selectedLocation, 
            ...filters, 
            page: currentPage,
            limit 
          });
        } else {
          await fetchJobs({ ...filters, page: currentPage, limit });
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      }
    };

    fetchData();
  }, [searchQuery, selectedLocation, filters, currentPage, fetchJobs, searchJobs, getDynamicLimit]);

  const handleRetry = async () => {
    clearError();
    try {
      const limit = getDynamicLimit();
      if (searchQuery || selectedLocation) {
        await searchJobs(searchQuery, { 
          location: selectedLocation, 
          ...filters, 
          page: currentPage,
          limit 
        });
      } else {
        await fetchJobs({ ...filters, page: currentPage, limit });
      }
    } catch (err) {
      console.error('Failed to retry fetch jobs:', err);
    }
  };

  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    const limit = getDynamicLimit();
    
    try {
      if (searchQuery || selectedLocation) {
        await searchJobs(searchQuery, { 
          location: selectedLocation, 
          ...filters, 
          page: newPage,
          limit 
        });
      } else {
        await fetchJobs({ ...filters, page: newPage, limit });
      }
    } catch (err) {
      console.error('Failed to change page:', err);
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      await saveJob(jobId);
      console.log('Job saved successfully');
    } catch (err) {
      console.error('Failed to save job:', err);
    }
  };

  const handleApplyToJob = async (jobId) => {
    try {
      await applyToJob(jobId);
      console.log('Application submitted successfully');
    } catch (err) {
      console.error('Failed to apply to job:', err);
    }
  };

  const handleJobCardClick = (jobId) => {
    onJobClick && onJobClick(jobId);
  };

  if (error) {
    return (
      <section className="job-list-section">
        <div className="container">
          <ErrorState 
            icon={Search}
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

  if (loading) {
    return (
      <section className="job-list-section">
        <div className="container">
          <LoadingState 
            title="Loading jobs..."
            description="Please wait while we fetch the latest opportunities"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="job-list-section">
      <div className="container">
        <div className="section-header">
          <div className="section-title-group">
            <h2 className="section-title">
              {searchQuery || selectedLocation ? 'Search Results' : 'Featured Jobs'}
            </h2>
            <p className="section-subtitle">
              {loading ? 'Loading...' : `${pagination?.total || jobs.length} job${(pagination?.total || jobs.length) !== 1 ? 's' : ''} found`}
            </p>
          </div>
          
          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        {showFilters && (
          <FiltersPanel 
            filters={filters} 
            setFilters={setFilters} 
            jobTypes={JOB_FILTERS.jobTypes} 
            salaryRanges={JOB_FILTERS.salaryRanges} 
            experienceLevels={JOB_FILTERS.experienceLevels}
          />
        )}

        <div className="jobs-grid">
          {jobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job}
              onSave={handleSaveJob}
              onApply={handleApplyToJob}
              onCardClick={handleJobCardClick}
            />
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="no-results">
            <Search size={48} />
            <h3>No jobs found</h3>
            <p>Try adjusting your search criteria or filters to find more results.</p>
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <Pagination 
            pagination={pagination} 
            onPageChange={handlePageChange} 
          />
        )}
      </div>
    </section>
  );
};

export default JobList;