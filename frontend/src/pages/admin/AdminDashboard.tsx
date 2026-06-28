import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { adminApi } from '../../api/admin.api';
import Loader from '../../components/common/Loader';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard().then((res) => setData(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <Helmet><title>Admin Dashboard - EDUCOURS</title></Helmet>
      <h1 className="text-2xl font-bold mb-6">{t('admin.dashboard')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">{t('admin.totalUsers')}</p>
          <p className="text-3xl font-bold text-primary-600">{data?.totalStudents || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Teachers</p>
          <p className="text-3xl font-bold text-secondary-500">{data?.totalTeachers || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Courses</p>
          <p className="text-3xl font-bold text-green-600">{data?.totalCourses || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">{t('admin.monthlyRevenue')}</p>
          <p className="text-3xl font-bold text-primary-600">{data?.monthlyRevenue?.toLocaleString()} FCFA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-yellow-50 dark:bg-yellow-900/10">
          <p className="text-sm text-gray-500 mb-1">{t('admin.pendingTeachers')}</p>
          <p className="text-2xl font-bold text-yellow-600">{data?.pendingTeachers || 0}</p>
        </div>
        <div className="card bg-red-50 dark:bg-red-900/10">
          <p className="text-sm text-gray-500 mb-1">{t('admin.openTickets')}</p>
          <p className="text-2xl font-bold text-red-600">{data?.openTickets || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">{t('admin.totalRevenue')}</p>
          <p className="text-2xl font-bold text-green-600">{data?.totalRevenue?.toLocaleString()} FCFA</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
