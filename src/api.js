const API_BASE_URL = 'http://localhost:5000/api';

export const fetchJobs = async () => {
  const response = await fetch(`${API_BASE_URL}/jobs`);
  if (!response.ok) throw new Error('Failed to fetch jobs');
  return response.json();
};

export const fetchTalents = async () => {
  const response = await fetch(`${API_BASE_URL}/talents`);
  if (!response.ok) throw new Error('Failed to fetch talents');
  return response.json();
};

export const fetchMessages = async () => {
  const response = await fetch(`${API_BASE_URL}/messages`);
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
};
