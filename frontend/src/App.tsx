import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useSocket } from './hooks/useSocket';
import AppRoutes from './routes/AppRoutes';

function App() {
  const location = useLocation();
  const { user } = useAuthStore();
  useSocket();

  useEffect(() => {
    if (user?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user?.theme]);

  useEffect(() => {
    if (user?.fontSize === 'large') {
      document.documentElement.classList.add('font-size-large');
      document.documentElement.classList.remove('font-size-xlarge');
    } else if (user?.fontSize === 'xlarge') {
      document.documentElement.classList.add('font-size-xlarge');
      document.documentElement.classList.remove('font-size-large');
    } else {
      document.documentElement.classList.remove('font-size-large', 'font-size-xlarge');
    }
  }, [user?.fontSize]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <AppRoutes />;
}

export default App;
