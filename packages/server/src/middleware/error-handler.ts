import type {ErrorRequestHandler} from 'express';
import logger from 'lib/logger';
import {parseError} from 'utils/error-util';
import {ErrorResponse} from 'type/ErrorResponse';

export const defaultErrorHandler: ErrorRequestHandler = async (
  err,
  req,
  res,
  _next
) => {
  const parsedError = parseError(err);

  const errors: ErrorResponse = {
    errors: [
      {
        status: parsedError.statusCode || '500',
        title: parsedError.message,
      },
    ],
  };

  logger.error(`[default-express-handler] ${parsedError.message}`, {
    metadata: parsedError.metadata,
    stackTrace: parsedError.stackTrace,
    request: {
      method: req.method,
      url: req.url,
    },
  });

  logger.debug(parsedError.stackTrace);

  res.status(+(parsedError.statusCode || 500)).json(errors);
};
