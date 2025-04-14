
import { query } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all site settings
export async function getAllSettings() {
  try {
    const sql = `SELECT setting_key, setting_value, setting_description 
                FROM site_settings`;
    const settings = await query(sql);
    
    // Convert array to object with keys
    const settingsObject = {};
    settings.forEach(setting => {
      settingsObject[setting.setting_key] = setting.setting_value;
    });
    
    return settingsObject;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    throw new Error('فشل في استرجاع إعدادات الموقع');
  }
}

// Get a specific setting
export async function getSetting(key) {
  try {
    const sql = `SELECT setting_value FROM site_settings 
                WHERE setting_key = ?`;
    const result = await query(sql, [key]);
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0].setting_value;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    throw new Error('فشل في استرجاع الإعداد');
  }
}

// Update a site setting
export async function updateSetting(key, value) {
  try {
    const sql = `UPDATE site_settings SET setting_value = ?, 
                updated_at = CURRENT_TIMESTAMP
                WHERE setting_key = ?`;
    const result = await query(sql, [value, key]);
    
    if (result.affectedRows === 0) {
      // Setting doesn't exist, insert it
      const insertSql = `INSERT INTO site_settings 
                        (setting_key, setting_value) 
                        VALUES (?, ?)`;
      await query(insertSql, [key, value]);
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    throw new Error('فشل في تحديث الإعداد');
  }
}

// Update multiple settings at once
export async function updateSettings(settings) {
  try {
    // Use a transaction for multiple updates
    const connection = await query('START TRANSACTION');
    
    for (const [key, value] of Object.entries(settings)) {
      const sql = `UPDATE site_settings SET setting_value = ?, 
                  updated_at = CURRENT_TIMESTAMP
                  WHERE setting_key = ?`;
      const result = await query(sql, [value, key]);
      
      if (result.affectedRows === 0) {
        // Setting doesn't exist, insert it
        const insertSql = `INSERT INTO site_settings 
                          (setting_key, setting_value) 
                          VALUES (?, ?)`;
        await query(insertSql, [key, value]);
      }
    }
    
    await query('COMMIT');
    return true;
  } catch (error) {
    await query('ROLLBACK');
    console.error('Error updating multiple settings:', error);
    throw new Error('فشل في تحديث الإعدادات');
  }
}

export default {
  getAllSettings,
  getSetting,
  updateSetting,
  updateSettings
};
