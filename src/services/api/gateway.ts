
import { apiClient } from './index';
import { toast } from 'sonner';

interface ServiceEndpoint {
  name: string;
  url: string;
  healthCheck: string;
  timeout?: number;
}

export class APIGateway {
  private services: Map<string, ServiceEndpoint> = new Map();
  private healthCheckInterval: number | null = null;

  constructor() {
    this.initializeServices();
    this.startHealthChecks();
  }

  private initializeServices() {
    // Register available services
    this.registerService('auth', {
      name: 'Authentication Service',
      url: import.meta.env.VITE_AUTH_SERVICE_URL || '/api/auth',
      healthCheck: '/health'
    });

    this.registerService('deploy', {
      name: 'Deployment Service',
      url: import.meta.env.VITE_DEPLOY_SERVICE_URL || '/api/deploy',
      healthCheck: '/health'
    });

    this.registerService('analytics', {
      name: 'Analytics Service',
      url: import.meta.env.VITE_ANALYTICS_SERVICE_URL || '/api/analytics',
      healthCheck: '/health'
    });

    // Python services (when available)
    this.registerService('python-data', {
      name: 'Python Data Service',
      url: import.meta.env.VITE_PYTHON_DATA_SERVICE_URL || 'http://localhost:8001',
      healthCheck: '/health',
      timeout: 10000
    });

    this.registerService('python-ai', {
      name: 'Python AI Service',
      url: import.meta.env.VITE_PYTHON_AI_SERVICE_URL || 'http://localhost:8002',
      healthCheck: '/health',
      timeout: 15000
    });
  }

  public registerService(id: string, service: ServiceEndpoint) {
    this.services.set(id, service);
    console.log(`Service registered: ${service.name} at ${service.url}`);
  }

  public async callService<T>(serviceId: string, endpoint: string, options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    headers?: Record<string, string>;
    timeout?: number;
  }): Promise<T> {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    const { method = 'GET', data, headers = {}, timeout = service.timeout || 30000 } = options || {};
    
    try {
      const response = await apiClient.request({
        method,
        url: `${service.url}${endpoint}`,
        data,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        timeout
      });

      return response.data;
    } catch (error: any) {
      console.error(`Error calling ${service.name}:`, error);
      
      if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
        toast.error(`Service indisponible`, {
          description: `Le service ${service.name} n'est pas accessible`
        });
      }
      
      throw error;
    }
  }

  public async checkServiceHealth(serviceId: string): Promise<boolean> {
    const service = this.services.get(serviceId);
    if (!service) return false;

    try {
      await this.callService(serviceId, service.healthCheck, { timeout: 5000 });
      return true;
    } catch (error) {
      console.warn(`Health check failed for ${service.name}`);
      return false;
    }
  }

  public async checkAllServicesHealth(): Promise<Record<string, boolean>> {
    const healthStatus: Record<string, boolean> = {};
    
    for (const [serviceId] of this.services) {
      healthStatus[serviceId] = await this.checkServiceHealth(serviceId);
    }
    
    return healthStatus;
  }

  private startHealthChecks() {
    // Check service health every 30 seconds
    this.healthCheckInterval = window.setInterval(async () => {
      const healthStatus = await this.checkAllServicesHealth();
      
      // Log unhealthy services
      Object.entries(healthStatus).forEach(([serviceId, isHealthy]) => {
        if (!isHealthy) {
          const service = this.services.get(serviceId);
          console.warn(`Service ${service?.name} is unhealthy`);
        }
      });
    }, 30000);
  }

  public stopHealthChecks() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  public getServices() {
    return Array.from(this.services.entries()).map(([id, service]) => ({
      id,
      ...service
    }));
  }
}

// Create singleton instance
export const apiGateway = new APIGateway();
