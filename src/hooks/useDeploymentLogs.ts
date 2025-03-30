
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type LogType = 'info' | 'warning' | 'error' | 'success';

export interface Log {
  id: string;
  message: string;
  type: LogType;
  timestamp: Date;
}

export const useDeploymentLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  const addLog = useCallback((message: string, type: LogType = 'info') => {
    const newLog: Log = {
      id: uuidv4(),
      message,
      type,
      timestamp: new Date()
    };
    
    setLogs(prevLogs => [newLog, ...prevLogs].slice(0, 100)); // Limiter à 100 logs
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
