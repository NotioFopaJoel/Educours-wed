import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { teacherApi } from '../../api/teacher.api';
import Loader from '../../components/common/Loader';

const ManageStudentsPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherApi.getStudents().then((res) => setData(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const students = data?.students || [];
  const quizResults = data?.quizResults || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('teacher.manageStudents')}</h1>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">Students ({students.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2">Name</th>
                <th className="text-left py-3 px-2">Email</th>
                <th className="text-left py-3 px-2">Level</th>
                <th className="text-left py-3 px-2">Course</th>
                <th className="text-center py-3 px-2">Progress</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s: any) => (
                <tr key={s._id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-2 font-medium">{s.student?.fullName}</td>
                  <td className="py-3 px-2 text-gray-500">{s.student?.email}</td>
                  <td className="py-3 px-2">{s.student?.level}</td>
                  <td className="py-3 px-2">{s.course?.title}</td>
                  <td className="py-3 px-2 text-center">{s.progress}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">{t('student.results')} ({quizResults.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2">Student</th>
                <th className="text-center py-3 px-2">Score</th>
                <th className="text-left py-3 px-2">Weak Chapters</th>
                <th className="text-left py-3 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {quizResults.map((r: any) => (
                <tr key={r._id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-2">{r.student?.fullName}</td>
                  <td className="py-3 px-2 text-center font-semibold text-primary-600">{r.scoreOutOf20}/20</td>
                  <td className="py-3 px-2">
                    <div className="flex flex-wrap gap-1">
                      {r.weakChapters?.map((ch: string, i: number) => (
                        <span key={i} className="badge-warning text-xs">{ch}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStudentsPage;
