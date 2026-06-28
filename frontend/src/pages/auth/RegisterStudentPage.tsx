import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { authApi } from '../../api/auth.api';

const ANGLOPHONE_LEVELS = ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Lower Sixth', 'Upper Sixth'];
const FRANCOPHONE_LEVELS = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'];

const RegisterStudentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '',
    educationSystem: 'anglophone', level: '', country: '', region: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const levels = form.educationSystem === 'anglophone' ? ANGLOPHONE_LEVELS : FRANCOPHONE_LEVELS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.registerStudent(form);
      navigate('/verify-email', { state: { email: form.email } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Helmet><title>Register - EDUCOURS</title></Helmet>
      <div className="card max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-2">{t('auth.registerTitle')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('auth.registerSubtitle')}</p>

        <div className="flex gap-2 mb-6">
          <Link to="/register" className="btn-primary flex-1 text-sm !py-2">{t('auth.registerStudent')}</Link>
          <Link to="/register/teacher" className="btn-secondary flex-1 text-sm !py-2">{t('auth.registerTeacher')}</Link>
        </div>

        {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="input-field" placeholder={t('auth.fullName')} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          <input type="email" className="input-field" placeholder={t('auth.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" className="input-field" placeholder={t('auth.password')} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
          <input className="input-field" placeholder={t('auth.phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <select className="input-field" value={form.educationSystem} onChange={(e) => setForm({ ...form, educationSystem: e.target.value, level: '' })}>
            <option value="anglophone">Anglophone</option>
            <option value="francophone">Francophone</option>
          </select>
          <select className="input-field" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} required>
            <option value="">Select level</option>
            {levels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <input className="input-field" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? t('common.loading') : t('common.signUp')}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {t('auth.hasAccount')} <Link to="/login" className="text-primary-600 hover:underline">{t('common.logIn')}</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterStudentPage;
