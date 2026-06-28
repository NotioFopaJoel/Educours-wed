import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { studentApi } from '../../api/student.api';
import Loader from '../../components/common/Loader';

const MyCoursesPage = () => {
  const { t } = useTranslation();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.getEnrollments().then((res) => setEnrollments(res.data.data.enrollments)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('student.myCourses')}</h1>
      {enrollments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">{t('student.noCoursesEnrolled')}</p>
          <Link to="/student/catalog" className="btn-primary">{t('student.browseCourses')}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment._id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{enrollment.course?.title}</h3>
                  <p className="text-sm text-gray-500">{enrollment.course?.subject} - {enrollment.course?.level}</p>
                </div>
                <span className="badge-info">{enrollment.course?.educationSystem}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${enrollment.progress}%` }} />
              </div>
              <p className="text-sm text-gray-500 mb-4">{enrollment.progress}% complete</p>
              <Link to={`/student/courses/${enrollment._id}`} className="btn-primary text-sm !py-2">
                {enrollment.progress === 100 ? t('common.viewAll') : t('student.continueLearning')}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
