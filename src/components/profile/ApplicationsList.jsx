import React from 'react';
import { LoadingState } from '../ui';

const ApplicationsList = ({ applications, isLoading }) => {
  if (isLoading) {
    return (
      <LoadingState 
        size={32}
        title="Loading applications..."
        description=""
        variant="small"
      />
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="empty-state">
        <p>No applications found.</p>
      </div>
    );
  }

  return (
    <div className="applications-content">
      <div className="applications-list">
        {applications.map((app) => (
          <div key={app.id} className="application-card">
            <div className="application-info">
              <h4 className="application-position">{app.position}</h4>
              <p className="application-company">{app.company}</p>
              <p className="application-date">Applied on {app.date}</p>
            </div>
            <div className="application-status">
              <span className={`status-badge status-${app.statusColor}`}>
                {app.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsList; 