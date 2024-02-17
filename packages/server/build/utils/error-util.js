"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseError = void 0;
var axios_1 = __importDefault(require("axios"));
function parseError(error) {
    if (axios_1.default.isAxiosError(error)) {
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
exports.parseError = parseError;
function parseAxiosError(error) {
    return {
        message: error.message,
        statusCode: error.response ? error.response.status.toString() : '500',
        metadata: error.response ? error.response.data : undefined,
        stackTrace: error.stack,
    };
}
function parseJSError(error) {
    return {
        message: error.message,
        stackTrace: error.stack,
    };
}
