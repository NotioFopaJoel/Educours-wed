import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';
import Loader from '../../components/common/Loader';

const TimetablePage = () => {
  const { t } = useTranslation();
  const [timetable, setTimetable] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/timetables').then((res) => setTimetable(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('student.timetable')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {days.map((day, idx) => (
          <div key={day} className="card">
            <h3 className="font-semibold text-sm mb-3 text-center">{day}</h3>
            <div className="space-y-2">
              {timetable?.entries
                ?.filter((e: any) => e.dayOfWeek === idx)
                .map((entry: any, i: number) => (
                  <div key={i} className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded text-xs">
                    <p className="font-medium">{entry.title}</p>
                    <p className="text-gray-500">{entry.startTime} - {entry.endTime}</p>
                  </div>
                ))}
              {(!timetable?.entries?.filter((e: any) => e.dayOfWeek === idx)?.length) && (
                <p className="text-xs text-gray-400 text-center py-4">-</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetablePage;
