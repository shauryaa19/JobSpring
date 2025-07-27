import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const DropdownSelect = ({
  label,
  value,
  options = [],
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || { label: placeholder };
  
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'dropdown-small';
      case 'large':
        return 'dropdown-large';
      default:
        return 'dropdown-medium';
    }
  };

  return (
    <div className={`dropdown-select ${getSizeClasses()} ${className}`} ref={dropdownRef}>
      {label && <label className="dropdown-label">{label}</label>}
      <div className="dropdown-container">
        <button
          type="button"
          className={`dropdown-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={handleToggle}
          disabled={disabled}
        >
          <span className="dropdown-value">{selectedOption.label}</span>
          <ChevronDown size={14} className={`dropdown-icon ${isOpen ? 'rotated' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="dropdown-menu">
            <div 
              className="dropdown-option"
              onClick={() => handleSelect('')}
            >
              {placeholder}
            </div>
            {options.map((option, index) => (
              <div
                key={index}
                className={`dropdown-option ${value === option.value ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownSelect; 