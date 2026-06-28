import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { teacherApi } from '../../api/teacher.api';
import Loader from '../../components/common/Loader';

const RevenuePage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherApi.getRevenue().then((res) => setData(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('teacher.revenue')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Total Generated</p>
          <p className="text-3xl font-bold text-primary-600">{data?.totalRevenueGenerated?.toLocaleString()} FCFA</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Total Paid Out</p>
          <p className="text-3xl font-bold text-green-600">{data?.totalPaidOut?.toLocaleString()} FCFA</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Pending</p>
          <p className="text-3xl font-bold text-secondary-500">{data?.pendingBalance?.toLocaleString()} FCFA</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
        <p className="text-sm">{data?.paymentMethod?.provider}: {data?.paymentMethod?.phoneNumber}</p>
      </div>
    </div>
  );
};

export default RevenuePage;
