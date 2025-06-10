
import jwt from 'jsonwebtoken';
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

export class MicroserviceAuth {
  private serviceTokens: Map<string, ServiceToken> = new Map();
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = import.meta.env.VITE_JWT_SECRET || 'dev-secret-key';
  }

  // Generate service-to-service authentication token
  public generateServiceToken(serviceId: string, permissions: string[]): string {
    const payload = {
      serviceId,
      permissions,
      type: 'service',
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    return jwt.sign(payload, this.jwtSecret);
  }

  // Validate service token
  public validateServiceToken(token: string): ServiceToken | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      
      if (decoded.type !== 'service') {
        throw new Error('Invalid token type');
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

  // Generate user token for microservice calls
  public generateUserToken(userId: string, permissions: string[]): string {
    const payload = {
      userId,
      permissions,
      type: 'user',
      iat: Date.now(),
      exp: Date.now() + (2 * 60 * 60 * 1000) // 2 hours
    };

    return jwt.sign(payload, this.jwtSecret);
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
      // Validate user token
      const decoded = jwt.verify(userToken, this.jwtSecret) as any;
      
      // Check permissions
      const hasPermissions = requiredPermissions.every(permission => 
        decoded.permissions?.includes(permission) || decoded.role === 'admin'
      );

      if (!hasPermissions) {
        throw new Error('Insufficient permissions');
      }

      return {
        userId: decoded.userId || decoded.id,
        serviceId,
        permissions: decoded.permissions || [],
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
export const microserviceAuth = new MicroserviceAuth();
