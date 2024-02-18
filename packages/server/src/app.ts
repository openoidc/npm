import type {RequestHandler} from 'express';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import * as Sentry from '@sentry/node';
import * as SentryTracing from '@sentry/tracing';
import env from 'env';

import {
  defaultErrorHandler,
  authErrorHandler,
  authenticatedUser,
} from 'middleware';
/**
 * In Express 4.x, asynchronous errors are NOT automatically passed to next().  This middleware is a small
 * wrapper around Express that enables automatic async error handling
 */
import 'express-async-errors';
import logger from './lib/logger';
import {ExpressAuth} from '@auth/express';
import GitHub from '@auth/express/providers/github'

const app = express();
// put health check before maintenance and other middleware
app.get('/health', (_req, res) => {
  res.status(200).json({status: 'OK'});
});

// Mostly defaults recommended by quickstart
// - https://docs.sentry.io/platforms/node/guides/express/
// - https://docs.sentry.io/platforms/node/guides/express/performance/
Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.SENTRY_ENV,
  maxValueLength: 8196,
  integrations: [
    new Sentry.Integrations.Http({tracing: true}),
    new SentryTracing.Integrations.Express({app}),
    new SentryTracing.Integrations.Postgres(),
  ],
  tracesSampler: ctx => {
    return ctx.request?.method === 'OPTIONS'
      ? false
      : ctx.parentSampled ?? true;
  },
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

const origin = [env.CLIENT_URL, ...env.CORS_ORIGINS];
logger.info(`CORS origins: ${origin}`);
app.use(cors({origin, credentials: true}));
app.options('*', cors() as RequestHandler);

app.use(
  morgan(env.MORGAN_LOG_LEVEL, {
    stream: {
      write: function (message: string) {
        logger.http(message.trim()); // Trim because Morgan and Logger both add \n, so avoid duplicates here
      },
    },
  })
);

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// =========================================
//                 API ⬇️
// =========================================
// Public routes
// Keep this route public for Render health checks - https://render.com/docs/deploys#health-checks
app.get('/v1', (_req, res) => {
  res.status(200).json({msg: 'API Running'});
});

app.get('/debug-sentry', () => {
  throw new Error('Server sentry is working correctly');
});

// Handle authentication with next-auth
// ALL ROUTES BELOW THIS LINE ARE PROTECTED
app.use('/auth/*', ExpressAuth({providers: [GitHub]}));
app.use(authenticatedUser);

// Sentry must be the *first* handler
app.use(Sentry.Handlers.errorHandler());

// Errors will pass through in order listed, these MUST be at the bottom of this server file
app.use(authErrorHandler); // Handles auth/authz specific errors
app.use(defaultErrorHandler); // Fallback handler

export default app;
