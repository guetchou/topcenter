
import { AxiosRequestConfig } from 'axios';

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  silentError?: boolean;
}
