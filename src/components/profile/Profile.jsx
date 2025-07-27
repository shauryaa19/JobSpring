import React, { useState, useEffect } from 'react';
import { 
  User, 
  Edit3, 
  Download,
  RefreshCw,
  MapPinIcon,
  BriefcaseIcon
} from 'lucide-react';
import { useProfile, useApplications } from '../../hooks/useApi';
import { useModal } from '../../hooks';
import { LoadingState, ErrorState } from '../ui';
import { 
  EditProfileModal, 
  ProfileStats, 
  ProfileOverview, 
  ApplicationsList 
} from './index';
import { getInitials } from '../../utils';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { isOpen: isEditModalOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  
  const { profile, stats, loading: profileLoading, error: profileError, fetchProfile, fetchStats, updateProfile, clearError: clearProfileError } = useProfile();
  const { applications, loading: appsLoading, error: appsError, fetchApplications, clearError: clearAppsError } = useApplications();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchProfile(),
          fetchStats(),
          fetchApplications()
        ]);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      }
    };

    fetchData();
  }, [fetchProfile, fetchStats, fetchApplications]);

  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        title: profile.title || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        experience: profile.experience || '',
        education: profile.education || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const handleRetryProfile = async () => {
    try {
      clearProfileError();
      
      // Re-fetch profile and stats data (this will set loading states automatically)
      await Promise.all([
        fetchProfile(),
        fetchStats()
      ]);
    } catch (err) {
      console.error('Failed to retry fetch profile:', err);
    }
  };

  const handleRetryApplications = async () => {
    try {
      clearAppsError();
      
      // Re-fetch applications data (this will set loading states automatically)
      await fetchApplications();
    } catch (err) {
      console.error('Failed to retry fetch applications:', err);
    }
  };

  const handleEditProfile = () => {
    openEditModal();
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleCloseModal = () => {
    closeEditModal();
    setSaveError(null);
    setSaveSuccess(false);
    // Reset form to current profile data
    if (profile) {
      setEditForm({
        name: profile.name || '',
        title: profile.title || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        experience: profile.experience || '',
        education: profile.education || '',
        bio: profile.bio || ''
      });
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await updateProfile(editForm);
      setSaveSuccess(true);
      closeEditModal();
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      setSaveError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };



  if (profileError || appsError) {
    return (
      <section className="profile-section">
        <div className="container">
          <ErrorState
            icon={User}
            title="Something went wrong"
            message={profileError || appsError}
            onRetry={profileError ? handleRetryProfile : handleRetryApplications}
            isRetrying={profileLoading || appsLoading}
            retryLabel={profileError ? 'Retry Profile' : 'Retry Applications'}
          />
        </div>
      </section>
    );
  }

  if (profileLoading || !profile) {
    return (
      <section className="profile-section">
        <div className="container">
          <LoadingState 
            title="Loading profile..."
            description="Please wait while we fetch your information"
          />
        </div>
      </section>
    );
  }

  return (
    <>
    <section className="profile-section">
      <div className="container">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                  {getInitials(profile.name)}
                </div>
            </div>
            
            <div className="profile-details">
                <h1 className="profile-name">{profile.name}</h1>
                <p className="profile-title">{profile.title}</p>
              <div className="profile-meta">
                <div className="meta-item">
                  <MapPinIcon size={16} />
                    <span>{profile.location}</span>
                </div>
                <div className="meta-item">
                  <BriefcaseIcon size={16} />
                    <span>{profile.experience} experience</span>
                  </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn btn-secondary" onClick={handleEditProfile}>
              <Edit3 size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        <ProfileStats stats={stats} />

        <div className="profile-content">
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              Applications
            </button>
            <button 
              className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              Saved Jobs
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <ProfileOverview profile={profile} />
            )}

            {activeTab === 'applications' && (
              <ApplicationsList 
                applications={applications} 
                isLoading={appsLoading} 
              />
            )}

            {activeTab === 'saved' && (
              <div className="saved-content">
                <p className="empty-state">Your saved jobs will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        formData={editForm}
        onFormChange={handleInputChange}
        onSave={handleSaveProfile}
        isSaving={isSaving}
        error={saveError}
      />

      {/* Success Message */}
      {saveSuccess && (
        <div className="success-toast">
          <div className="success-content">
            <div className="success-icon">✓</div>
            <span>Profile updated successfully!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;