
import { apiGateway } from '../api/gateway';
import { messageQueue } from '../messaging/messageQueue';
import { microserviceAuth } from '../auth/microserviceAuth';
import { serviceMonitor } from '../monitoring/serviceMonitor';

export class ServiceOrchestrator {
  private isInitialized: boolean = false;

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('Service orchestrator already initialized');
      return;
    }

    console.log('Initializing microservices infrastructure...');

    try {
      // Initialize monitoring
      serviceMonitor.startMonitoring();

      // Register core services with authentication
      await this.registerCoreServices();

      // Setup inter-service communication handlers
      this.setupCommunicationHandlers();

      // Check initial service health
      await this.performInitialHealthCheck();

      this.isInitialized = true;
      console.log('Microservices infrastructure initialized successfully');

      // Notify about successful initialization
      messageQueue.publish('infrastructure_ready', {
        timestamp: Date.now(),
        services: apiGateway.getServices().map(s => s.id)
      });

    } catch (error) {
      console.error('Failed to initialize microservices infrastructure:', error);
      throw error;
    }
  }

  private async registerCoreServices(): Promise<void> {
    // Register Node.js backend services
    await microserviceAuth.registerService('auth', ['user:read', 'user:write', 'admin:read']);
    await microserviceAuth.registerService('deploy', ['deploy:read', 'deploy:write', 'admin:read']);
    await microserviceAuth.registerService('analytics', ['analytics:read', 'admin:read']);

    // Register Python services (will be available when implemented)
    await microserviceAuth.registerService('python-data', ['data:read', 'data:write', 'analytics:read']);
    await microserviceAuth.registerService('python-ai', ['ai:read', 'ai:write', 'analytics:read']);

    console.log('Core services registered with authentication');
  }

  private setupCommunicationHandlers(): void {
    // Handle deployment requests
    messageQueue.subscribe('deploy_request', async (message) => {
      const { deploymentData, userId } = message.payload;
      
      try {
        const result = await microserviceAuth.callAuthenticatedService(
          'deploy',
          '/start-deployment',
          {
            method: 'POST',
            data: deploymentData,
            permissions: ['deploy:write']
          }
        );

        messageQueue.publish('deploy_started', { result, userId });
      } catch (error) {
        messageQueue.publish('deploy_failed', { error: error.message, userId });
      }
    });

    // Handle data analysis requests (for future Python service)
    messageQueue.subscribe('data_analysis_request', async (message) => {
      const { analysisType, data, userId } = message.payload;
      
      try {
        const result = await microserviceAuth.callAuthenticatedService(
          'python-data',
          '/analyze',
          {
            method: 'POST',
            data: { type: analysisType, data },
            permissions: ['data:read', 'analytics:read']
          }
        );

        messageQueue.publish('data_analysis_complete', { result, userId });
      } catch (error) {
        console.error('Data analysis service not available:', error);
        messageQueue.publish('data_analysis_failed', { 
          error: 'Service temporairement indisponible', 
          userId 
        });
      }
    });

    // Handle AI processing requests (for future Python service)
    messageQueue.subscribe('ai_process_request', async (message) => {
      const { modelType, input, userId } = message.payload;
      
      try {
        const result = await microserviceAuth.callAuthenticatedService(
          'python-ai',
          '/process',
          {
            method: 'POST',
            data: { model: modelType, input },
            permissions: ['ai:read']
          }
        );

        messageQueue.publish('ai_process_complete', { result, userId });
      } catch (error) {
        console.error('AI service not available:', error);
        messageQueue.publish('ai_process_failed', { 
          error: 'Service IA temporairement indisponible', 
          userId 
        });
      }
    });

    console.log('Inter-service communication handlers set up');
  }

  private async performInitialHealthCheck(): Promise<void> {
    console.log('Performing initial health check...');
    
    const healthStatus = await apiGateway.checkAllServicesHealth();
    const healthyServices = Object.entries(healthStatus).filter(([_, isHealthy]) => isHealthy);
    const unhealthyServices = Object.entries(healthStatus).filter(([_, isHealthy]) => !isHealthy);

    console.log(`Health check complete: ${healthyServices.length} healthy, ${unhealthyServices.length} unhealthy`);
    
    if (unhealthyServices.length > 0) {
      console.warn('Unhealthy services:', unhealthyServices.map(([id]) => id));
    }
  }

  // Public API methods for triggering service calls
  public async triggerDeployment(deploymentData: any): Promise<void> {
    return messageQueue.publish('deploy_request', {
      deploymentData,
      userId: this.getCurrentUserId()
    });
  }

  public async requestDataAnalysis(analysisType: string, data: any): Promise<void> {
    return messageQueue.publish('data_analysis_request', {
      analysisType,
      data,
      userId: this.getCurrentUserId()
    });
  }

  public async requestAIProcessing(modelType: string, input: any): Promise<void> {
    return messageQueue.publish('ai_process_request', {
      modelType,
      input,
      userId: this.getCurrentUserId()
    });
  }

  private getCurrentUserId(): string {
    // Get current user ID from auth state or token
    const token = localStorage.getItem('auth_token');
    if (token && token !== 'dev-mode-token') {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.id || 'anonymous';
      } catch {
        return 'anonymous';
      }
    }
    return 'dev-user';
  }

  public getStatus() {
    return {
      isInitialized: this.isInitialized,
      systemMetrics: serviceMonitor.getSystemMetrics(),
      queueStatus: messageQueue.getStatus(),
      services: apiGateway.getServices()
    };
  }

  public async shutdown(): Promise<void> {
    console.log('Shutting down microservices infrastructure...');
    
    serviceMonitor.stopMonitoring();
    apiGateway.stopHealthChecks();
    
    this.isInitialized = false;
    console.log('Microservices infrastructure shut down');
  }
}

// Create singleton instance
export const serviceOrchestrator = new ServiceOrchestrator();
