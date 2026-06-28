import { useLangStore } from '../../store/langStore';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLangStore();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
      className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium rounded-lg
        hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px]"
      aria-label="Switch language"
    >
      <span className={`${language === 'en' ? 'text-primary-600 font-bold' : 'text-gray-500'}`}>EN</span>
      <span className="text-gray-400">|</span>
      <span className={`${language === 'fr' ? 'text-primary-600 font-bold' : 'text-gray-500'}`}>FR</span>
    </button>
  );
};

export default LanguageSwitcher;
