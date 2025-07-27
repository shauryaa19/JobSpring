import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (pagination.hasPrev) {
      onPageChange(pagination.page - 1);
    }
  };

  const handleNext = () => {
    if (pagination.hasNext) {
      onPageChange(pagination.page + 1);
    }
  };

  return (
    <div className="pagination">
      <button 
        className="btn btn-secondary"
        disabled={!pagination.hasPrev}
        onClick={handlePrevious}
      >
        <ChevronLeft size={16} />
      </button>
      
      <span className="pagination-info">
        Page {pagination.page} of {pagination.totalPages} 
      </span>
      
      <button 
        className="btn btn-secondary"
        disabled={!pagination.hasNext}
        onClick={handleNext}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination; 