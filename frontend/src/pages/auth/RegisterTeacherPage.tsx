import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { authApi } from '../../api/auth.api';

const RegisterTeacherPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '',
    university: '', yearOfStudy: '1st year', fieldOfStudy: '',
    subjectsCanTeach: '', levelsCanTeach: '',
    paymentMethod: { provider: 'MTN', phoneNumber: '' },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.registerTeacher({
        ...form,
        subjectsCanTeach: form.subjectsCanTeach.split(',').map((s) => s.trim()),
        levelsCanTeach: form.levelsCanTeach.split(',').map((s) => s.trim()),
      });
      navigate('/verify-email', { state: { email: form.email } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Helmet><title>Register as Teacher - EDUCOURS</title></Helmet>
      <div className="card max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-2">{t('auth.registerTitle')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2">{t('auth.registerSubtitle')}</p>
        <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 p-3 rounded-lg mb-4">
          {t('teacher.approvalPending')}
        </p>

        <div className="flex gap-2 mb-6">
          <Link to="/register" className="btn-secondary flex-1 text-sm !py-2">{t('auth.registerStudent')}</Link>
          <Link to="/register/teacher" className="btn-primary flex-1 text-sm !py-2">{t('auth.registerTeacher')}</Link>
        </div>

        {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="input-field" placeholder={t('auth.fullName')} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          <input type="email" className="input-field" placeholder={t('auth.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" className="input-field" placeholder={t('auth.password')} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
          <input className="input-field" placeholder={t('auth.phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <input className="input-field" placeholder="University" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} required />
          <select className="input-field" value={form.yearOfStudy} onChange={(e) => setForm({ ...form, yearOfStudy: e.target.value })}>
            <option value="1st year">1st year / 1ère année</option>
            <option value="2nd year">2nd year / 2ème année</option>
          </select>
          <input className="input-field" placeholder="Field of study" value={form.fieldOfStudy} onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })} required />
          <input className="input-field" placeholder="Subjects (comma separated)" value={form.subjectsCanTeach} onChange={(e) => setForm({ ...form, subjectsCanTeach: e.target.value })} required />
          <input className="input-field" placeholder="Levels (comma separated)" value={form.levelsCanTeach} onChange={(e) => setForm({ ...form, levelsCanTeach: e.target.value })} required />
          <div className="flex gap-2">
            <select className="input-field" value={form.paymentMethod.provider} onChange={(e) => setForm({ ...form, paymentMethod: { ...form.paymentMethod, provider: e.target.value } })}>
              <option value="MTN">MTN</option>
              <option value="ORANGE">Orange</option>
            </select>
            <input className="input-field" placeholder="Mobile Money number" value={form.paymentMethod.phoneNumber} onChange={(e) => setForm({ ...form, paymentMethod: { ...form.paymentMethod, phoneNumber: e.target.value } })} required />
          </div>
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

export default RegisterTeacherPage;
