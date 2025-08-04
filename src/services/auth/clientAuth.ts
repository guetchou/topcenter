// Client-side authentication (sans jsonwebtoken)
import { apiGateway } from '../api/gateway';

export interface ServiceToken {
  serviceId: string;
  permissions: string[];
  expiresAt: number;
}

export interface AuthenticatedRequest {
  userId?: string;
  serviceId?: string;
  permissions: string[];
  token: string;
}

export class ClientAuth {
  private serviceTokens: Map<string, ServiceToken> = new Map();

  constructor() {
    // Client-side auth uses simple tokens
  }

  // Generate simple service token for client
  public generateServiceToken(serviceId: string, permissions: string[]): string {
    const payload = {
      serviceId,
      permissions,
      type: 'service',
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    // Simple base64 encoding for client-side
    return btoa(JSON.stringify(payload));
  }

  // Validate service token (client-side)
  public validateServiceToken(token: string): ServiceToken | null {
    try {
      const decoded = JSON.parse(atob(token));
      
      if (decoded.type !== 'service' || decoded.exp < Date.now()) {
        throw new Error('Invalid or expired token');
      }

      return {
        serviceId: decoded.serviceId,
        permissions: decoded.permissions,
        expiresAt: decoded.exp
      };
    } catch (error) {
      console.error('Service token validation failed:', error);
      return null;
    }
  }

  // Authenticate request to microservice
  public async authenticateRequest(serviceId: string, endpoint: string, options?: {
    userToken?: string;
    permissions?: string[];
  }): Promise<AuthenticatedRequest> {
    const userToken = options?.userToken || localStorage.getItem('auth_token');
    const requiredPermissions = options?.permissions || [];

    if (!userToken) {
      throw new Error('No authentication token available');
    }

    try {
      // Simple validation for development
      return {
        userId: 'current-user',
        serviceId,
        permissions: requiredPermissions,
        token: userToken
      };
    } catch (error) {
      console.error('Request authentication failed:', error);
      throw new Error('Authentication failed');
    }
  }

  // Call authenticated microservice endpoint
  public async callAuthenticatedService<T>(
    serviceId: string, 
    endpoint: string, 
    options?: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: any;
      permissions?: string[];
    }
  ): Promise<T> {
    const authRequest = await this.authenticateRequest(serviceId, endpoint, options);
    
    return apiGateway.callService<T>(serviceId, endpoint, {
      method: options?.method,
      data: options?.data,
      headers: {
        'Authorization': `Bearer ${authRequest.token}`,
        'X-Service-ID': serviceId,
        'X-User-ID': authRequest.userId || '',
      }
    });
  }

  // Register service with authentication
  public async registerService(serviceId: string, permissions: string[]): Promise<string> {
    const token = this.generateServiceToken(serviceId, permissions);
    
    this.serviceTokens.set(serviceId, {
      serviceId,
      permissions,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000)
    });

    console.log(`Service ${serviceId} registered with permissions:`, permissions);
    return token;
  }

  public getServicePermissions(serviceId: string): string[] {
    const serviceToken = this.serviceTokens.get(serviceId);
    return serviceToken?.permissions || [];
  }
}

// Create singleton instance
export const clientAuth = new ClientAuth();