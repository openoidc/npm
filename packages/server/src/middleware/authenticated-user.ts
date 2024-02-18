import GitHub from '@auth/express/providers/github';
import {getSession} from '@auth/express';
import type {NextFunction, Request, Response} from 'express';

export async function authenticatedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session =
    res.locals.session ?? (await getSession(req, {providers: [GitHub]}));
  if (!session?.user) {
    res.redirect('/login');
  } else {
    next();
  }
}
