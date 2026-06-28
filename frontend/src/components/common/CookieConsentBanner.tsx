import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CookieConsentBanner = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
  };

  const reject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg p-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We use cookies to improve your experience. By continuing, you accept our use of cookies.
        </p>
        <div className="flex gap-3">
          <button onClick={reject} className="btn-secondary text-sm !py-2 !px-4">
            {t('common.no')}
          </button>
          <button onClick={accept} className="btn-primary text-sm !py-2 !px-4">
            {t('common.yes')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
