// A simplified version of: https://jsonapi.org/examples/#error-objects-multiple-errors
export interface ErrorResponse {
  errors: Array<{status: string; title: string; detail?: string}>;
}

export interface SuccessResponse {
  data: {
    json: unknown;
    meta?: unknown;
  };
  [metadata: string]: unknown;
}

// Can be used in Axios typings in components
export interface ApiResponse<T = unknown> {
  data?: T;
  errors?: ErrorResponse['errors'];
}

export type BaseResponse = SuccessResponse | ErrorResponse;
