
import PocketBase from 'pocketbase';

// Create a single PocketBase instance to use throughout the app
export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Export the PocketBase types for use in the app
export type { RecordModel, RecordService } from 'pocketbase';

// Helper to extract the type from a collection
export type TypedPocketBase<T extends Record<string, any> = Record<string, any>> = PocketBase & {
  collection(idOrName: string): RecordService<T>;
};

// Authentication helpers
export const isUserValid = () => {
  return pb.authStore.isValid;
};

export const getCurrentUser = () => {
  return pb.authStore.model;
};

export const logout = () => {
  pb.authStore.clear();
};

// Auto refresh authentication token
pb.autoCancellation(false);

// Initialize the auth store from localStorage
try {
  // Load auth state from localStorage on startup
  const authData = localStorage.getItem('pocketbase_auth');
  if (authData) {
    const { token, model } = JSON.parse(authData);
    pb.authStore.save(token, model);
  }
} catch (error) {
  console.error('Error initializing PocketBase auth:', error);
  // Clear potentially corrupted auth data
  localStorage.removeItem('pocketbase_auth');
  pb.authStore.clear();
}

// Persist auth store changes to localStorage
pb.authStore.onChange((token, model) => {
  if (token) {
    localStorage.setItem('pocketbase_auth', JSON.stringify({ token, model }));
  } else {
    localStorage.removeItem('pocketbase_auth');
  }
});

export default pb;
