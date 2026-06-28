import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth.api';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout, setUser, updateUser } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    const { user: userData, accessToken, refreshToken } = res.data.data;
    login(userData, accessToken, refreshToken);

    if (userData.role === 'admin') navigate('/admin/dashboard');
    else if (userData.role === 'teacher') navigate('/teacher/dashboard');
    else navigate('/student/dashboard');

    return res.data;
  };

  const handleRegister = async (data: any, role: 'student' | 'teacher') => {
    const endpoint = role === 'student' ? authApi.registerStudent : authApi.registerTeacher;
    const res = await endpoint(data);
    return res.data;
  };

  const handleVerifyEmail = async (email: string, code: string) => {
    const res = await authApi.verifyEmail({ email, code });
    const { user: userData, accessToken, refreshToken } = res.data.data;
    login(userData, accessToken, refreshToken);

    if (userData.role === 'admin') navigate('/admin/dashboard');
    else if (userData.role === 'teacher') navigate('/teacher/dashboard');
    else navigate('/student/dashboard');

    return res.data;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchProfile = async () => {
    try {
      const res = await authApi.getProfile();
      setUser(res.data.data);
    } catch {
      logout();
    }
  };

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    verifyEmail: handleVerifyEmail,
    logout: handleLogout,
    fetchProfile,
    updateUser,
  };
};
