import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { courseApi } from '../../api/course.api';
import Loader from '../../components/common/Loader';

const ManageCoursesPage = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseApi.getAll().then((res) => setCourses(res.data.data.courses)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const togglePublish = async (course: any) => {
    await courseApi.update(course._id, { isPublished: !course.isPublished });
    setCourses((prev) => prev.map((c) => c._id === course._id ? { ...c, isPublished: !c.isPublished } : c));
  };

  const deleteCourse = async (id: string) => {
    if (window.confirm('Delete this course?')) {
      await courseApi.delete(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.manageCourses')}</h1>
      <button className="btn-primary mb-6">{t('admin.createCourse')}</button>

      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2">Title</th>
              <th className="text-left py-3 px-2">Level</th>
              <th className="text-right py-3 px-2">Price</th>
              <th className="text-center py-3 px-2">Students</th>
              <th className="text-center py-3 px-2">Status</th>
              <th className="text-center py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-2 font-medium">{course.title}</td>
                <td className="py-3 px-2">{course.level}</td>
                <td className="py-3 px-2 text-right">{course.price.toLocaleString()} FCFA</td>
                <td className="py-3 px-2 text-center">{course.studentsEnrolledCount}</td>
                <td className="py-3 px-2 text-center">
                  <button onClick={() => togglePublish(course)} className={`badge ${course.isPublished ? 'badge-success' : 'badge-warning'}`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="py-3 px-2 text-center">
                  <button onClick={() => deleteCourse(course._id)} className="text-red-600 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCoursesPage;
