import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { teacherApi } from '../../api/teacher.api';
import { useAuthStore } from '../../store/authStore';
import Loader from '../../components/common/Loader';

const TeacherDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherApi.getDashboard().then((res) => setData(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (user?.role === 'teacher' && !data?.teacher?.status) return <Loader />;

  return (
    <div>
      <Helmet><title>Teacher Dashboard - EDUCOURS</title></Helmet>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t('teacher.dashboard')}</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome, {user?.fullName}</p>
        {data?.teacher?.status === 'pending' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 p-3 rounded-lg mt-2 text-sm">{t('teacher.approvalPending')}</div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">{t('teacher.assignedCourses')}</p>
          <p className="text-3xl font-bold text-primary-600">{data?.stats?.assignedCourses || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">{t('teacher.totalStudents')}</p>
          <p className="text-3xl font-bold text-green-600">{data?.stats?.totalStudents || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">{t('teacher.monthlyRevenue')}</p>
          <p className="text-3xl font-bold text-secondary-500">{data?.stats?.monthlyRevenue?.toLocaleString()} FCFA</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">{t('teacher.pendingBalance')}</p>
          <p className="text-3xl font-bold text-primary-600">{data?.stats?.pendingBalance?.toLocaleString()} FCFA</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
