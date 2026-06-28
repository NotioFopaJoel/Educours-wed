import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { adminApi } from '../../api/admin.api';
import Loader from '../../components/common/Loader';

const TransactionsOverviewPage = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getTransactions({}).then((res) => setTransactions(res.data.data.transactions)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.transactions')}</h1>
      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2">Date</th>
              <th className="text-left py-3 px-2">Type</th>
              <th className="text-left py-3 px-2">From</th>
              <th className="text-left py-3 px-2">To</th>
              <th className="text-right py-3 px-2">Amount</th>
              <th className="text-center py-3 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-2">{new Date(tx.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-2">{tx.type}</td>
                <td className="py-3 px-2">{tx.fromUser?.fullName || '-'}</td>
                <td className="py-3 px-2">{tx.toUser?.fullName || '-'}</td>
                <td className="py-3 px-2 text-right font-medium">{tx.amount?.toLocaleString()} FCFA</td>
                <td className="py-3 px-2 text-center">
                  <span className={`badge ${tx.status === 'success' ? 'badge-success' : tx.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsOverviewPage;
