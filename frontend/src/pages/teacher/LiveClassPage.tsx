import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LiveClassPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('teacher.liveClasses')}</h1>
      <div className="card text-center py-12 text-gray-500">
        <p>Schedule and manage live classes using Jitsi Meet integration.</p>
        <button className="btn-primary mt-4">{t('teacher.scheduleLiveClass')}</button>
      </div>
    </div>
  );
};

export default LiveClassPage;
