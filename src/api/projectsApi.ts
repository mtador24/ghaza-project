
import axios from 'axios';

const API_BASE_URL = '/api';

export async function getProjects() {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects`);
    // Ensure we return an array, even if the API doesn't return one
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return []; // Return empty array on error
  }
}

export async function getProjectById(id: string | number) {
  const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
  return response.data;
}

export async function getLatestDonations(limit = 5) {
  try {
    const response = await axios.get(`${API_BASE_URL}/donations/latest?limit=${limit}`);
    // Ensure we return an array, even if the API doesn't return one
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching latest donations:", error);
    return []; // Return empty array on error
  }
}

export async function getDonationStats() {
  try {
    const response = await axios.get(`${API_BASE_URL}/donations/stats`);
    // Return default stats object if data is invalid
    if (!response.data || typeof response.data !== 'object') {
      return { totalDonations: 0, totalDonors: 0, activeProjects: 0 };
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching donation stats:", error);
    return { totalDonations: 0, totalDonors: 0, activeProjects: 0 }; // Return default stats on error
  }
}

export async function getMonthlyDonations(projectId?: string | number) {
  try {
    const url = projectId 
      ? `${API_BASE_URL}/donations/monthly?projectId=${projectId}`
      : `${API_BASE_URL}/donations/monthly`;
    
    const response = await axios.get(url);
    // Ensure we return an array, even if the API doesn't return one
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching monthly donations:", error);
    return []; // Return empty array on error
  }
}
