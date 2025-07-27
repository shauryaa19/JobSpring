// Mock API Service
import { JOBS_DATA } from '../data/jobs';
import { PROFILE_DATA, PROFILE_STATS, APPLICATIONS_DATA } from '../data/profile';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate network errors (10% chance)
const simulateError = () => Math.random() < 0.1;


class MockApiService {
  // Jobs API
  async getJobs(params = {}) {
    await delay(800); // Simulate network delay
    
    if (simulateError()) {
      throw new Error('Failed to fetch jobs');
    }

    let filteredJobs = [...JOBS_DATA];

    // Apply filters
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (params.location) {
      const locationTerm = params.location.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(locationTerm)
      );
    }

    if (params.jobType) {
      filteredJobs = filteredJobs.filter(job => job.type === params.jobType);
    }

    if (params.experience) {
      filteredJobs = filteredJobs.filter(job => job.experience === params.experience);
    }

    if (params.remote) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes('remote')
      );
    }

    // Dynamic pagination based on screen size
    const getDynamicLimit = () => {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        
        // Mobile: 1 column, 6-8 cards
        if (width < 768) {
          return 8;
        }
        // Tablet: 2 columns, 8-12 cards
        else if (width < 1024) {
          return 12;
        }
        // Desktop: 3+ columns, 12-18 cards
        else {
          return 18;
        }
      }
      
      // Default fallback
      return 12;
    };

    // Simulate pagination with dynamic limit
    const page = params.page || 1;
    const limit = params.limit || getDynamicLimit();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    return {
      data: paginatedJobs,
      pagination: {
        page,
        limit,
        total: filteredJobs.length,
        totalPages: Math.ceil(filteredJobs.length / limit),
        hasNext: endIndex < filteredJobs.length,
        hasPrev: page > 1
      }
    };
  }

  async getJobById(id) {
    await delay(500);
    
    if (simulateError()) {
      throw new Error('Failed to fetch job details');
    }

    const job = JOBS_DATA.find(job => job.id === id);
    
    if (!job) {
      throw new Error('Job not found');
    }

    return { data: job };
  }

  async saveJob(jobId) {
    await delay(300);
    
    if (simulateError()) {
      throw new Error('Failed to save job');
    }

    return { 
      success: true, 
      message: 'Job saved successfully',
      data: { jobId, savedAt: new Date().toISOString() }
    };
  }

  async applyToJob() {
    await delay(1000);
    
    if (simulateError()) {
      throw new Error('Failed to apply to job');
    }
    
    // Simulate successful application
    return {
      success: true,
      message: 'Application submitted successfully',
      applicationId: `app_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  }

  // Profile API
  async getProfile() {
    await delay(600);
    
    if (simulateError()) {
      throw new Error('Failed to fetch profile');
    }

    return { data: PROFILE_DATA };
  }

  async updateProfile(profileData) {
    await delay(800);
    
    if (simulateError()) {
      throw new Error('Failed to update profile');
    }

    return {
      success: true,
      message: 'Profile updated successfully',
      data: { ...PROFILE_DATA, ...profileData }
    };
  }

  async getProfileStats() {
    await delay(400);
    
    if (simulateError()) {
      throw new Error('Failed to fetch profile stats');
    }

    return { data: PROFILE_STATS };
  }

  // Applications API
  async getApplications() {
    await delay(700);
    
    if (simulateError()) {
      throw new Error('Failed to fetch applications');
    }

    return { data: APPLICATIONS_DATA };
  }


  // Search API
  async searchJobs(query, filters = {}) {
    await delay(900);
    
    if (simulateError()) {
      throw new Error('Search failed');
    }

    return this.getJobs({ search: query, ...filters });
  }


  // Chatbot API
  async sendChatMessage(message) {
    await delay(1200);
    
    if (simulateError()) {
      throw new Error('Failed to send message');
    }

    // Simple response logic
    const responses = {
      'job': 'I can help you find jobs that match your skills and preferences. What type of role are you looking for?',
      'resume': 'Great question! A strong profile is key to getting noticed. Make sure to include relevant keywords and highlight your achievements.',
      'salary': 'Salary research is important! I recommend checking industry standards for your role and location.',
      'interview': 'Interview preparation is crucial! I suggest researching the company and practicing common questions.',
      'default': 'I understand you\'re looking for assistance with your job search. How can I help you today?'
    };

    const lowerMessage = message.toLowerCase();
    let response = responses.default;

    if (lowerMessage.includes('job') || lowerMessage.includes('position')) {
      response = responses.job;
    } else if (lowerMessage.includes('resume') || lowerMessage.includes('profile')) {
      response = responses.resume;
    } else if (lowerMessage.includes('salary') || lowerMessage.includes('pay')) {
      response = responses.salary;
    } else if (lowerMessage.includes('interview')) {
      response = responses.interview;
    }

    return {
      data: {
        message: response,
        timestamp: new Date().toISOString()
      }
    };
  }
}

// Create singleton instance
const apiService = new MockApiService();

export default apiService; 