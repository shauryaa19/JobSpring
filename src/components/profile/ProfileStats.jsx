import React from 'react';
import { Eye, FileText, Heart, Briefcase } from 'lucide-react';

const IconMap = {
  Eye: Eye,
  FileText: FileText,
  Heart: Heart,
  Briefcase: Briefcase
};

const ProfileStats = ({ stats }) => {
  return (
    <div className="profile-stats">
      {stats.map((stat, index) => {
        const IconComponent = IconMap[stat.icon];
        return (
          <div key={index} className="stat-card">
            <div className="stat-icon">
              {IconComponent && <IconComponent size={20} />}
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileStats; 