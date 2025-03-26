
import PocketBase from 'pocketbase';

let pocketbaseInstance: PocketBase | null = null;

export const initPocketBase = (url?: string) => {
  const pocketbaseUrl = url || import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090';
  pocketbaseInstance = new PocketBase(pocketbaseUrl);
  return pocketbaseInstance;
};

export const getPocketbase = (): PocketBase => {
  if (!pocketbaseInstance) {
    return initPocketBase();
  }
  return pocketbaseInstance;
};

export default getPocketbase;
