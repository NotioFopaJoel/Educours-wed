import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth.api';

const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const email = location.state?.email || '';
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.verifyEmail({ email, code });
      const { user, accessToken, refreshToken } = res.data.data;
      login(user, accessToken, refreshToken);

      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Helmet><title>Verify Email - EDUCOURS</title></Helmet>
      <div className="card max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2">{t('auth.verifyEmail')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('auth.verifySubtitle')}</p>

        {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" className="input-field text-center text-2xl tracking-widest" placeholder="000000" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} required />
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? t('common.loading') : t('common.confirm')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
