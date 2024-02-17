"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = __importDefault(require("env"));
var Sentry = __importStar(require("@sentry/node"));
var logger_1 = __importDefault(require("lib/logger"));
var app_1 = __importDefault(require("app"));
process.on('uncaughtException', function (error) {
    Sentry.captureException(error);
    logger_1.default.error('server: uncaught exception', error);
});
process.on('unhandledRejection', function (reason, promise) {
    Sentry.captureException(reason);
    logger_1.default.error("server: unhandled promise rejection: ".concat(promise, ": ").concat(reason));
});
var server = app_1.default.listen(env_1.default.PORT, function () {
    logger_1.default.info("\uD83D\uDE80 API listening at http://localhost:".concat(server.address().port));
});
// Handle SIGTERM coming from ECS Fargate
process.on('SIGTERM', function () { return server.close(); });
server.on('error', function (err) { return logger_1.default.error('Server failed to start from index.ts', err); });
