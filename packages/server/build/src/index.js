"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = require("./env");
var app_1 = require("./app/app");
var logger_1 = require("./app/lib/logger");
var Sentry = require("@sentry/node");
process.on('uncaughtException', function (error) {
    Sentry.captureException(error);
    logger_1.default.error('server: uncaught exception', error);
});
process.on('unhandledRejection', function (reason, promise) {
    Sentry.captureException(reason);
    logger_1.default.error("server: unhandled promise rejection: ".concat(promise, ": ").concat(reason));
});
var server = app_1.default.listen(env_1.default.NX_PORT, function () {
    logger_1.default.info("\uD83D\uDE80 API listening at http://localhost:".concat(server.address().port));
});
// Handle SIGTERM coming from ECS Fargate
process.on('SIGTERM', function () { return server.close(); });
server.on('error', function (err) { return logger_1.default.error('Server failed to start from main.ts', err); });
