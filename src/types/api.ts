
import { AxiosRequestConfig } from 'axios';

/**
 * Extended Axios request config with additional custom properties
 */
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  /**
   * If true, global error handlers will not be triggered for this request
   */
  silentError?: boolean;
  
  /**
   * If true, request will not be cached
   */
  noCache?: boolean;
  
  /**
   * Custom retry policy
   */
  retry?: number;
  
  /**
   * Custom timeout for specific requests
   */
  customTimeout?: number;
}
