import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth.api';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { user, accessToken, refreshToken } = res.data.data;
      login(user, accessToken, refreshToken);

      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Helmet><title>Login - EDUCOURS</title></Helmet>
      <div className="card max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">{t('auth.loginTitle')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('auth.loginSubtitle')}</p>

        {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('auth.email')}</label>
            <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@educour.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('auth.password')}</label>
            <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? t('common.loading') : t('common.logIn')}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2 text-sm">
          <Link to="/forgot-password" className="text-primary-600 hover:underline block">{t('auth.forgotPassword')}</Link>
          <p>{t('auth.noAccount')} <Link to="/register" className="text-primary-600 hover:underline">{t('common.signUp')}</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
