import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { adminApi } from '../../api/admin.api';
import Loader from '../../components/common/Loader';

const PlatformSettingsPage = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    adminApi.getSettings().then((res) => setSettings(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage('');
    try {
      await adminApi.updateSettings(settings);
      setMessage('Settings saved');
    } catch { setMessage('Error saving'); }
    setSaving(false);
  };

  if (loading) return <Loader />;
  if (!settings) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{t('admin.settings')}</h1>
      {message && <div className="bg-green-50 dark:bg-green-900/20 text-green-600 p-3 rounded-lg mb-4 text-sm">{message}</div>}

      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Commission (%)</label>
          <input type="number" className="input-field" value={settings.commissionPercent} onChange={(e) => setSettings({ ...settings, commissionPercent: parseInt(e.target.value) })} min={0} max={100} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Daily Chatbot Limit</label>
          <input type="number" className="input-field" value={settings.dailyChatbotLimit} onChange={(e) => setSettings({ ...settings, dailyChatbotLimit: parseInt(e.target.value) })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact Email</label>
          <input className="input-field" value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact Phone</label>
          <input className="input-field" value={settings.contactPhone} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Currency</label>
          <input className="input-field" value={settings.currency} disabled />
          <p className="text-xs text-gray-500 mt-1">Currency is locked to FCFA</p>
        </div>
        <button onClick={handleSave} className="btn-primary" disabled={saving}>
          {saving ? t('common.loading') : t('common.save')}
        </button>
      </div>
    </div>
  );
};

export default PlatformSettingsPage;
