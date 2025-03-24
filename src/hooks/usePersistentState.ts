
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

/**
 * A hook that works like useState but persists the data to localStorage
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T,
  storage: Storage = localStorage
): [T, Dispatch<SetStateAction<T>>] {
  // Get stored value from storage or use initialValue
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = storage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error(`Error reading persisted state for key "${key}":`, error);
      return initialValue;
    }
  });

  // Update storage when state changes
  useEffect(() => {
    try {
      if (state === undefined) {
        storage.removeItem(key);
      } else {
        storage.setItem(key, JSON.stringify(state));
      }
    } catch (error) {
      console.error(`Error persisting state for key "${key}":`, error);
    }
  }, [key, state, storage]);

  return [state, setState];
}

/**
 * A hook that works like useState but persists the data in sessionStorage
 * (data is kept only for the current session/tab)
 */
export function useSessionState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  return usePersistentState(key, initialValue, sessionStorage);
}

export default usePersistentState;
