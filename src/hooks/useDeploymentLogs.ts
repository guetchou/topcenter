
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface DeploymentLog {
  id: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'error' | 'warning';
}

export const useDeploymentLogs = () => {
  const [logs, setLogs] = useState<DeploymentLog[]>([]);

  const addLog = useCallback((message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const newLog: DeploymentLog = {
      id: uuidv4(),
      message,
      timestamp: new Date(),
      type
    };

    setLogs(prevLogs => [...prevLogs, newLog]);
    
    return newLog;
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return {
    logs,
    addLog,
    clearLogs
  };
};
