
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type DeploymentLogType = 'info' | 'success' | 'error' | 'warning';

export interface DeploymentLog {
  id: string;
  message: string;
  type: DeploymentLogType;
  timestamp: Date;
}

export const useDeploymentLogs = () => {
  const [logs, setLogs] = useState<DeploymentLog[]>([]);

  const addLog = useCallback((message: string, type: DeploymentLogType = 'info') => {
    const log: DeploymentLog = {
      id: uuidv4(),
      message,
      type,
      timestamp: new Date()
    };
    
    setLogs(prev => [...prev, log]);
    return log;
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
