import type {AxiosError} from 'axios';
import axios from 'axios';
import {ParsedError} from 'type/ParseError';

export function parseError(error: unknown): ParsedError {
  if (axios.isAxiosError(error)) {
    return parseAxiosError(error);
  }

  if (error instanceof Error) {
    return parseJSError(error);
  }

  if (typeof error === 'string') {
    return {
      message: error,
    };
  }

  if (typeof error === 'number') {
    return {
      message: error.toString(),
    };
  }

  return {
    message: '[unknown-error] Unable to parse',
    metadata: error,
  };
}

function parseAxiosError(error: AxiosError): ParsedError {
  return {
    message: error.message,
    statusCode: error.response ? error.response.status.toString() : '500',
    metadata: error.response ? error.response.data : undefined,
    stackTrace: error.stack,
  };
}

function parseJSError(error: Error): ParsedError {
  return {
    message: error.message,
    stackTrace: error.stack,
  };
}
