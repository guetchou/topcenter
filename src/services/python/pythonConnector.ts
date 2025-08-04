
import { externalServicesManager } from '../integrations/externalServices';
import { clientAuth } from '../auth/clientAuth';

export interface PythonServiceRequest {
  service: 'data' | 'ai';
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  authenticated?: boolean;
}

export interface PythonServiceResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    service: string;
    timestamp: string;
    processing_time?: number;
  };
}

export class PythonConnector {
  private serviceMapping = {
    data: 'python-data-service',
    ai: 'python-ai-service'
  };

  public async callService(request: PythonServiceRequest): Promise<PythonServiceResponse> {
    const serviceId = this.serviceMapping[request.service];
    const integration = externalServicesManager.getIntegration(serviceId);
    
    if (!integration) {
      return {
        success: false,
        error: `Service ${request.service} not configured`
      };
    }

    try {
      let result;
      
      if (request.authenticated) {
        // Use authenticated call through microservice auth
        result = await clientAuth.callAuthenticatedService(
          serviceId,
          request.endpoint,
          {
            method: request.method || 'POST',
            data: request.data,
            permissions: ['python:read', 'python:write']
          }
        );
      } else {
        // Direct call to Python service
        result = await externalServicesManager.callPythonService(
          serviceId,
          request.endpoint,
          request.data
        );
      }

      return {
        success: true,
        data: result,
        metadata: {
          service: request.service,
          timestamp: new Date().toISOString(),
          processing_time: result.processing_time
        }
      };

    } catch (error: any) {
      console.error(`Python service call failed:`, error);
      
      return {
        success: false,
        error: error.message || 'Service call failed',
        metadata: {
          service: request.service,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Specific methods for data analysis
  public async analyzeData(data: any[], analysisType: string): Promise<PythonServiceResponse> {
    return this.callService({
      service: 'data',
      endpoint: '/analyze',
      data: {
        type: analysisType,
        data,
        options: {
          format: 'json',
          include_visualizations: true
        }
      },
      authenticated: true
    });
  }

  // Specific methods for AI processing
  public async processWithAI(model: string, input: any): Promise<PythonServiceResponse> {
    return this.callService({
      service: 'ai',
      endpoint: '/process',
      data: {
        model,
        input,
        options: {
          max_tokens: 1000,
          temperature: 0.7
        }
      },
      authenticated: true
    });
  }

  // Batch processing for large datasets
  public async batchProcess(
    service: 'data' | 'ai',
    items: any[],
    batchSize: number = 10
  ): Promise<PythonServiceResponse[]> {
    const results: PythonServiceResponse[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      try {
        const result = await this.callService({
          service,
          endpoint: '/batch',
          data: { items: batch },
          authenticated: true
        });
        
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: `Batch ${i / batchSize + 1} failed: ${error.message}`
        });
      }
    }
    
    return results;
  }

  // Health check for Python services
  public async checkServiceHealth(service: 'data' | 'ai'): Promise<boolean> {
    try {
      const result = await this.callService({
        service,
        endpoint: '/health',
        method: 'GET',
        authenticated: false
      });
      
      return result.success;
    } catch (error) {
      return false;
    }
  }

  // Get service capabilities
  public async getServiceInfo(service: 'data' | 'ai'): Promise<any> {
    try {
      const result = await this.callService({
        service,
        endpoint: '/info',
        method: 'GET',
        authenticated: false
      });
      
      return result.data;
    } catch (error) {
      return null;
    }
  }
}

// Singleton instance
export const pythonConnector = new PythonConnector();
