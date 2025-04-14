
import { useEffect, useState } from 'react';
import { getAllSettings, getSettingsByCategory, SiteSettingType } from '@/api/siteSettingsApi';

type UseSiteSettingsProps = {
  category?: 'contact' | 'social' | 'general';
};

export function useSiteSettings({ category }: UseSiteSettingsProps = {}) {
  const [settings, setSettings] = useState<SiteSettingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: SiteSettingType[];
        if (category) {
          data = await getSettingsByCategory(category);
        } else {
          data = await getAllSettings();
        }
        setSettings(data);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('حدث خطأ أثناء جلب إعدادات الموقع');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [category]);

  const getValue = (key: string): string | null => {
    const setting = settings.find(s => s.setting_key === key && s.is_active);
    return setting ? setting.setting_value : null;
  };

  const getByCategory = (cat: 'contact' | 'social' | 'general'): SiteSettingType[] => {
    return settings.filter(s => s.category === cat && s.is_active);
  };

  return {
    settings,
    loading,
    error,
    getValue,
    getByCategory,
    contactSettings: settings.filter(s => s.category === 'contact' && s.is_active),
    socialSettings: settings.filter(s => s.category === 'social' && s.is_active),
    generalSettings: settings.filter(s => s.category === 'general' && s.is_active),
  };
}
