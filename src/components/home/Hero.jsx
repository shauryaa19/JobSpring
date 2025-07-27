import React, { useState } from 'react';
import { Search, MapPin, Zap } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { HERO_CONSTANTS, ANIMATION_URLS } from '../../data/ui';

const Hero = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery, location);
  };

  const handlePopularSearchClick = (term) => {
    setSearchQuery(term);
    onSearch(term, location);
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={16} />
            <span>{HERO_CONSTANTS.badge.text}</span>
          </div>
          
          <h1 className="hero-title">
            {HERO_CONSTANTS.title.main}
            <span className="hero-highlight">{HERO_CONSTANTS.title.highlight}</span>
          </h1>
          
          <p className="hero-subtitle">
            {HERO_CONSTANTS.subtitle}
          </p>

          <form className="search-form" onSubmit={handleSubmit}>
            <div className="search-input-group">
              <div className="search-input-wrapper">
                <Search className="input-icon" size={20} />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="search-input-wrapper">
                <MapPin className="input-icon" size={20} />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <button type="submit" className="btn btn-primary search-btn">
                Search Jobs
              </button>
            </div>
          </form>

          <div className="popular-searches">
            <span className="popular-label">Popular searches:</span>
            <div className="popular-tags">
              {HERO_CONSTANTS.popularSearches.map((term, index) => (
                <button
                  key={index}
                  className="popular-tag"
                  onClick={() => handlePopularSearchClick(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-stats">
            {HERO_CONSTANTS.stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-animation">
          <DotLottieReact
            src={ANIMATION_URLS.hero}
            loop
            autoplay
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;