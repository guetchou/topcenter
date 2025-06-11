
import { apiGateway } from '../api/gateway';
import { microserviceAuth } from '../auth/microserviceAuth';

export interface AIModelRequest {
  model: 'chat' | 'classification' | 'sentiment' | 'translation' | 'summarization';
  input: string | any[];
  options?: {
    language?: string;
    maxTokens?: number;
    temperature?: number;
    context?: string;
  };
}

export interface AIModelResponse {
  result: string | any;
  confidence: number;
  processingTime: number;
  metadata?: {
    model: string;
    version: string;
    tokens?: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  context?: string;
  createdAt: string;
  updatedAt: string;
}

export class PythonAIService {
  private baseUrl: string;
  private chatSessions: Map<string, ChatSession> = new Map();

  constructor() {
    this.baseUrl = import.meta.env.VITE_PYTHON_AI_SERVICE_URL || 'http://localhost:8002';
    this.registerService();
  }

  private async registerService() {
    // Register the Python AI service with the API gateway
    apiGateway.registerService('python-ai', {
      name: 'Python AI Processing Service',
      url: this.baseUrl,
      healthCheck: '/health',
      timeout: 45000
    });
  }

  // Simulate AI responses for development
  private simulateAIResponse(request: AIModelRequest): AIModelResponse {
    const { model, input } = request;
    
    const responses = {
      chat: `Réponse simulée à: "${input}". TopCenter peut vous aider avec vos besoins en téléphonie et centre d'appels.`,
      classification: Math.random() > 0.5 ? 'positive' : 'negative',
      sentiment: {
        sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
        score: Math.random()
      },
      translation: `Traduction simulée de: "${input}"`,
      summarization: `Résumé: ${typeof input === 'string' ? input.substring(0, 100) : 'Contenu résumé'}...`
    };

    return {
      result: responses[model] || responses.chat,
      confidence: 0.8 + Math.random() * 0.2,
      processingTime: Math.random() * 1000 + 200,
      metadata: {
        model,
        version: '1.0.0-simulation',
        tokens: typeof input === 'string' ? input.length : 100
      }
    };
  }

  public async processWithAI(request: AIModelRequest): Promise<AIModelResponse> {
    try {
      // Try to call real Python AI service first
      const response = await microserviceAuth.callAuthenticatedService<AIModelResponse>(
        'python-ai',
        '/process',
        {
          method: 'POST',
          data: request,
          permissions: ['ai:read']
        }
      );

      return response;
    } catch (error) {
      console.log('Python AI service not available, using simulation');
      
      // Fallback to simulation
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
      return this.simulateAIResponse(request);
    }
  }

  public async createChatSession(context?: string): Promise<string> {
    const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: ChatSession = {
      id: sessionId,
      messages: [],
      context,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.chatSessions.set(sessionId, session);
    return sessionId;
  }

  public async sendChatMessage(sessionId: string, message: string): Promise<ChatMessage> {
    const session = this.chatSessions.get(sessionId);
    if (!session) {
      throw new Error('Session de chat introuvable');
    }

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    session.messages.push(userMessage);

    try {
      // Try to get AI response from real service
      const aiResponse = await this.processWithAI({
        model: 'chat',
        input: message,
        options: {
          context: session.context,
          maxTokens: 500
        }
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse.result as string,
        timestamp: new Date().toISOString()
      };

      session.messages.push(assistantMessage);
      session.updatedAt = new Date().toISOString();
      
      this.chatSessions.set(sessionId, session);
      
      return assistantMessage;
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback response
      const fallbackMessage: ChatMessage = {
        role: 'assistant',
        content: 'Désolé, je rencontre des difficultés techniques. Pouvez-vous reformuler votre question ?',
        timestamp: new Date().toISOString()
      };
      
      session.messages.push(fallbackMessage);
      this.chatSessions.set(sessionId, session);
      
      return fallbackMessage;
    }
  }

  public async getChatSession(sessionId: string): Promise<ChatSession | null> {
    return this.chatSessions.get(sessionId) || null;
  }

  public async analyzeSentiment(text: string): Promise<{ sentiment: string; score: number }> {
    const response = await this.processWithAI({
      model: 'sentiment',
      input: text
    });

    return response.result as { sentiment: string; score: number };
  }

  public async classifyText(text: string, categories: string[]): Promise<string> {
    const response = await this.processWithAI({
      model: 'classification',
      input: text,
      options: {
        context: `Categories: ${categories.join(', ')}`
      }
    });

    return response.result as string;
  }

  public async translateText(text: string, targetLanguage: string): Promise<string> {
    const response = await this.processWithAI({
      model: 'translation',
      input: text,
      options: {
        language: targetLanguage
      }
    });

    return response.result as string;
  }

  public async summarizeText(text: string, maxLength?: number): Promise<string> {
    const response = await this.processWithAI({
      model: 'summarization',
      input: text,
      options: {
        maxTokens: maxLength
      }
    });

    return response.result as string;
  }

  public getAvailableModels(): string[] {
    return ['chat', 'classification', 'sentiment', 'translation', 'summarization'];
  }
}

// Create singleton instance
export const pythonAIService = new PythonAIService();
