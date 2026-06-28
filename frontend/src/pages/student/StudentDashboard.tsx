import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { studentApi } from '../../api/student.api';
import { useAuthStore } from '../../store/authStore';
import Loader from '../../components/common/Loader';

const StudentDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.getDashboard().then((res) => setData(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <Helmet><title>Dashboard - EDUCOURS</title></Helmet>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t('student.dashboard')}</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome, {user?.fullName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">{t('student.activeCourses')}</p>
          <p className="text-3xl font-bold text-primary-600">{data?.stats?.activeCourses || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">{t('student.completedCourses')}</p>
          <p className="text-3xl font-bold text-green-600">{data?.stats?.completedCourses || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">{t('student.averageProgress')}</p>
          <p className="text-3xl font-bold text-secondary-500">{data?.stats?.averageProgress || 0}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">{t('student.myCourses')}</h2>
          {data?.recentEnrollments?.length > 0 ? (
            <div className="space-y-3">
              {data.recentEnrollments.map((enrollment: any) => (
                <Link key={enrollment._id} to={`/student/courses/${enrollment._id}`} className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <h3 className="font-medium">{enrollment.course?.title}</h3>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${enrollment.progress}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{enrollment.progress}% complete</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{t('student.noCoursesEnrolled')}</p>
          )}
          <Link to="/student/catalog" className="btn-secondary text-sm mt-4 inline-block">{t('student.browseCourses')}</Link>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">{t('student.results')}</h2>
          {data?.recentQuizResults?.length > 0 ? (
            <div className="space-y-2">
              {data.recentQuizResults.map((r: any) => (
                <div key={r._id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm">{r.course?.title}</span>
                  <span className="font-semibold text-primary-600">{r.scoreOutOf20}/20</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{t('common.noData')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
