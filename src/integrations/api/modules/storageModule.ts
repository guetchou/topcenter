
import { processResponse } from '../utils';
import api from '@/services/api';

// Module pour le stockage
export const storageModule = {
  from: (bucket: string) => ({
    upload: async (path: string, file: File) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post(`/files/${bucket}/${path}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        return { data: response.data, error: null };
      } catch (error) {
        console.error(`Erreur lors de l'upload dans ${bucket}:`, error);
        return { data: null, error };
      }
    },
    getPublicUrl: (path: string) => {
      return {
        data: {
          publicUrl: `${process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000/api'}/files/${bucket}/${path}`
        }
      };
    }
  })
};
