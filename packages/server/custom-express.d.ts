import {User} from '@auth/express';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
