import { useTranslation } from 'react-i18next';

const MessagesPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('teacher.messages')}</h1>
      <div className="card text-center py-8 text-gray-500">{t('common.noData')}</div>
    </div>
  );
};

export default MessagesPage;
