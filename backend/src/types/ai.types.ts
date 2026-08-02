export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIRequest {
  prompt?: string;
  messages?: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: { type: 'json_object' | 'text' };
  timeoutMs?: number;
}

export interface AIResponse {
  success: boolean;
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: string;
}

export interface AIHealthStatus {
  status: 'healthy' | 'unhealthy';
  apiKeyConfigured: boolean;
  groqReachable: boolean;
  modelAvailable: boolean;
  modelName: string;
  errorMessage?: string;
}
