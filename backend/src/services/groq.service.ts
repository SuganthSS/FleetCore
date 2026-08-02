import { groqConfig } from '../config/groq.config';
import { logger } from '../utils/logger';
import { AIRequest, AIResponse, AIHealthStatus } from '../types/ai.types';

const DEFAULT_TIMEOUT_MS = 25000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/**
 * Executes a function with exponential backoff retry logic.
 */
async function executeWithRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY_MS
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    logger.warn(`Groq request failed. Retrying in ${delay}ms... Errors remaining: ${retries}`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return executeWithRetry(operation, retries - 1, delay * 2);
  }
}

/**
 * Sanitizes model errors before reporting to prevent exposure of sensitive system internals.
 */
function sanitizeError(error: unknown): string {
  if (!error) return 'An unknown error occurred during AI processing.';
  const err = error as { status?: number; message?: string };
  if (err.status === 401) return 'AI service authentication failed. Invalid API key.';
  if (err.status === 429) return 'AI service rate limit exceeded. Please try again later.';
  if (err.status === 503) return 'AI service is temporarily unavailable. Please try again.';
  return err.message || 'AI request failed due to an internal system error.';
}

export const groqService = {
  /**
   * Generates plaintext response using a single text prompt.
   */
  async generateText(request: AIRequest): Promise<AIResponse> {
    if (!groqConfig.isConfigured || !groqConfig.client) {
      return { success: false, content: '', error: 'Groq AI Service is not configured.' };
    }

    const {
      prompt,
      model = groqConfig.defaultModel,
      temperature = 0.2,
      maxTokens,
      timeoutMs = DEFAULT_TIMEOUT_MS,
    } = request;

    if (!prompt) {
      return { success: false, content: '', error: 'Prompt is required for text generation.' };
    }

    const operation = async () => {
      const response = await groqConfig.client!.chat.completions.create(
        {
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature,
          max_tokens: maxTokens,
        },
        {
          timeout: timeoutMs,
        }
      );

      const content = response.choices[0]?.message?.content || '';
      return {
        success: true,
        content,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
      };
    };

    try {
      return await executeWithRetry(operation);
    } catch (error: unknown) {
      logger.error('Error in Groq generateText:', error);
      return {
        success: false,
        content: '',
        error: sanitizeError(error),
      };
    }
  },

  /**
   * Generates a structured JSON response (enforces JSON format response).
   */
  async generateJSON(request: AIRequest): Promise<AIResponse> {
    if (!groqConfig.isConfigured || !groqConfig.client) {
      return { success: false, content: '', error: 'Groq AI Service is not configured.' };
    }

    const {
      prompt,
      messages,
      model = groqConfig.defaultModel,
      temperature = 0.1,
      maxTokens,
      timeoutMs = DEFAULT_TIMEOUT_MS,
    } = request;

    let payloadMessages = messages;
    if (!payloadMessages) {
      if (!prompt) {
        return { success: false, content: '', error: 'Either prompt or messages is required.' };
      }
      payloadMessages = [{ role: 'user', content: prompt }];
    }

    const operation = async () => {
      const response = await groqConfig.client!.chat.completions.create(
        {
          model,
          messages: payloadMessages!,
          temperature,
          max_tokens: maxTokens,
          response_format: { type: 'json_object' },
        },
        {
          timeout: timeoutMs,
        }
      );

      const content = response.choices[0]?.message?.content || '{}';
      return {
        success: true,
        content,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
      };
    };

    try {
      return await executeWithRetry(operation);
    } catch (error: unknown) {
      logger.error('Error in Groq generateJSON:', error);
      return {
        success: false,
        content: '{}',
        error: sanitizeError(error),
      };
    }
  },

  /**
   * Supports multi-turn chat interactions.
   */
  async chat(request: AIRequest): Promise<AIResponse> {
    if (!groqConfig.isConfigured || !groqConfig.client) {
      return { success: false, content: '', error: 'Groq AI Service is not configured.' };
    }

    const {
      messages,
      model = groqConfig.defaultModel,
      temperature = 0.5,
      maxTokens,
      timeoutMs = DEFAULT_TIMEOUT_MS,
    } = request;

    if (!messages || messages.length === 0) {
      return { success: false, content: '', error: 'Messages array is required for chat.' };
    }

    const operation = async () => {
      const response = await groqConfig.client!.chat.completions.create(
        {
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
        },
        {
          timeout: timeoutMs,
        }
      );

      const content = response.choices[0]?.message?.content || '';
      return {
        success: true,
        content,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
      };
    };

    try {
      return await executeWithRetry(operation);
    } catch (error: unknown) {
      logger.error('Error in Groq chat completion:', error);
      return {
        success: false,
        content: '',
        error: sanitizeError(error),
      };
    }
  },

  /**
   * Verifies credentials, connectivity, and model availability.
   */
  async healthCheck(): Promise<AIHealthStatus> {
    const isApiKeyConfigured = !!process.env.GROQ_API_KEY;
    const modelName = groqConfig.defaultModel;

    if (!isApiKeyConfigured || !groqConfig.client) {
      return {
        status: 'unhealthy',
        apiKeyConfigured: false,
        groqReachable: false,
        modelAvailable: false,
        modelName,
        errorMessage: 'GROQ_API_KEY is not defined in backend environments.',
      };
    }

    try {
      // Execute a lightweight, fast request to verify connectivity and model availability
      await groqConfig.client.chat.completions.create(
        {
          model: modelName,
          messages: [{ role: 'user', content: 'health_check' }],
          max_tokens: 3,
        },
        {
          timeout: 5000,
        }
      );

      return {
        status: 'healthy',
        apiKeyConfigured: true,
        groqReachable: true,
        modelAvailable: true,
        modelName,
      };
    } catch (error: unknown) {
      logger.error('Groq service health check failed:', error);
      return {
        status: 'unhealthy',
        apiKeyConfigured: true,
        groqReachable: false,
        modelAvailable: false,
        modelName,
        errorMessage: sanitizeError(error),
      };
    }
  },
};

export default groqService;
