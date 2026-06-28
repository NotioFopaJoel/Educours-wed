import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import StudentLayout from '../layouts/StudentLayout';
import TeacherLayout from '../layouts/TeacherLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterStudentPage from '../pages/auth/RegisterStudentPage';
import RegisterTeacherPage from '../pages/auth/RegisterTeacherPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

import StudentDashboard from '../pages/student/StudentDashboard';
import MyCoursesPage from '../pages/student/MyCoursesPage';
import CourseLearningPage from '../pages/student/CourseLearningPage';
import CourseCatalogPage from '../pages/public/CourseCatalogPage';
import CourseDetailPage from '../pages/public/CourseDetailPage';
import ChatbotPage from '../pages/student/ChatbotPage';
import StudentTimetablePage from '../pages/student/TimetablePage';
import TransactionsPage from '../pages/student/TransactionsPage';
import ResultsPage from '../pages/student/ResultsPage';
import NotificationsPage from '../pages/student/NotificationsPage';
import ProfilePage from '../pages/student/ProfilePage';

import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import TeacherCoursesPage from '../pages/teacher/TeacherCoursesPage';
import ManageStudents2Page from '../pages/teacher/ManageStudentsPage';
import AssignmentsPage from '../pages/teacher/AssignmentsPage';
import ExamsPage from '../pages/teacher/ExamsPage';
import LiveClassPage from '../pages/teacher/LiveClassPage';
import TeacherTimetablePage from '../pages/teacher/TimetablePage';
import RevenuePage from '../pages/teacher/RevenuePage';
import MessagesPage from '../pages/teacher/MessagesPage';

import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageCoursesPage from '../pages/admin/ManageCoursesPage';
import ManageTeachersPage from '../pages/admin/ManageTeachersPage';
import ManageStudentsPage from '../pages/admin/ManageStudentsPage';
import TransactionsOverviewPage from '../pages/admin/TransactionsOverviewPage';
import BroadcastMessagePage from '../pages/admin/BroadcastMessagePage';
import PlatformSettingsPage from '../pages/admin/PlatformSettingsPage';
import SupportTicketsPage from '../pages/admin/SupportTicketsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterStudentPage />} />
        <Route path="/register/teacher" element={<RegisterTeacherPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/courses" element={<CourseCatalogPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
      </Route>

      <Route path="/student" element={<ProtectedRoute roles={['student']}><StudentLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<MyCoursesPage />} />
        <Route path="courses/:enrollmentId" element={<CourseLearningPage />} />
        <Route path="catalog" element={<CourseCatalogPage />} />
        <Route path="chatbot" element={<ChatbotPage />} />
        <Route path="timetable" element={<StudentTimetablePage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/teacher" element={<ProtectedRoute roles={['teacher']}><TeacherLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="courses" element={<TeacherCoursesPage />} />
        <Route path="students" element={<ManageStudents2Page />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="liveclasses" element={<LiveClassPage />} />
        <Route path="timetable" element={<TeacherTimetablePage />} />
        <Route path="revenue" element={<RevenuePage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="courses" element={<ManageCoursesPage />} />
        <Route path="teachers" element={<ManageTeachersPage />} />
        <Route path="students" element={<ManageStudentsPage />} />
        <Route path="transactions" element={<TransactionsOverviewPage />} />
        <Route path="broadcast" element={<BroadcastMessagePage />} />
        <Route path="settings" element={<PlatformSettingsPage />} />
        <Route path="tickets" element={<SupportTicketsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
