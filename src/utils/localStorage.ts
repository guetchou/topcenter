
/**
 * Utilities for working with localStorage with type safety and error handling
 */

/**
 * Set an item in localStorage with JSON serialization
 */
export const setItem = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error storing item ${key} in localStorage:`, error);
  }
};

/**
 * Get an item from localStorage with parsing and type safety
 */
export const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error retrieving item ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Remove an item from localStorage
 */
export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
  }
};

/**
 * Clear all items from localStorage
 */
export const clearAll = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Check if an item exists in localStorage
 */
export const hasItem = (key: string): boolean => {
  return localStorage.getItem(key) !== null;
};
