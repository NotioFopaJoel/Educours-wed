import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { courseApi } from '../../api/course.api';
import { paymentApi } from '../../api/payment.api';
import { useAuthStore } from '../../store/authStore';
import Loader from '../../components/common/Loader';

const CourseDetailPage = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [service, setService] = useState<'MTN' | 'ORANGE'>('MTN');
  const [paying, setPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (courseId) {
      courseApi.getOne(courseId).then((res) => {
        setCourse(res.data.data);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [courseId]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${courseId}` } });
      return;
    }
    if (user?.role !== 'student') {
      setError('Only students can enroll in courses');
      return;
    }
    setError('');
    setPaying(true);
    setPaymentStatus(null);
    try {
      const res = await paymentApi.initiate({ courseId: courseId!, phoneNumber, service });
      setPaymentStatus(res.data.data.status);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <Loader />;
  if (!course) return <p className="text-center text-gray-500 mt-8">{t('common.noData')}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Helmet>
        <title>{course.title} - EDUCOURS</title>
      </Helmet>

      <Link to="/courses" className="text-primary-600 hover:underline mb-4 inline-block">&larr; {t('common.back')}</Link>

      <div className="card">
        {course.coverImage && (
          <img src={course.coverImage} alt={course.title} className="w-full h-64 object-cover rounded-lg mb-6" />
        )}
        <span className="badge-info mb-2 inline-block">{course.educationSystem}</span>
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{course.description}</p>

        <div className="flex gap-4 mb-6 text-sm">
          <span className="font-semibold">{t('student.level')}: {course.level}</span>
          <span className="font-semibold">{t('student.subject')}: {course.subject}</span>
        </div>

        <div className="text-2xl font-bold text-primary-600 mb-6">
          {course.price.toLocaleString()} FCFA
        </div>

        {paymentStatus === 'SUCCESS' || paymentStatus === 'PENDING' ? (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-lg">
            {paymentStatus === 'SUCCESS'
              ? 'Payment successful! Redirecting to your courses...'
              : 'Payment initiated! Check your phone to confirm the payment request.'}
          </div>
        ) : (
          <form onSubmit={handlePayment} className="space-y-4 max-w-md">
            {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

            <div>
              <label className="block text-sm font-medium mb-1">Mobile Money Provider</label>
              <select className="input-field" value={service} onChange={(e) => setService(e.target.value as 'MTN' | 'ORANGE')}>
                <option value="MTN">MTN Mobile Money</option>
                <option value="ORANGE">Orange Money</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input className="input-field" placeholder="670000000" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={paying}>
              {paying ? t('common.loading') : t('student.enrollNow')}
            </button>

            {!isAuthenticated && (
              <p className="text-sm text-gray-500 text-center">
                <Link to="/login" className="text-primary-600 hover:underline">Log in</Link> to enroll in this course.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
