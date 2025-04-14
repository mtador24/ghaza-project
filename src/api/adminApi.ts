
import axios from 'axios';

const API_BASE_URL = '/api';

export async function getAdminProfile() {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/profile`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return null;
  }
}

export async function updateAdminProfile(profileData: {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  try {
    const response = await axios.put(`${API_BASE_URL}/admin/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating admin profile:", error);
    throw error;
  }
}

export async function getSiteMembers(page = 1, limit = 10, search = '') {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/admin/members?page=${page}&limit=${limit}&search=${search}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching site members:", error);
    return { members: [], total: 0, totalPages: 0 };
  }
}

export async function getMemberDetails(memberId: string | number) {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/members/${memberId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching member ${memberId}:`, error);
    return null;
  }
}

export async function updateMemberStatus(memberId: string | number, isActive: boolean) {
  try {
    const response = await axios.put(`${API_BASE_URL}/admin/members/${memberId}/status`, {
      isActive
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating member status:`, error);
    throw error;
  }
}

export async function deleteMember(memberId: string | number) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/admin/members/${memberId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting member:`, error);
    throw error;
  }
}
