# SPEC-100: Groq AI Service Prompt Documentation

## Context
This document logs the development actions for Groq AI infrastructure and services.

## Goals & Objectives
- Integrate `groq-sdk`.
- Safe configuration singleton at `src/config/groq.config.ts`.
- AI service exposing `generateText()`, `generateJSON()`, `chat()`, and `healthCheck()` with retries, timeout, and error sanitization.
- Prompt library at `src/constants/ai-prompts.ts`.
- Strict typing and warning-free compilation.

## Implementation Details
1. **Installed Dependencies**: `groq-sdk`.
2. **Config**: `backend/src/config/groq.config.ts`.
3. **Constants**: `backend/src/constants/ai-prompts.ts`.
4. **Service**: `backend/src/services/groq.service.ts`.
5. **Types**: `backend/src/types/ai.types.ts`.
