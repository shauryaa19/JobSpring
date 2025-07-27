import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ 
  size = 48, 
  title = 'Loading...', 
  description = 'Please wait while we fetch your data',
  className = '',
  variant = 'default' // 'default', 'inline', 'small'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'inline':
        return 'loading-state-inline';
      case 'small':
        return 'loading-state-small';
      default:
        return 'loading-state';
    }
  };

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      <Loader2 className="animate-spin" size={size} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default LoadingState; 