import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JobDetails } from '../components/job-details';

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/jobs');
  };

  return (
    <JobDetails jobId={jobId} onBack={handleBack} />
  );
};

export default JobDetailsPage; 