import React from 'react';
import { Mail, Phone, MapPin, GraduationCap } from 'lucide-react';
import { SKILLS_DATA } from '../../data/profile';

const ProfileOverview = ({ profile }) => {
  return (
    <div className="overview-content">
      <div className="content-section">
        <h3 className="section-title">About</h3>
        <p className="bio-text">{profile.bio}</p>
      </div>

      <div className="content-section">
        <h3 className="section-title">Contact Information</h3>
        <div className="contact-info">
          <div className="contact-item">
            <Mail size={18} />
            <span>{profile.email}</span>
          </div>
          <div className="contact-item">
            <Phone size={18} />
            <span>{profile.phone}</span>
          </div>
          <div className="contact-item">
            <MapPin size={18} />
            <span>{profile.location}</span>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h3 className="section-title">Education</h3>
        <div className="education-item">
          <GraduationCap size={18} />
          <span>{profile.education}</span>
        </div>
      </div>

      <div className="content-section">
        <h3 className="section-title">Skills</h3>
        <div className="skills-list">
          {SKILLS_DATA.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview; 