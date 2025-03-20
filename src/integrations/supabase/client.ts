
// Ce fichier est une couche de compatibilité pour les composants qui utilisent encore l'ancien client Supabase
// Il redirige toutes les importations vers le nouveau client API

import { apiClient } from '@/integrations/api/client';

// Exporter le client API sous forme de supabase pour compatibilité
export const supabase = apiClient;
export default apiClient;
