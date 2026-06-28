import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { adminApi } from '../../api/admin.api';
import Loader from '../../components/common/Loader';

const ManageTeachersPage = () => {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getUsers({ role: 'teacher' }).then((res) => setTeachers(res.data.data.users)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const approve = async (id: string) => {
    await adminApi.approveTeacher(id);
    setTeachers((prev) => prev.map((t) => t._id === id ? { ...t, status: 'approved' } : t));
  };

  const suspend = async (id: string) => {
    await adminApi.suspendTeacher(id);
    setTeachers((prev) => prev.map((t) => t._id === id ? { ...t, status: 'suspended' } : t));
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.manageTeachers')}</h1>
      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2">Name</th>
              <th className="text-left py-3 px-2">Email</th>
              <th className="text-left py-3 px-2">University</th>
              <th className="text-left py-3 px-2">Subjects</th>
              <th className="text-center py-3 px-2">Status</th>
              <th className="text-center py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher._id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-2 font-medium">{teacher.fullName}</td>
                <td className="py-3 px-2 text-gray-500">{teacher.email}</td>
                <td className="py-3 px-2">{teacher.university}</td>
                <td className="py-3 px-2">{teacher.subjectsCanTeach?.join(', ')}</td>
                <td className="py-3 px-2 text-center">
                  <span className={`badge ${teacher.status === 'approved' ? 'badge-success' : teacher.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                    {teacher.status}
                  </span>
                </td>
                <td className="py-3 px-2 text-center">
                  {teacher.status === 'pending' && (
                    <button onClick={() => approve(teacher._id)} className="text-green-600 hover:underline text-xs mr-2">{t('admin.approveTeacher')}</button>
                  )}
                  {teacher.status === 'approved' && (
                    <button onClick={() => suspend(teacher._id)} className="text-red-600 hover:underline text-xs">{t('admin.suspendTeacher')}</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTeachersPage;
