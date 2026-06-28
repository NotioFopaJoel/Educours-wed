import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { courseApi } from '../../api/course.api';
import Loader from '../../components/common/Loader';

const CourseCatalogPage = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ educationSystem: '', level: '', subject: '' });

  useEffect(() => {
    loadCourses();
  }, [filters]);

  const loadCourses = async () => {
    try {
      const res = await courseApi.getAll({ ...filters, isPublished: 'true' });
      setCourses(res.data.data.courses);
    } catch { /* ignore */ }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>Courses - EDUCOURS</title>
        <meta name="description" content="Browse our catalog of secondary school courses." />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">{t('student.courseCatalog')}</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <select className="input-field max-w-xs" value={filters.educationSystem} onChange={(e) => setFilters({ ...filters, educationSystem: e.target.value })}>
          <option value="">All Systems</option>
          <option value="anglophone">Anglophone</option>
          <option value="francophone">Francophone</option>
        </select>
        <input className="input-field max-w-xs" placeholder={t('common.search')} value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value })} />
      </div>

      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="card hover:shadow-lg transition-shadow">
              {course.coverImage && <img src={course.coverImage} alt={course.title} className="w-full h-48 object-cover rounded-lg mb-4" />}
              <span className="badge-info mb-2 inline-block">{course.educationSystem}</span>
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{course.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary-600">{course.price.toLocaleString()} FCFA</span>
                <Link to={`/courses/${course._id}`} className="btn-primary text-sm !py-2 !px-4">{t('student.enrollNow')}</Link>
              </div>
            </div>
          ))}
          {courses.length === 0 && <p className="col-span-full text-center text-gray-500">{t('common.noData')}</p>}
        </div>
      )}
    </div>
  );
};

export default CourseCatalogPage;
