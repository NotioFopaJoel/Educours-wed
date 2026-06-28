import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';
import Loader from '../../components/common/Loader';

const NotificationsPage = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/notifications').then((res) => setNotifications(res.data.data.notifications)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    await axiosClient.patch(`/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('student.notifications')}</h1>
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">{t('common.noData')}</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`card cursor-pointer transition-colors ${!n.isRead ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
              onClick={() => !n.isRead && markRead(n._id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{n.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.isRead && <span className="w-2 h-2 bg-primary-600 rounded-full mt-2" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
