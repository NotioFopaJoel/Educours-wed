import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { teacherApi } from '../../api/teacher.api';
import Loader from '../../components/common/Loader';

const TeacherCoursesPage = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherApi.getCourses().then((res) => setCourses(res.data.data.courses)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('teacher.assignedCourses')}</h1>
      {courses.length === 0 ? (
        <div className="card text-center py-8 text-gray-500">{t('teacher.noCoursesAssigned')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course: any) => (
            <div key={course._id} className="card">
              <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-1">{course.subject} - {course.level}</p>
              <p className="text-sm text-gray-500 mb-3">{course.educationSystem}</p>
              <p className="font-semibold text-primary-600">{course.studentsEnrolledCount || 0} students enrolled</p>
              {course.chapters?.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Chapters: {course.chapters.length}</p>
                  <div className="space-y-1">
                    {course.chapters.map((ch: any) => (
                      <div key={ch._id} className="text-xs text-gray-500">{ch.title} ({ch.lessons?.length || 0} lessons)</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherCoursesPage;
