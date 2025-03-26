
import { useState, useEffect } from 'react';
import axios from 'axios';

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

export const useDatabaseConnection = (
  initialOptions?: DatabaseConnectionOptions
): ConnectionResult => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionOptions, setConnectionOptions] = useState<DatabaseConnectionOptions | null>(
    initialOptions || null
  );

  // Fonction pour se connecter à la base de données
  const connect = async (options?: Partial<DatabaseConnectionOptions>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Combiner les options existantes avec les nouvelles options
      const newOptions = {
        ...(connectionOptions || {}),
        ...(options || {}),
        // Utiliser les variables d'environnement si disponibles
        host: options?.host || import.meta.env.VITE_DB_HOST || 'rj8dl.myd.infomaniak.com',
        port: options?.port || parseInt(import.meta.env.VITE_DB_PORT || '3306'),
        user: options?.user || import.meta.env.VITE_DB_USER,
        password: options?.password || import.meta.env.VITE_DB_PASSWORD,
        database: options?.database || import.meta.env.VITE_DB_NAME || 'rj8dl_topcenter_moderne',
        ssl: options?.ssl !== undefined ? options.ssl : import.meta.env.VITE_DB_SSL === 'true'
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
        return true;
      } else {
        throw new Error(response.data.message || 'Échec de la connexion à la base de données');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
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
  };

  // Fonction pour exécuter une requête SQL
  const executeQuery = async (query: string, params: any[] = []): Promise<any> => {
    if (!isConnected || !connectionOptions) {
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
      console.error('Erreur lors de l\'exécution de la requête:', err);
      throw err;
    }
  };

  // Tenter une connexion automatique si des options initiales sont fournies
  useEffect(() => {
    if (initialOptions && !isConnected && !isLoading) {
      connect(initialOptions);
    }
  }, []);

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
