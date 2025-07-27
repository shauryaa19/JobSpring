import React from 'react';
import { DropdownSelect } from '../ui';

const FiltersPanel = ({ filters, setFilters, jobTypes, salaryRanges, experienceLevels }) => {
  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
  };

  return (
    <div className="filters-panel">
      <DropdownSelect
        label="Job Type"
        value={filters.jobType || ''}
        options={jobTypes}
        onChange={(value) => handleFilterChange('jobType', value)}
        placeholder="All Job Types"
        size="medium"
      />

      <DropdownSelect
        label="Salary Range"
        value={filters.salaryRange || ''}
        options={salaryRanges}
        onChange={(value) => handleFilterChange('salaryRange', value)}
        placeholder="All Salary Ranges"
        size="medium"
      />

      <DropdownSelect
        label="Experience"
        value={filters.experience || ''}
        options={experienceLevels}
        onChange={(value) => handleFilterChange('experience', value)}
        placeholder="All Experience Levels"
        size="medium"
      />

      <div className="filter-group">
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.remote || false}
            onChange={(e) => handleFilterChange('remote', e.target.checked)}
          />
          <span className="checkbox-label">Remote Only</span>
        </label>
      </div>
    </div>
  );
};

export default FiltersPanel; 