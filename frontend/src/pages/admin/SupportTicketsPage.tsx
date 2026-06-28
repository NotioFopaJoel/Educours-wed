import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';
import Loader from '../../components/common/Loader';

const SupportTicketsPage = () => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/tickets/all').then((res) => setTickets(res.data.data.tickets)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await axiosClient.patch(`/tickets/${id}/status`, { status });
    setTickets((prev) => prev.map((t) => t._id === id ? { ...t, status } : t));
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('admin.tickets')}</h1>
      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2">Subject</th>
              <th className="text-left py-3 px-2">User</th>
              <th className="text-left py-3 px-2">Category</th>
              <th className="text-center py-3 px-2">Status</th>
              <th className="text-center py-3 px-2">Messages</th>
              <th className="text-center py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-2 font-medium">{ticket.subject}</td>
                <td className="py-3 px-2">{ticket.user?.fullName || ticket.user?.email}</td>
                <td className="py-3 px-2">{ticket.category}</td>
                <td className="py-3 px-2 text-center">
                  <span className={`badge ${ticket.status === 'open' ? 'badge-danger' : ticket.status === 'in_progress' ? 'badge-warning' : 'badge-success'}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="py-3 px-2 text-center">{ticket.messages?.length}</td>
                <td className="py-3 px-2 text-center">
                  {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                    <button onClick={() => updateStatus(ticket._id, 'resolved')} className="text-green-600 hover:underline text-xs">
                      Resolve
                    </button>
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

export default SupportTicketsPage;
