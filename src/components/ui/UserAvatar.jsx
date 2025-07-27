import React from 'react';
import { getInitials } from '../../utils';

const UserAvatar = ({ 
  profile, 
  size = 'medium', 
  className = '',
  showInitials = true 
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'avatar-small';
      case 'medium':
        return 'avatar-medium';
      case 'large':
        return 'avatar-large';
      default:
        return 'avatar-medium';
    }
  };

  const initials = profile?.name ? getInitials(profile.name) : '';

  return (
    <div className={`avatar-placeholder ${getSizeClass()} ${className}`}>
      {showInitials && initials ? initials : ''}
    </div>
  );
};

export default UserAvatar; 