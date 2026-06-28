import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AssignmentsPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('teacher.assignments')}</h1>
      <div className="card text-center py-12 text-gray-500">
        <p>Assignment management interface. Create, view, and grade assignments here.</p>
        <button className="btn-primary mt-4">{t('teacher.createAssignment')}</button>
      </div>
    </div>
  );
};

export default AssignmentsPage;
