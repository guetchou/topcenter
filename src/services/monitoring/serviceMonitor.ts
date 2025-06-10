
import { apiGateway } from '../api/gateway';
import { messageQueue } from '../messaging/messageQueue';
import { toast } from 'sonner';

export interface ServiceMetrics {
  serviceId: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  responseTime: number;
  lastCheck: number;
  errorCount: number;
  requestCount: number;
  uptime: number;
}

export interface SystemMetrics {
  totalServices: number;
  healthyServices: number;
  unhealthyServices: number;
  averageResponseTime: number;
  totalRequests: number;
  totalErrors: number;
}

export class ServiceMonitor {
  private metrics: Map<string, ServiceMetrics> = new Map();
  private monitoringInterval: number | null = null;
  private isMonitoring: boolean = false;

  constructor() {
    this.setupMessageHandlers();
  }

  private setupMessageHandlers() {
    // Listen for service metrics updates
    messageQueue.subscribe('service_metrics', (message) => {
      const { serviceId, metrics } = message.payload;
      this.updateMetrics(serviceId, metrics);
    });

    // Listen for service health alerts
    messageQueue.subscribe('service_health_alert', (message) => {
      const { serviceId, status, message: alertMessage } = message.payload;
      this.handleHealthAlert(serviceId, status, alertMessage);
    });
  }

  public startMonitoring(interval: number = 30000): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log('Starting service monitoring...');

    this.monitoringInterval = window.setInterval(async () => {
      await this.collectMetrics();
    }, interval);

    // Initial metrics collection
    this.collectMetrics();
  }

  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('Service monitoring stopped');
  }

  private async collectMetrics(): Promise<void> {
    const services = apiGateway.getServices();
    
    for (const service of services) {
      await this.checkServiceHealth(service.id, service.url);
    }

    // Broadcast system metrics
    const systemMetrics = this.getSystemMetrics();
    messageQueue.publish('system_metrics', systemMetrics, { target: 'broadcast' });
  }

  private async checkServiceHealth(serviceId: string, serviceUrl: string): Promise<void> {
    const startTime = Date.now();
    let currentMetrics = this.metrics.get(serviceId) || this.initializeMetrics(serviceId);

    try {
      const isHealthy = await apiGateway.checkServiceHealth(serviceId);
      const responseTime = Date.now() - startTime;

      currentMetrics = {
        ...currentMetrics,
        status: isHealthy ? 'healthy' : 'unhealthy',
        responseTime,
        lastCheck: Date.now(),
        requestCount: currentMetrics.requestCount + 1
      };

      if (!isHealthy) {
        currentMetrics.errorCount += 1;
        this.handleHealthAlert(serviceId, 'unhealthy', `Service health check failed`);
      }

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      currentMetrics = {
        ...currentMetrics,
        status: 'unhealthy',
        responseTime,
        lastCheck: Date.now(),
        requestCount: currentMetrics.requestCount + 1,
        errorCount: currentMetrics.errorCount + 1
      };

      this.handleHealthAlert(serviceId, 'unhealthy', `Service unreachable: ${error}`);
    }

    this.metrics.set(serviceId, currentMetrics);
  }

  private initializeMetrics(serviceId: string): ServiceMetrics {
    return {
      serviceId,
      status: 'unknown',
      responseTime: 0,
      lastCheck: 0,
      errorCount: 0,
      requestCount: 0,
      uptime: 0
    };
  }

  private updateMetrics(serviceId: string, updates: Partial<ServiceMetrics>): void {
    const currentMetrics = this.metrics.get(serviceId) || this.initializeMetrics(serviceId);
    this.metrics.set(serviceId, { ...currentMetrics, ...updates });
  }

  private handleHealthAlert(serviceId: string, status: string, message: string): void {
    const service = apiGateway.getServices().find(s => s.id === serviceId);
    const serviceName = service?.name || serviceId;

    if (status === 'unhealthy') {
      toast.error(`Service Alert`, {
        description: `${serviceName}: ${message}`
      });
    } else if (status === 'healthy') {
      toast.success(`Service Recovered`, {
        description: `${serviceName} is back online`
      });
    }

    // Log alert
    console.warn(`Service Alert [${serviceId}]:`, { status, message });
  }

  public getServiceMetrics(serviceId: string): ServiceMetrics | null {
    return this.metrics.get(serviceId) || null;
  }

  public getAllMetrics(): ServiceMetrics[] {
    return Array.from(this.metrics.values());
  }

  public getSystemMetrics(): SystemMetrics {
    const allMetrics = this.getAllMetrics();
    
    return {
      totalServices: allMetrics.length,
      healthyServices: allMetrics.filter(m => m.status === 'healthy').length,
      unhealthyServices: allMetrics.filter(m => m.status === 'unhealthy').length,
      averageResponseTime: allMetrics.reduce((sum, m) => sum + m.responseTime, 0) / allMetrics.length || 0,
      totalRequests: allMetrics.reduce((sum, m) => sum + m.requestCount, 0),
      totalErrors: allMetrics.reduce((sum, m) => sum + m.errorCount, 0)
    };
  }

  public generateHealthReport(): string {
    const systemMetrics = this.getSystemMetrics();
    const allMetrics = this.getAllMetrics();

    let report = `=== Service Health Report ===\n`;
    report += `Total Services: ${systemMetrics.totalServices}\n`;
    report += `Healthy: ${systemMetrics.healthyServices}\n`;
    report += `Unhealthy: ${systemMetrics.unhealthyServices}\n`;
    report += `Average Response Time: ${systemMetrics.averageResponseTime.toFixed(2)}ms\n`;
    report += `Total Requests: ${systemMetrics.totalRequests}\n`;
    report += `Total Errors: ${systemMetrics.totalErrors}\n\n`;

    report += `=== Individual Services ===\n`;
    allMetrics.forEach(metrics => {
      report += `${metrics.serviceId}: ${metrics.status} (${metrics.responseTime}ms, ${metrics.errorCount} errors)\n`;
    });

    return report;
  }
}

// Create singleton instance
export const serviceMonitor = new ServiceMonitor();
