import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { JobList } from '../components/jobs';

const JobsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const selectedLocation = searchParams.get('location') || '';

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    
    <JobList 
      searchQuery={searchQuery} 
      selectedLocation={selectedLocation} 
      onJobClick={handleJobClick} 
    />
  );
};

export default JobsPage; 