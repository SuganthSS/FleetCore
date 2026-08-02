import { AuthenticatedUser } from '../modules/auth/interfaces/auth.interface';

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: AuthenticatedUser;
    }
  }
}
