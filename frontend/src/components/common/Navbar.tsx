import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { useLangStore } from '../../store/langStore';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { language } = useLangStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'teacher': return '/teacher/dashboard';
      case 'student': return '/student/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-2xl font-bold text-primary-600">EDUCOURS</span>
            </Link>
            {isAuthenticated && user && (
              <Link to={getDashboardLink()} className="ml-8 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600">
                {t('common.dashboard', 'Dashboard')}
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600">
                  {user?.fullName}
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-sm !py-1.5 !px-4">
                  {t('common.logOut')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600">
                  {t('common.logIn')}
                </Link>
                <Link to="/register" className="btn-primary text-sm !py-1.5 !px-4">
                  {t('common.signUp')}
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 min-h-[44px] min-w-[44px]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="block px-3 py-2 text-sm">{user?.fullName}</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-red-600">
                  {t('common.logOut')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-sm">{t('common.logIn')}</Link>
                <Link to="/register" className="block px-3 py-2 text-sm text-primary-600 font-medium">{t('common.signUp')}</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
