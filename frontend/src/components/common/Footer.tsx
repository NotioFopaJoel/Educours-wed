import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary-600 mb-4">EDUCOURS</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('common.tagline')}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/courses" className="hover:text-primary-600">{t('student.courseCatalog')}</Link></li>
              <li><Link to="/about" className="hover:text-primary-600">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary-600">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/terms" className="hover:text-primary-600">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-600">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>notiofopajoel@gmail.com</li>
              <li>+237 678095581</li>
              <li>Buea, Cameroon</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EDUCOURS. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
