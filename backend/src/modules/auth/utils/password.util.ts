import * as bcrypt from 'bcryptjs';
import { config } from '../../../config/env';

export interface PasswordStrengthResult {
  isValid: boolean;
  score: number;
  errors: string[];
}

/**
 * Password strength configuration criteria
 */
const STRENGTH_CRITERIA = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  UPPERCASE_REGEX: /[A-Z]/,
  LOWERCASE_REGEX: /[a-z]/,
  NUMBER_REGEX: /[0-9]/,
  SPECIAL_CHAR_REGEX: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
};

/**
 * Hashes a plaintext password asynchronously using bcrypt with configured salt rounds.
 *
 * @param password Plaintext password to hash
 * @returns Promise resolving to the hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(config.bcryptRounds);
  return bcrypt.hash(password, salt);
}

/**
 * Verifies a plaintext password against a stored bcrypt password hash asynchronously.
 *
 * @param password Plaintext candidate password
 * @param hash Stored bcrypt password hash
 * @returns Promise resolving to true if candidate matches hash, false otherwise
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Evaluates password strength against corporate security requirements.
 *
 * Requirements:
 * - Length between 8 and 128 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one numeric digit
 * - At least one special character
 *
 * @param password Plaintext password to evaluate
 * @returns PasswordStrengthResult containing validity flag, score (0-5), and descriptive error messages
 */
export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const errors: string[] = [];
  let score = 0;

  if (!password || password.length < STRENGTH_CRITERIA.MIN_LENGTH) {
    errors.push(`Password must be at least ${STRENGTH_CRITERIA.MIN_LENGTH} characters long`);
  } else if (password.length > STRENGTH_CRITERIA.MAX_LENGTH) {
    errors.push(`Password cannot exceed ${STRENGTH_CRITERIA.MAX_LENGTH} characters`);
  } else {
    score += 1;
  }

  if (!STRENGTH_CRITERIA.UPPERCASE_REGEX.test(password)) {
    errors.push('Password must contain at least one uppercase letter (A-Z)');
  } else {
    score += 1;
  }

  if (!STRENGTH_CRITERIA.LOWERCASE_REGEX.test(password)) {
    errors.push('Password must contain at least one lowercase letter (a-z)');
  } else {
    score += 1;
  }

  if (!STRENGTH_CRITERIA.NUMBER_REGEX.test(password)) {
    errors.push('Password must contain at least one numeric digit (0-9)');
  } else {
    score += 1;
  }

  if (!STRENGTH_CRITERIA.SPECIAL_CHAR_REGEX.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*...)');
  } else {
    score += 1;
  }

  return {
    isValid: errors.length === 0,
    score,
    errors,
  };
}
