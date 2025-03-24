
import { useState, useEffect, useCallback } from 'react';

interface UseIdleOptions {
  timeout?: number;
  onIdle?: () => void;
  onActive?: () => void;
  events?: string[];
}

export function useIdle({
  timeout = 5 * 60 * 1000, // 5 minutes by default
  onIdle,
  onActive,
  events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
}: UseIdleOptions = {}) {
  const [isIdle, setIsIdle] = useState(false);
  const [lastActive, setLastActive] = useState(Date.now());
  const [idleTimer, setIdleTimer] = useState<number | null>(null);

  // Reset idle timer
  const handleUserActivity = useCallback(() => {
    setLastActive(Date.now());
    
    if (isIdle) {
      setIsIdle(false);
      onActive?.();
    }
    
    // Clear any existing timer
    if (idleTimer) {
      window.clearTimeout(idleTimer);
    }
    
    // Set a new timer
    const timer = window.setTimeout(() => {
      const now = Date.now();
      const idle = now - lastActive >= timeout;
      
      if (idle && !isIdle) {
        setIsIdle(true);
        onIdle?.();
      }
    }, timeout);
    
    setIdleTimer(timer);
  }, [idleTimer, isIdle, lastActive, onActive, onIdle, timeout]);
  
  useEffect(() => {
    handleUserActivity();
    
    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Clean up
    return () => {
      if (idleTimer) {
        window.clearTimeout(idleTimer);
      }
      
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [handleUserActivity, events, idleTimer]);
  
  // Function to manually reset the idle state
  const reset = useCallback(() => {
    handleUserActivity();
  }, [handleUserActivity]);
  
  return { isIdle, lastActive, reset };
}

export default useIdle;
