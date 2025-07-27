import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium', // 'small', 'medium', 'large'
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = ''
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'modal-small';
      case 'large':
        return 'modal-large';
      default:
        return 'modal-medium';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-container ${getSizeClass()} ${className}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          {showCloseButton && (
            <button className="modal-close" onClick={onClose}>
              <X size={20} />
            </button>
          )}
        </div>
        
        <div className="modal-content">
          {children}
        </div>
        
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal; 