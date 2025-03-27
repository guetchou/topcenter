
import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

type LogLevel = 'info' | 'success' | 'error' | 'warning';

export interface DeploymentLog {
  id: string;
  message: string;
  timestamp: Date;
  type: LogLevel;
}

export const useDeploymentLogs = (deploymentId?: string) => {
  const [logs, setLogs] = useState<DeploymentLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Connexion WebSocket pour les logs en temps réel
  const wsUrl = import.meta.env.VITE_LOGS_WEBSOCKET_URL || 'wss://api.topcenter.cg/logs';
  const { isConnected, messages, sendMessage } = useWebSocket(wsUrl);
  
  // Fonction pour ajouter un log localement (pour les actions non-serveur)
  const addLog = (message: string, type: LogLevel = 'info') => {
    const newLog: DeploymentLog = {
      id: Date.now().toString(),
      message,
      timestamp: new Date(),
      type
    };
    setLogs(prev => [newLog, ...prev]);
    return newLog;
  };
  
  // Écouter les messages WebSocket
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage.type === 'deployment_log') {
        const newLog: DeploymentLog = {
          id: lastMessage.payload.id || Date.now().toString(),
          message: lastMessage.payload.message,
          timestamp: new Date(lastMessage.payload.timestamp || Date.now()),
          type: lastMessage.payload.level || 'info'
        };
        
        setLogs(prev => {
          // Éviter les doublons
          if (prev.some(log => log.id === newLog.id)) {
            return prev;
          }
          return [newLog, ...prev];
        });
      }
    }
  }, [messages]);
  
  // Charger les logs historiques au démarrage si un deploymentId est fourni
  useEffect(() => {
    if (deploymentId) {
      setIsLoading(true);
      
      fetch(`/api/deployments/${deploymentId}/logs`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors du chargement des logs');
          }
          return response.json();
        })
        .then(data => {
          const formattedLogs: DeploymentLog[] = data.map((log: any) => ({
            id: log.id,
            message: log.message,
            timestamp: new Date(log.timestamp),
            type: log.level || 'info'
          }));
          
          setLogs(formattedLogs);
        })
        .catch(err => {
          console.error('Erreur lors du chargement des logs:', err);
          setError(err);
          addLog(`Erreur lors du chargement des logs: ${err.message}`, 'error');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [deploymentId]);
  
  // Souscrire au canal de logs pour un déploiement spécifique
  useEffect(() => {
    if (isConnected && deploymentId) {
      sendMessage({
        type: 'subscribe',
        payload: { channel: `deployment:${deploymentId}` }
      });
      
      return () => {
        sendMessage({
          type: 'unsubscribe',
          payload: { channel: `deployment:${deploymentId}` }
        });
      };
    }
  }, [isConnected, deploymentId, sendMessage]);
  
  return {
    logs,
    isLoading,
    error,
    isConnected: isConnected,
    addLog
  };
};
