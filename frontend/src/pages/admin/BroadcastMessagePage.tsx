import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminApi } from '../../api/admin.api';

const BroadcastMessagePage = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setResult('');
    try {
      const res = await adminApi.broadcast({ title, message, targetRole: targetRole || undefined });
      setResult(res.data.message);
      setTitle('');
      setMessage('');
    } catch (err: any) {
      setResult(err.response?.data?.message || 'Failed to send');
    }
    setSending(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{t('admin.broadcast')}</h1>

      {result && <div className="bg-green-50 dark:bg-green-900/20 text-green-600 p-3 rounded-lg mb-4 text-sm">{result}</div>}

      <form onSubmit={handleSend} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea className="input-field h-32" value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Target (optional)</label>
          <select className="input-field" value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
            <option value="">All users</option>
            <option value="student">Students only</option>
            <option value="teacher">Teachers only</option>
          </select>
        </div>
        <button type="submit" className="btn-primary" disabled={sending}>
          {sending ? t('common.loading') : 'Send Broadcast'}
        </button>
      </form>
    </div>
  );
};

export default BroadcastMessagePage;
