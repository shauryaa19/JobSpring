import { useState, useCallback, useRef, useEffect } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cache = useRef(new Map());

  const execute = useCallback(async (apiCall, cacheKey = null, cacheTime = 5 * 60 * 1000) => {
    // Check cache first
    if (cacheKey && cache.current.has(cacheKey)) {
      const cached = cache.current.get(cacheKey);
      if (Date.now() - cached.timestamp < cacheTime) {
        return cached.data;
      }
      cache.current.delete(cacheKey);
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      
      // Cache the result
      if (cacheKey) {
        cache.current.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });
      }

      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCache = useCallback((key = null) => {
    if (key) {
      cache.current.delete(key);
    } else {
      cache.current.clear();
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearCache,
    clearError
  };
};

// Specialized hooks for common API patterns
export const useJobs = () => {
  const { loading, error, execute, clearCache, clearError } = useApi();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);

  const fetchJobs = useCallback(async (params = {}) => {
    const cacheKey = `jobs_${JSON.stringify(params)}`;
    
    try {
      const result = await execute(
        () => import('../services/api').then(module => module.default.getJobs(params)),
        cacheKey
      );
      
      setJobs(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      throw err;
    }
  }, [execute]);

  const searchJobs = useCallback(async (query, filters = {}) => {
    const cacheKey = `search_${query}_${JSON.stringify(filters)}`;
    
    try {
      const result = await execute(
        () => import('../services/api').then(module => module.default.searchJobs(query, filters)),
        cacheKey
      );
      
      setJobs(result.data);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      console.error('Failed to search jobs:', err);
      throw err;
    }
  }, [execute]);

  return {
    jobs,
    pagination,
    loading,
    error,
    fetchJobs,
    searchJobs,
    clearCache,
    clearError
  };
};

// Shared profile cache across all useProfile instances
const sharedProfileCache = {
  data: null,
  timestamp: 0,
  listeners: new Set()
};

// Function to notify all listeners of profile changes
const notifyProfileListeners = (newProfile) => {
  sharedProfileCache.data = newProfile;
  sharedProfileCache.timestamp = Date.now();
  sharedProfileCache.listeners.forEach(listener => listener(newProfile));
};

export const useProfile = () => {
  const { loading, error, execute, clearCache, clearError } = useApi();
  const [profile, setProfile] = useState(sharedProfileCache.data);
  const [stats, setStats] = useState([]);

  // Add listener for profile changes
  useEffect(() => {
    const handleProfileChange = (newProfile) => {
      setProfile(newProfile);
    };

    sharedProfileCache.listeners.add(handleProfileChange);
    
    // Initialize with shared cache data if available
    if (sharedProfileCache.data && !profile) {
      setProfile(sharedProfileCache.data);
    }

    return () => {
      sharedProfileCache.listeners.delete(handleProfileChange);
    };
  }, []); // Remove profile dependency to avoid infinite loop

  const fetchProfile = useCallback(async () => {
    try {
      const result = await execute(
        () => import('../services/api').then(module => module.default.getProfile()),
        'profile'
      );
      
      setProfile(result.data);
      notifyProfileListeners(result.data);
      return result;
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      throw err;
    }
  }, [execute]);

  const fetchStats = useCallback(async () => {
    try {
      const result = await execute(
        () => import('../services/api').then(module => module.default.getProfileStats()),
        'profile_stats'
      );
      
      setStats(result.data);
      return result;
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      throw err;
    }
  }, [execute]);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const result = await execute(
        () => import('../services/api').then(module => module.default.updateProfile(profileData))
      );
      
      setProfile(result.data);
      notifyProfileListeners(result.data);
      clearCache('profile'); // Invalidate cache
      return result;
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  }, [execute, clearCache]);

  return {
    profile,
    stats,
    loading,
    error,
    fetchProfile,
    fetchStats,
    updateProfile,
    clearCache,
    clearError
  };
};

export const useApplications = () => {
  const { loading, error, execute, clearCache, clearError } = useApi();
  const [applications, setApplications] = useState([]);

  const fetchApplications = useCallback(async () => {
    try {
      const result = await execute(
        () => import('../services/api').then(module => module.default.getApplications()),
        'applications'
      );
      
      setApplications(result.data);
      return result;
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      throw err;
    }
  }, [execute]);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    clearCache,
    clearError
  };
};

export const useJobActions = () => {
  const { loading, error, execute, clearError } = useApi();

  const saveJob = useCallback(async (jobId) => {
    try {
      const result = await execute(
        () => import('../services/api').then(module => module.default.saveJob(jobId))
      );
      return result;
    } catch (err) {
      console.error('Failed to save job:', err);
      throw err;
    }
  }, [execute]);

  const applyToJob = useCallback(async (jobId, applicationData = {}) => {
    try {
      const result = await execute(
        () => import('../services/api').then(module => module.default.applyToJob(jobId, applicationData))
      );
      return result;
    } catch (err) {
      console.error('Failed to apply to job:', err);
      throw err;
    }
  }, [execute]);

  return {
    loading,
    error,
    saveJob,
    applyToJob,
    clearError
  };
}; 