
import { query } from './db.js';

// الحصول على جميع إعدادات الموقع
export async function getAllSettings() {
  const sql = `
    SELECT * FROM site_settings
    WHERE is_active = true
    ORDER BY display_order ASC, category ASC
  `;
  
  return await query(sql);
}

// الحصول على إعدادات حسب الفئة
export async function getSettingsByCategory(category) {
  const sql = `
    SELECT * FROM site_settings
    WHERE category = ? AND is_active = true
    ORDER BY display_order ASC
  `;
  
  return await query(sql, [category]);
}

// الحصول على قيمة إعداد محدد
export async function getSettingValue(key) {
  const sql = `
    SELECT setting_value FROM site_settings
    WHERE setting_key = ? AND is_active = true
    LIMIT 1
  `;
  
  const result = await query(sql, [key]);
  return result.length > 0 ? result[0].setting_value : null;
}

// تحديث قيمة إعداد
export async function updateSetting(key, value) {
  const sql = `
    UPDATE site_settings
    SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
    WHERE setting_key = ?
  `;
  
  return await query(sql, [value, key]);
}

// إضافة إعداد جديد
export async function addSetting(settingData) {
  const { key, value, category, label, icon, displayOrder = 0 } = settingData;
  
  const sql = `
    INSERT INTO site_settings (
      setting_key, setting_value, category, label, icon, display_order
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      setting_value = VALUES(setting_value),
      category = VALUES(category),
      label = VALUES(label),
      icon = VALUES(icon),
      display_order = VALUES(display_order),
      updated_at = CURRENT_TIMESTAMP
  `;
  
  return await query(sql, [key, value, category, label, icon, displayOrder]);
}

// حذف إعداد
export async function deleteSetting(key) {
  const sql = `
    DELETE FROM site_settings
    WHERE setting_key = ?
  `;
  
  return await query(sql, [key]);
}

// تغيير حالة تفعيل الإعداد
export async function toggleSettingStatus(key, isActive) {
  const sql = `
    UPDATE site_settings
    SET is_active = ?, updated_at = CURRENT_TIMESTAMP
    WHERE setting_key = ?
  `;
  
  return await query(sql, [isActive, key]);
}
