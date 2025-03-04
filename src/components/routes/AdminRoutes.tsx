
import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/pages/Dashboard';
import NewsAdmin from '@/pages/NewsAdmin';
import Settings from '@/pages/Settings';
import UserManagement from '@/pages/admin/UserManagement';

export const AdminRoutes = () => {
  const { user, impersonatedUser } = useAuth();
  const activeUser = impersonatedUser || user;

  // Vérifier si l'utilisateur est admin ou super_admin
  if (!activeUser || (activeUser.role !== 'admin' && activeUser.role !== 'super_admin')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="news" element={<NewsAdmin />} />
      <Route path="settings" element={<Settings />} />
      {activeUser.role === 'super_admin' && (
        <Route path="users" element={<UserManagement />} />
      )}
    </Routes>
  );
};
