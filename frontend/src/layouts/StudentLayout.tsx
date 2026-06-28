import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const navItems = [
  { path: '/student/dashboard', labelKey: 'student.dashboard', icon: '📊' },
  { path: '/student/courses', labelKey: 'student.myCourses', icon: '📚' },
  { path: '/student/catalog', labelKey: 'student.courseCatalog', icon: '🔍' },
  { path: '/student/timetable', labelKey: 'student.timetable', icon: '📅' },
  { path: '/student/chatbot', labelKey: 'student.chatbot', icon: '🤖' },
  { path: '/student/transactions', labelKey: 'student.transactions', icon: '💰' },
  { path: '/student/results', labelKey: 'student.results', icon: '📝' },
  { path: '/student/notifications', labelKey: 'student.notifications', icon: '🔔' },
  { path: '/student/profile', labelKey: 'student.profile', icon: '👤' },
];

const StudentLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <Link to="/student/dashboard" className="text-xl font-bold text-primary-600">EDUCOURS</Link>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm transition-colors min-h-[44px]
                  ${location.pathname === item.path
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <span>{item.icon}</span>
                <span>{t(item.labelKey)}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
            <LanguageSwitcher />
            <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg min-h-[44px]">
              {t('common.logOut')}
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 min-h-[44px] min-w-[44px]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-semibold">{user?.fullName}</span>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default StudentLayout;
