import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { authApi } from '../../api/auth.api';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setMessage('Reset code sent to your email');
      setStep('reset');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.resetPassword({ email, code, password });
      setMessage('Password reset successfully. You can now log in.');
      setStep('email');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Helmet><title>Forgot Password - EDUCOURS</title></Helmet>
      <div className="card max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">{t('auth.resetPassword')}</h1>
        {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        {message && <div className="bg-green-50 dark:bg-green-900/20 text-green-600 p-3 rounded-lg mb-4 text-sm">{message}</div>}

        {step === 'email' ? (
          <form onSubmit={requestCode} className="space-y-4">
            <input type="email" className="input-field" placeholder={t('auth.email')} value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? t('common.loading') : 'Send Code'}</button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="space-y-4">
            <input type="text" className="input-field text-center tracking-widest" placeholder="000000" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} required />
            <input type="password" className="input-field" placeholder={t('auth.newPassword')} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? t('common.loading') : t('common.submit')}</button>
          </form>
        )}

        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-primary-600 hover:underline">{t('common.back')}</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
