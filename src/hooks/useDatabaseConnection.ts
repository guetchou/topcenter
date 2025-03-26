
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface DatabaseConnectionOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: boolean;
}

interface ConnectionResult {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: (options?: Partial<DatabaseConnectionOptions>) => Promise<boolean>;
  disconnect: () => void;
  executeQuery: (query: string, params?: any[]) => Promise<any>;
}

// Configuration par défaut pour Infomaniak
const defaultInfomaniakConfig: DatabaseConnectionOptions = {
  host: import.meta.env.VITE_DB_HOST || 'rj8dl.myd.infomaniak.com',
  port: parseInt(import.meta.env.VITE_DB_PORT || '3306'),
  user: import.meta.env.VITE_DB_USER || '',
  password: import.meta.env.VITE_DB_PASSWORD || '',
  database: import.meta.env.VITE_DB_NAME || 'rj8dl_topcenter_moderne',
  ssl: import.meta.env.VITE_DB_SSL === 'true'
};

export const useDatabaseConnection = (
  initialOptions?: DatabaseConnectionOptions
): ConnectionResult => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionOptions, setConnectionOptions] = useState<DatabaseConnectionOptions | null>(
    initialOptions || defaultInfomaniakConfig
  );

  // Fonction pour se connecter à la base de données
  const connect = async (options?: Partial<DatabaseConnectionOptions>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Combiner les options existantes avec les nouvelles options
      const newOptions = {
        ...(connectionOptions || {}),
        ...(options || {})
      };

      // Vérifier si les informations essentielles sont présentes
      if (!newOptions.host || !newOptions.user || !newOptions.password || !newOptions.database) {
        throw new Error('Informations de connexion incomplètes');
      }

      // Envoyer une requête au serveur backend pour tester la connexion
      const response = await axios.post('/api/database/connect', newOptions);

      if (response.data.success) {
        setConnectionOptions(newOptions as DatabaseConnectionOptions);
        setIsConnected(true);
        toast.success('Connexion à la base de données établie');
        return true;
      } else {
        throw new Error(response.data.message || 'Échec de la connexion à la base de données');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      toast.error(`Erreur de connexion: ${errorMessage}`);
      console.error('Erreur de connexion à la base de données:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour se déconnecter
  const disconnect = () => {
    setIsConnected(false);
    setConnectionOptions(null);
    toast.info('Déconnecté de la base de données');
  };

  // Fonction pour exécuter une requête SQL
  const executeQuery = async (query: string, params: any[] = []): Promise<any> => {
    if (!isConnected || !connectionOptions) {
      toast.error('Non connecté à la base de données');
      throw new Error('Non connecté à la base de données');
    }

    try {
      const response = await axios.post('/api/database/query', {
        query,
        params,
        connectionOptions
      });

      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      toast.error(`Erreur SQL: ${errorMessage}`);
      console.error('Erreur lors de l\'exécution de la requête:', err);
      throw err;
    }
  };

  // Tenter une connexion automatique si des options initiales sont fournies
  useEffect(() => {
    const autoConnect = async () => {
      // Si déjà en train de se connecter ou déjà connecté, ne rien faire
      if (isLoading || isConnected) return;
      
      // Vérifier si toutes les informations nécessaires sont disponibles
      const config = connectionOptions || defaultInfomaniakConfig;
      if (config.host && config.user && config.password && config.database) {
        await connect(config);
      }
    };
    
    autoConnect();
  }, []); // Se connecter une seule fois au chargement

  return {
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    executeQuery
  };
};

export default useDatabaseConnection;
