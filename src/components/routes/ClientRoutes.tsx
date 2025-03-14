
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ClientPortal from '@/pages/ClientPortal';
import Settings from '@/pages/Settings';

export const ClientRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'client') {
    return <Navigate to="/login" replace />;
  }

  // Retourner les éléments de route au lieu d'un composant Routes
  return (
    <>
      <Route index element={<ClientPortal />} />
      <Route path="settings" element={<Settings />} />
    </>
  );
};
