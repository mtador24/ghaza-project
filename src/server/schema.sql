
-- Add new site settings for social media and admin contact
INSERT INTO site_settings (setting_key, setting_value, category, label, icon, display_order) VALUES 
('linkedin', 'https://linkedin.com/company/your-organization', 'social', 'لينكد إن', 'linkedin', 8),
('youtube', 'https://youtube.com/channel/your-channel', 'social', 'يوتيوب', 'youtube', 9)
ON DUPLICATE KEY UPDATE setting_key = VALUES(setting_key);
