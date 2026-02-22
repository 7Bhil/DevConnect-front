const API_BASE_URL = 'http://localhost:5000/api';

export const globalSearch = async (query) => {
  if (!query || query.trim().length < 2) return { projects: [], talents: [], jobs: [] };
  
  const queryParams = new URLSearchParams({ search: query.trim() });
  const response = await Promise.all([
    fetch(`${API_BASE_URL}/projects?${queryParams.toString()}`),
    fetch(`${API_BASE_URL}/talents?search=${query.trim()}`),
    fetch(`${API_BASE_URL}/jobs?${queryParams.toString()}`)
  ]);
  
  const [projectsRes, talentsRes, jobsRes] = response;
  
  const projects = projectsRes.ok ? await projectsRes.json() : [];
  const talents = talentsRes.ok ? await talentsRes.json() : [];
  const jobs = jobsRes.ok ? (await jobsRes.json()).jobs || await jobsRes.json() : [];
  
  return { projects, talents, jobs };
};

export const fetchJobs = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add filters to query params
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== 'all') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const url = queryParams.toString() 
    ? `${API_BASE_URL}/jobs?${queryParams.toString()}` 
    : `${API_BASE_URL}/jobs`;
    
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch jobs');
  return response.json();
};

export const fetchTalents = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add filters to query params
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== 'all') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const url = queryParams.toString() 
    ? `${API_BASE_URL}/talents?${queryParams.toString()}` 
    : `${API_BASE_URL}/talents`;
    
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch talents');
  return response.json();
};

export const applyToJob = async (jobData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(jobData)
  });
  if (!response.ok) throw new Error('Failed to apply to job');
  return response.json();
};

export const getMyApplications = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/applications/my`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch applications');
  return response.json();
};

export const getJobApplications = async (jobId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/applications/job/${jobId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch job applications');
  return response.json();
};

export const updateApplicationStatus = async (applicationId, status, notes) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status, notes })
  });
  if (!response.ok) throw new Error('Failed to update application status');
  return response.json();
};

export const getApplicationStats = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/applications/stats/my`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch application stats');
  return response.json();
};

export const getUserById = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

export const fetchProjects = async () => {
  const response = await fetch(`${API_BASE_URL}/projects`);
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
};

export const fetchMyProjects = async (token) => {
  const response = await fetch(`${API_BASE_URL}/projects/my`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch my projects');
  return response.json();
};

export const createProject = async (projectData, token) => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  });
  if (!response.ok) throw new Error('Failed to create project');
  return response.json();
};

export const fetchProjectById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`);
  if (!response.ok) throw new Error('Failed to fetch project');
  return response.json();
};

export const deleteProject = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete project');
  return response.json();
};

export const updateProject = async (id, projectData, token) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  });
  if (!response.ok) throw new Error('Failed to update project');
  return response.json();
};

export const createJob = async (jobData, token) => {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(jobData)
  });
  if (!response.ok) throw new Error('Failed to create job');
  return response.json();
};

export const updateProfile = async (profileData, token) => {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
};

// Notifications API
export const fetchNotifications = async (page = 1, limit = 20) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/notifications?page=${page}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch notifications');
  return response.json();
};

export const markNotificationAsRead = async (notificationId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to mark notification as read');
  return response.json();
};

export const markAllNotificationsAsRead = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to mark all notifications as read');
  return response.json();
};

export const deleteNotification = async (notificationId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete notification');
  return response.json();
};

export const getUnreadNotificationsCount = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch unread count');
  return response.json();
};

export const createNotification = async (notificationData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(notificationData)
  });
  if (!response.ok) throw new Error('Failed to create notification');
  return response.json();
};
