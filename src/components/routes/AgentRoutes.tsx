
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/pages/Dashboard';

export const AgentRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !['commercial_agent', 'support_agent'].includes(user?.role || '')) {
    return <Navigate to="/login" replace />;
  }

  return <Dashboard />;
};

export default AgentRoutes;
