import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/home';
import { JobList } from '../components/jobs';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (query, location) => {
    const searchParams = new URLSearchParams();
    if (query) searchParams.set('q', query);
    if (location) searchParams.set('location', location);
    
    navigate(`/jobs?${searchParams.toString()}`);
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <>
      <Hero onSearch={handleSearch} />
      <JobList 
        searchQuery="" 
        selectedLocation="" 
        onJobClick={handleJobClick} 
      />
    </>
  );
};

export default HomePage; 