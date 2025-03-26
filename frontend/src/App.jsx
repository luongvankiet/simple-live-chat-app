import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Loader from './components/loader';
import Navbar from './components/navbar';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import Router from './routes';

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuth();

  const { theme } = useTheme();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return <Loader />;
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Router />
      <Toaster />
    </div>
  );
}

export default App;
