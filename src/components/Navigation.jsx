import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Moon, Sun, Briefcase, LogOut, Settings } from 'lucide-react';
import { NAVIGATION_CONSTANTS } from '../data/ui';
import { useProfile } from '../hooks/useApi';
import { UserAvatar } from './ui';

const Navigation = ({ isDark, toggleTheme }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, fetchProfile } = useProfile();

  // Fetch profile data on component mount only if not already available
  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [fetchProfile, profile]);

  const iconMap = {
    Briefcase
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
    setShowProfileDropdown(false);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          {(() => {
            const IconComponent = iconMap[NAVIGATION_CONSTANTS.brand.icon];
            return <IconComponent className="brand-icon" />;
          })()}
          <span className="brand-text">{NAVIGATION_CONSTANTS.brand.name}</span>
        </Link>
        
        <div className="nav-menu">
          {NAVIGATION_CONSTANTS.menuItems
            .filter(item => item.key !== 'profile') // Remove profile from navbar
            .map((item) => {
              const IconComponent = item.icon ? iconMap[item.icon] : null;
              const path = item.key === 'home' ? '/' : `/${item.key}`;
              
              return (
                <Link 
                  key={item.key}
                  to={path}
                  className={`nav-link ${isActive(path) ? 'active' : ''}`}
                >
                  {IconComponent && <IconComponent size={16} />}
                  {item.label}
                </Link>
              );
            })}
        </div>

        <div className="nav-actions">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {/* User Avatar Dropdown */}
          <div className="user-avatar-container" ref={dropdownRef}>
            <button 
              className="user-avatar"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              aria-label="User profile"
            >
              <UserAvatar profile={profile} size="medium" />
            </button>
            
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <div className="user-info">
                    <div className="user-name">{profile?.name}</div>
                    <div className="user-email">{profile?.email}</div>
                  </div>
                </div>
                
                <div className="profile-dropdown-menu">
                  <button 
                    className="profile-dropdown-item"
                    onClick={handleProfileClick}
                  >
                    <User size={16} />
                    Profile
                  </button>
                  <button className="profile-dropdown-item">
                    <Settings size={16} />
                    Settings
                  </button>
                  <div className="profile-dropdown-divider"></div>
                  <button className="profile-dropdown-item">
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;