import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth.api';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ fullName: user?.fullName || '', phone: user?.phone || '', language: user?.language || 'en', theme: user?.theme || 'light', fontSize: user?.fontSize || 'normal' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await authApi.updateProfile(form);
      updateUser(form);
      setMessage('Profile updated');
    } catch { setMessage('Error updating profile'); }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{t('student.profile')}</h1>
      <div className="card space-y-4">
        {message && <div className="bg-green-50 dark:bg-green-900/20 text-green-600 p-3 rounded-lg text-sm">{message}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">{t('auth.fullName')}</label>
          <input className="input-field" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('auth.email')}</label>
          <input className="input-field" value={user?.email || ''} disabled />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('auth.phone')}</label>
          <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('common.language')}</label>
          <select className="input-field" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
            <option value="en">{t('common.english')}</option>
            <option value="fr">{t('common.french')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('common.darkMode')}</label>
          <select className="input-field" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })}>
            <option value="light">{t('common.lightMode')}</option>
            <option value="dark">{t('common.darkMode')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('common.fontSize')}</label>
          <select className="input-field" value={form.fontSize} onChange={(e) => setForm({ ...form, fontSize: e.target.value })}>
            <option value="normal">{t('common.normal')}</option>
            <option value="large">{t('common.large')}</option>
            <option value="xlarge">{t('common.xlarge')}</option>
          </select>
        </div>
        <button onClick={handleSave} className="btn-primary" disabled={saving}>{saving ? t('common.loading') : t('common.save')}</button>
      </div>
    </div>
  );
};

export default ProfilePage;
