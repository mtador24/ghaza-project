
import axios from 'axios';

const API_BASE_URL = '/api';

export async function getProjects() {
  const response = await axios.get(`${API_BASE_URL}/projects`);
  return response.data;
}

export async function getProjectById(id: string | number) {
  const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
  return response.data;
}

export async function getLatestDonations(limit = 5) {
  const response = await axios.get(`${API_BASE_URL}/donations/latest?limit=${limit}`);
  return response.data;
}

export async function getDonationStats() {
  const response = await axios.get(`${API_BASE_URL}/donations/stats`);
  return response.data;
}

export async function getMonthlyDonations(projectId?: string | number) {
  const url = projectId 
    ? `${API_BASE_URL}/donations/monthly?projectId=${projectId}`
    : `${API_BASE_URL}/donations/monthly`;
  
  const response = await axios.get(url);
  return response.data;
}
