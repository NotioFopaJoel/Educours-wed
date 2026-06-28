import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const LandingPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Helmet>
        <title>EDUCOURS - Learn. Understand. Succeed.</title>
        <meta name="description" content="Quality secondary education for African students. AI-powered tutoring, live classes, and personalized learning." />
        <meta property="og:title" content="EDUCOURS - Learn. Understand. Succeed." />
        <meta property="og:description" content="Quality secondary education for African students." />
      </Helmet>

      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{t('landing.heroTitle')}</h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">{t('landing.heroSubtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-white text-primary-700 px-8 py-3.5 rounded-lg font-semibold text-center hover:bg-primary-50 transition-colors min-h-[44px]">
                {t('common.getStarted')}
              </Link>
              <Link to="/courses" className="border-2 border-white text-white px-8 py-3.5 rounded-lg font-semibold text-center hover:bg-white/10 transition-colors min-h-[44px]">
                {t('common.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t('landing.howItWorks')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👨‍🏫</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('landing.feature1Title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('landing.feature1Desc')}</p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('landing.feature2Title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('landing.feature2Desc')}</p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('landing.feature3Title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('landing.feature3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landing.ctaTitle')}</h2>
          <p className="text-xl text-primary-100 mb-8">{t('landing.ctaSubtitle')}</p>
          <Link to="/register" className="inline-block bg-white text-primary-700 px-8 py-3.5 rounded-lg font-semibold hover:bg-primary-50 transition-colors min-h-[44px]">
            {t('common.getStarted')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
