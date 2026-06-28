import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { adminApi } from '../../api/admin.api';
import Loader from '../../components/common/Loader';

const ManageStudentsPage = () => {
  const { t } = useTranslation();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getUsers({ role: 'student' }).then((res) => setStudents(res.data.data.users)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (id: string) => {
    await adminApi.toggleUserStatus(id);
    setStudents((prev) => prev.map((s) => s._id === id ? { ...s, isActive: !s.isActive } : s));
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.manageStudents')}</h1>
      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2">Name</th>
              <th className="text-left py-3 px-2">Email</th>
              <th className="text-left py-3 px-2">Level</th>
              <th className="text-left py-3 px-2">System</th>
              <th className="text-center py-3 px-2">Active</th>
              <th className="text-center py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-2 font-medium">{student.fullName}</td>
                <td className="py-3 px-2 text-gray-500">{student.email}</td>
                <td className="py-3 px-2">{student.level}</td>
                <td className="py-3 px-2">{student.educationSystem}</td>
                <td className="py-3 px-2 text-center">
                  <span className={`badge ${student.isActive ? 'badge-success' : 'badge-danger'}`}>{student.isActive ? 'Yes' : 'No'}</span>
                </td>
                <td className="py-3 px-2 text-center">
                  <button onClick={() => toggleStatus(student._id)} className="text-red-600 hover:underline text-xs">
                    {student.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudentsPage;
