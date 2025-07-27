import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({
  icon: Icon = AlertCircle,
  title = 'Something went wrong',
  message = 'An error occurred while loading data',
  onRetry,
  retryLabel = 'Try Again',
  isRetrying = false,
  className = '',
  showRetryButton = true
}) => {
  return (
    <div className={`error-state ${className}`}>
      {Icon && <Icon size={48} />}
      <h3>{title}</h3>
      <p>{message}</p>
      {showRetryButton && onRetry && (
        <button 
          className="btn btn-primary"
          onClick={onRetry}
          disabled={isRetrying}
        >
          <RefreshCw size={16} className={isRetrying ? 'animate-spin' : ''} />
          {isRetrying ? 'Retrying...' : retryLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorState; 