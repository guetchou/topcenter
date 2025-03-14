
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';

export const AgentRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !['commercial_agent', 'support_agent'].includes(user?.role || '')) {
    return <Navigate to="/login" replace />;
  }

  // Retourner les éléments de route au lieu d'un composant Routes
  return (
    <>
      <Route index element={<Dashboard />} />
      <Route path="settings" element={<Settings />} />
    </>
  );
};
