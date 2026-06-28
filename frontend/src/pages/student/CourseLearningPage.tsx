import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { studentApi } from '../../api/student.api';
import Loader from '../../components/common/Loader';

const CourseLearningPage = () => {
  const { enrollmentId } = useParams();
  const { t } = useTranslation();
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<any>(null);

  useEffect(() => {
    if (enrollmentId) {
      studentApi.getEnrollmentDetail(enrollmentId).then((res) => {
        const data = res.data.data.enrollment;
        setEnrollment(data);
        const firstLesson = data.course?.chapters?.[0]?.lessons?.[0];
        if (firstLesson) setCurrentLesson(firstLesson);
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [enrollmentId]);

  const markComplete = async () => {
    if (currentLesson && enrollmentId) {
      await studentApi.updateProgress(enrollmentId, currentLesson._id);
    }
  };

  if (loading) return <Loader />;
  if (!enrollment) return <p className="text-center text-gray-500">{t('common.noData')}</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {currentLesson ? (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">{currentLesson.title}</h2>
            {currentLesson.type === 'video' && currentLesson.contentUrl && (
              <video controls className="w-full rounded-lg mb-4" src={currentLesson.contentUrl} />
            )}
            {currentLesson.type === 'pdf' && currentLesson.contentUrl && (
              <iframe src={currentLesson.contentUrl} className="w-full h-[500px] rounded-lg mb-4" />
            )}
            {currentLesson.textContent && (
              <div className="prose dark:prose-invert max-w-none mb-4">{currentLesson.textContent}</div>
            )}
            <button onClick={markComplete} className="btn-primary">{t('student.continueLearning')}</button>
          </div>
        ) : (
          <div className="card text-center py-12 text-gray-500">{t('common.noData')}</div>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">{enrollment.course?.title}</h3>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${enrollment.progress}%` }} />
        </div>
        <p className="text-sm text-gray-500 mb-4">{enrollment.progress}% complete</p>

        {enrollment.course?.chapters?.map((chapter: any) => (
          <div key={chapter._id} className="mb-4">
            <h4 className="font-medium text-sm mb-2">{chapter.title}</h4>
            <div className="space-y-1">
              {chapter.lessons?.map((lesson: any) => (
                <button
                  key={lesson._id}
                  onClick={() => setCurrentLesson(lesson)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors min-h-[44px]
                    ${currentLesson?._id === lesson._id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  {lesson.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseLearningPage;
