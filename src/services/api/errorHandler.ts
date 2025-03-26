
import { toast } from '@/components/ui/use-toast';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message: string;
  details?: string;
  code?: string;
}

// Parse error response from different formats
const parseErrorResponse = (error: unknown): ApiErrorResponse => {
  if (error && typeof error === 'object') {
    // Axios error handling
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError<any>;
      
      // Response exists with data
      if (axiosError.response?.data) {
        const data = axiosError.response.data;
        
        // Different API error formats
        if (typeof data === 'object') {
          if (data.message) {
            return {
              message: data.message,
              details: data.details || data.error || undefined,
              code: data.code || undefined
            };
          } else if (data.error) {
            return {
              message: typeof data.error === 'string' ? data.error : 'Une erreur est survenue',
              details: data.error_description || undefined
            };
          }
        }
        
        // String error message
        if (typeof data === 'string') {
          return { message: data };
        }
      }
      
      // Use Axios error message if available
      if (axiosError.message) {
        return { 
          message: axiosError.message.includes('Network Error') 
            ? 'Erreur de connexion au serveur' 
            : axiosError.message
        };
      }
    }
    
    // Handle Error object
    if (error instanceof Error) {
      return { message: error.message };
    }
  }
  
  // Default fallback
  return { message: 'Une erreur inconnue est survenue' };
};

// Main error handler
export const handleApiError = (error: unknown, customMessage?: string): void => {
  const errorResponse = parseErrorResponse(error);
  
  toast({
    title: customMessage || 'Erreur',
    description: errorResponse.message,
    variant: 'destructive',
  });
  
  // Log error for debugging
  console.error('API Error:', error);
};
