import type {Contexts, Primitive} from '@sentry/types';

export type ParsedError = {
  // Parser will attempt to produce a descriptive message from the error
  message: string;

  // Any extra error data to include in logs
  metadata?: unknown;

  // Not safe for production, but provided for local logs
  stackTrace?: unknown;

  // This parser covers more than just HTTP errors, so this is optional
  statusCode?: string;

  sentryContexts?: Contexts;
  sentryTags?: {[key: string]: Primitive};
};
