
import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/pages/Dashboard';
import NewsAdmin from '@/pages/NewsAdmin';
import Settings from '@/pages/Settings';

export const AdminRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="news" element={<NewsAdmin />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};
