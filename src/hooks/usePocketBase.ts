
import { useEffect, useState } from 'react';
import { pb, getCurrentUser, isUserValid } from '@/integrations/pocketbase/client';
import type { RecordModel } from 'pocketbase';

export function usePocketBase<T extends RecordModel = RecordModel>(
  collectionName: string,
  options: {
    autoSubscribe?: boolean;
    filter?: string;
    sort?: string;
    limit?: number;
  } = {}
) {
  const { autoSubscribe = true, filter = '', sort = '-created', limit = 50 } = options;
  const [records, setRecords] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(isUserValid());

  // Authenticate user
  const login = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error : new Error('Failed to login'));
      return false;
    }
  };

  // Register a new user
  const register = async (email: string, password: string, passwordConfirm: string, name: string) => {
    try {
      const data = {
        email,
        password,
        passwordConfirm,
        name
      };
      await pb.collection('users').create(data);
      await login(email, password);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error : new Error('Failed to register'));
      return false;
    }
  };

  // Logout user
  const logout = () => {
    pb.authStore.clear();
    setIsAuthenticated(false);
  };

  // Get current user
  const user = getCurrentUser();

  // Fetch records from collection
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const result = await pb.collection(collectionName).getList<T>(1, limit, {
        filter,
        sort
      });
      setRecords(result.items);
      setError(null);
    } catch (e) {
      console.error(`Error fetching ${collectionName}:`, e);
      setError(e instanceof Error ? e : new Error(`Failed to fetch ${collectionName}`));
    } finally {
      setLoading(false);
    }
  };

  // Create a new record
  const createRecord = async (data: Record<string, any>) => {
    try {
      const record = await pb.collection(collectionName).create<T>(data);
      setRecords(prev => [...prev, record]);
      return record;
    } catch (e) {
      console.error(`Error creating ${collectionName}:`, e);
      setError(e instanceof Error ? e : new Error(`Failed to create ${collectionName}`));
      throw e;
    }
  };

  // Update an existing record
  const updateRecord = async (id: string, data: Record<string, any>) => {
    try {
      const record = await pb.collection(collectionName).update<T>(id, data);
      setRecords(prev => prev.map(r => r.id === id ? record : r));
      return record;
    } catch (e) {
      console.error(`Error updating ${collectionName}:`, e);
      setError(e instanceof Error ? e : new Error(`Failed to update ${collectionName}`));
      throw e;
    }
  };

  // Delete a record
  const deleteRecord = async (id: string) => {
    try {
      await pb.collection(collectionName).delete(id);
      setRecords(prev => prev.filter(r => r.id !== id));
      return true;
    } catch (e) {
      console.error(`Error deleting ${collectionName}:`, e);
      setError(e instanceof Error ? e : new Error(`Failed to delete ${collectionName}`));
      throw e;
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchRecords();
  }, [collectionName, filter, sort, limit]);

  // Subscribe to realtime updates if autoSubscribe is true
  useEffect(() => {
    if (!autoSubscribe) return;

    let unsubscribePromise: Promise<void> | null = null;

    try {
      // The subscribe method returns a promise that resolves to an unsubscribe function
      unsubscribePromise = pb.collection(collectionName).subscribe('*', (data) => {
        if (data.action === 'create') {
          setRecords(prev => [...prev, data.record as T]);
        } else if (data.action === 'update') {
          setRecords(prev => prev.map(r => r.id === data.record.id ? (data.record as T) : r));
        } else if (data.action === 'delete') {
          setRecords(prev => prev.filter(r => r.id !== data.record.id));
        }
      });
    } catch (error) {
      console.error('Error subscribing to collection changes:', error);
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribePromise) {
        // Make sure to handle the promise properly
        unsubscribePromise.then(unsubscribe => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        }).catch(err => {
          console.error('Error unsubscribing:', err);
        });
      }
    };
  }, [collectionName, autoSubscribe]);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setIsAuthenticated(isUserValid());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    records,
    loading,
    error,
    refresh: fetchRecords,
    create: createRecord,
    update: updateRecord,
    delete: deleteRecord,
    isAuthenticated,
    login,
    logout,
    register,
    user
  };
}
