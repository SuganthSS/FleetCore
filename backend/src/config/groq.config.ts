import Groq from 'groq-sdk';
import { logger } from '../utils/logger';

const apiKey = process.env.GROQ_API_KEY;
const defaultModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

let groqInstance: Groq | null = null;
let isGroqConfigured = false;

if (!apiKey) {
  logger.warn('⚠️ GROQ_API_KEY environment variable is missing. AI services will be disabled.');
} else {
  try {
    groqInstance = new Groq({ apiKey });
    isGroqConfigured = true;
    logger.info(`🚀 Groq client initialized successfully. Default model: ${defaultModel}`);
  } catch (error) {
    logger.error('❌ Error configuring Groq SDK instance:', error);
  }
}

export const groqConfig = {
  client: groqInstance,
  isConfigured: isGroqConfigured,
  defaultModel,
};
