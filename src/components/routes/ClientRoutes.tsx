
/**
 * Ce composant est déprécié, utilisez ProtectedRoute avec le composant ClientPortal
 * directement dans App.tsx
 * 
 * Exemple:
 * <Route path="/client" element={
 *   <ProtectedRoute>
 *     <ClientPortal />
 *   </ProtectedRoute>
 * } />
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ClientPortal from '@/pages/ClientPortal';

export const ClientRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'client') {
    return <Navigate to="/login" replace />;
  }

  return <ClientPortal />;
};

export default ClientRoutes;
