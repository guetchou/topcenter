import { pythonConnector } from './pythonConnector';
import { apiGateway } from '../api/gateway';
import { clientAuth } from '../auth/clientAuth';

export interface DataAnalysisRequest {
  type: 'sales' | 'customer' | 'performance' | 'predictive';
  data: any[];
  options?: {
    timeRange?: string;
    groupBy?: string;
    metrics?: string[];
  };
}

export interface DataAnalysisResult {
  analysis: {
    summary: string;
    insights: string[];
    recommendations: string[];
  };
  visualizations: {
    type: 'chart' | 'table' | 'graph';
    data: any;
    config: any;
  }[];
  predictions?: {
    trend: 'up' | 'down' | 'stable';
    confidence: number;
    nextPeriod: any;
  };
}

export interface DataProcessingJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: DataAnalysisResult;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export class PythonDataService {
  private baseUrl: string;
  private jobs: Map<string, DataProcessingJob> = new Map();

  constructor() {
    this.baseUrl = import.meta.env.VITE_PYTHON_DATA_SERVICE_URL || 'http://localhost:8001';
    this.registerService();
  }

  private async registerService() {
    // Register the Python data service with the API gateway
    apiGateway.registerService('python-data', {
      name: 'Python Data Analytics Service',
      url: this.baseUrl,
      healthCheck: '/health',
      timeout: 30000
    });
  }

  public async analyzeData(request: DataAnalysisRequest): Promise<string> {
    try {
      // Use the new Python connector for real service calls
      const response = await pythonConnector.analyzeData(request.data, request.type);
      
      if (response.success) {
        const jobId = response.data.jobId || `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const job: DataProcessingJob = {
          id: jobId,
          status: 'running',
          progress: 0,
          createdAt: new Date().toISOString()
        };

        this.jobs.set(jobId, job);
        
        // If real service provided immediate result
        if (response.data.result) {
          job.status = 'completed';
          job.progress = 100;
          job.result = response.data.result;
          job.completedAt = new Date().toISOString();
        } else {
          // Monitor job progress for async processing
          this.monitorJobProgress(jobId);
        }
        
        return jobId;
      } else {
        throw new Error(response.error || 'Service call failed');
      }
    } catch (error) {
      console.log('Real Python service not available, using simulation');
      
      // Fallback to simulation
      return this.simulateAnalysis(request);
    }
  }

  private async monitorJobProgress(jobId: string): Promise<void> {
    const checkProgress = async () => {
      try {
        const response = await pythonConnector.callService({
          service: 'data',
          endpoint: `/jobs/${jobId}`,
          method: 'GET',
          authenticated: true
        });

        if (response.success && response.data) {
          const updatedJob = {
            ...this.jobs.get(jobId)!,
            ...response.data
          };
          this.jobs.set(jobId, updatedJob);

          if (updatedJob.status === 'completed' || updatedJob.status === 'failed') {
            return; // Stop monitoring
          }
        }

        // Continue monitoring if job is still running
        setTimeout(checkProgress, 2000);
      } catch (error) {
        console.error('Error monitoring job progress:', error);
      }
    };

    setTimeout(checkProgress, 1000);
  }

  private simulateAnalysis(request: DataAnalysisRequest): string {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const job: DataProcessingJob = {
      id: jobId,
      status: 'running',
      progress: 0,
      createdAt: new Date().toISOString()
    };

    this.jobs.set(jobId, job);

    // Simulate processing with the old method
    this.simulateProcessing(jobId, request);
    
    return jobId;
  }

  // Simulate Python data analysis for development
  private simulateDataAnalysis(request: DataAnalysisRequest): DataAnalysisResult {
    const { type, data } = request;
    
    // Generate mock analysis based on type
    const mockAnalysis = {
      sales: {
        summary: "Analyse des ventes révèle une croissance de 15% ce trimestre",
        insights: [
          "Les ventes en ligne représentent 65% du total",
          "Pic d'activité observé en fin de mois",
          "Segment premium en forte croissance (+25%)"
        ],
        recommendations: [
          "Renforcer la stratégie digitale",
          "Optimiser les campagnes de fin de mois",
          "Développer l'offre premium"
        ]
      },
      customer: {
        summary: "Analyse comportementale des clients montre une satisfaction élevée",
        insights: [
          "Taux de rétention de 87%",
          "Score NPS moyen de 8.2/10",
          "Temps de résolution moyen: 2.3h"
        ],
        recommendations: [
          "Maintenir la qualité du service",
          "Développer un programme de fidélité",
          "Automatiser les réponses fréquentes"
        ]
      }
    };

    const analysis = mockAnalysis[type] || mockAnalysis.sales;

    return {
      analysis,
      visualizations: [
        {
          type: 'chart',
          data: data.slice(0, 10), // Sample data
          config: {
            type: 'line',
            title: `Analyse ${type}`,
            xAxis: 'date',
            yAxis: 'value'
          }
        }
      ],
      predictions: {
        trend: Math.random() > 0.5 ? 'up' : 'down',
        confidence: 0.75 + Math.random() * 0.2,
        nextPeriod: {
          value: Math.round(Math.random() * 1000),
          change: Math.round((Math.random() - 0.5) * 20)
        }
      }
    };
  }

  private simulateProcessing(jobId: string, request: DataAnalysisRequest): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    // Simulate progress updates
    const updateProgress = (progress: number) => {
      const updatedJob = { ...job, progress, status: 'running' as const };
      this.jobs.set(jobId, updatedJob);
    };

    // Progress simulation
    setTimeout(() => updateProgress(25), 500);
    setTimeout(() => updateProgress(50), 1000);
    setTimeout(() => updateProgress(75), 1500);
    
    // Complete simulation
    setTimeout(() => {
      const result = this.simulateDataAnalysis(request);
      const completedJob: DataProcessingJob = {
        ...job,
        status: 'completed',
        progress: 100,
        result,
        completedAt: new Date().toISOString()
      };
      this.jobs.set(jobId, completedJob);
    }, 2000);
  }

  public async getJobStatus(jobId: string): Promise<DataProcessingJob | null> {
    // Try to get status from real Python service first
    try {
      const response = await pythonConnector.callService({
        service: 'data',
        endpoint: `/jobs/${jobId}`,
        method: 'GET',
        authenticated: true
      });

      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.log('Using local job status');
    }

    // Fallback to local simulation
    return this.jobs.get(jobId) || null;
  }

  public async getJobResult(jobId: string): Promise<DataAnalysisResult | null> {
    const job = await this.getJobStatus(jobId);
    return job?.result || null;
  }

  public async processDataStream(data: any[], callback: (chunk: any) => void): Promise<void> {
    try {
      // Try real-time processing with Python service
      const response = await pythonConnector.callService({
        service: 'data',
        endpoint: '/stream',
        data: { stream: data },
        authenticated: true
      });

      if (response.success && response.data.chunks) {
        for (const chunk of response.data.chunks) {
          callback(chunk);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        return;
      }
    } catch (error) {
      console.log('Fallback to simulated streaming');
    }

    // Fallback to simulation
    for (const chunk of data) {
      await new Promise(resolve => setTimeout(resolve, 100));
      callback(chunk);
    }
  }

  public getAvailableAnalysisTypes(): string[] {
    return ['sales', 'customer', 'performance', 'predictive'];
  }
}

// Create singleton instance
export const pythonDataService = new PythonDataService();
