import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { quizApi } from '../../api/quiz.api';
import Loader from '../../components/common/Loader';

const ResultsPage = () => {
  const { t } = useTranslation();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quizApi.getMyResults().then((res) => setResults(res.data.data.results)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('student.results')}</h1>
      <div className="space-y-4">
        {results.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">{t('common.noData')}</div>
        ) : (
          results.map((r) => (
            <div key={r._id} className="card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{r.course?.title || 'Quiz'}</h3>
                <span className="text-2xl font-bold text-primary-600">{r.scoreOutOf20}/20</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div className="h-2 rounded-full bg-primary-600" style={{ width: `${r.score}%` }} />
              </div>
              <p className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
              {r.weakChapters?.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">{t('student.weakChapters')}:</p>
                  <div className="flex flex-wrap gap-1">
                    {r.weakChapters.map((ch: string, i: number) => (
                      <span key={i} className="badge-warning text-xs">{ch}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
