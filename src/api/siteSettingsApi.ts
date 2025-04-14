
import axios from 'axios';

const API_BASE_URL = '/api';

export type SiteSettingType = {
  id: number;
  setting_key: string;
  setting_value: string | null;
  category: 'contact' | 'social' | 'general';
  label: string;
  icon: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type UpdateSettingType = {
  value: string;
};

export type NewSettingType = {
  key: string;
  value: string;
  category: 'contact' | 'social' | 'general';
  label: string;
  icon?: string;
  displayOrder?: number;
};

export async function getAllSettings() {
  try {
    const response = await axios.get<SiteSettingType[]>(`${API_BASE_URL}/site-settings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return [];
  }
}

export async function getSettingsByCategory(category: 'contact' | 'social' | 'general') {
  try {
    const response = await axios.get<SiteSettingType[]>(
      `${API_BASE_URL}/site-settings?category=${category}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${category} settings:`, error);
    return [];
  }
}

export async function getSettingValue(key: string) {
  try {
    const response = await axios.get<{ key: string; value: string }>(
      `${API_BASE_URL}/site-settings/${key}`
    );
    return response.data.value;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }
}

export async function updateSetting(key: string, value: string) {
  try {
    const response = await axios.put<{ message: string }>(
      `${API_BASE_URL}/admin/site-settings/${key}`,
      { value }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    throw error;
  }
}

export async function addSetting(settingData: NewSettingType) {
  try {
    const response = await axios.post<{ message: string }>(
      `${API_BASE_URL}/admin/site-settings`,
      settingData
    );
    return response.data;
  } catch (error) {
    console.error('Error adding new setting:', error);
    throw error;
  }
}

export async function deleteSetting(key: string) {
  try {
    const response = await axios.delete<{ message: string }>(
      `${API_BASE_URL}/admin/site-settings/${key}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting setting ${key}:`, error);
    throw error;
  }
}

export async function toggleSettingStatus(key: string, isActive: boolean) {
  try {
    const response = await axios.put<{ message: string }>(
      `${API_BASE_URL}/admin/site-settings/${key}/status`,
      { isActive }
    );
    return response.data;
  } catch (error) {
    console.error(`Error toggling setting ${key} status:`, error);
    throw error;
  }
}
