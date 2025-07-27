import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'ghost'
  size = 'medium', // 'small', 'medium', 'large'
  isLoading = false,
  disabled = false,
  icon,
  iconPosition = 'left', // 'left', 'right'
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return 'btn-secondary';
      case 'ghost':
        return 'btn-ghost';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'btn-small';
      case 'large':
        return 'btn-large';
      default:
        return 'btn-medium';
    }
  };

  const isDisabled = disabled || isLoading;

  const renderIcon = () => {
    if (isLoading) {
      return <Loader2 size={16} className="animate-spin" />;
    }
    return icon;
  };

  const renderContent = () => {
    const iconElement = renderIcon();
    
    if (iconPosition === 'right') {
      return (
        <>
          {children && <span>{children}</span>}
          {iconElement && <span>{iconElement}</span>}
        </>
      );
    }
    
    return (
      <>
        {iconElement && <span>{iconElement}</span>}
        {children && <span>{children}</span>}
      </>
    );
  };

  return (
    <button
      type={type}
      className={`btn ${getVariantClass()} ${getSizeClass()} ${className}`}
      onClick={onClick}
      disabled={isDisabled}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button; 