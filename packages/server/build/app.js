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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var Sentry = __importStar(require("@sentry/node"));
var SentryTracing = __importStar(require("@sentry/tracing"));
var env_1 = __importDefault(require("env"));
var middleware_1 = require("middleware");
/**
 * In Express 4.x, asynchronous errors are NOT automatically passed to next().  This middleware is a small
 * wrapper around Express that enables automatic async error handling
 */
require("express-async-errors");
var logger_1 = __importDefault(require("./lib/logger"));
var app = (0, express_1.default)();
// put health check before maintenance and other middleware
app.get('/health', function (_req, res) {
    res.status(200).json({ status: 'OK' });
});
// Mostly defaults recommended by quickstart
// - https://docs.sentry.io/platforms/node/guides/express/
// - https://docs.sentry.io/platforms/node/guides/express/performance/
Sentry.init({
    dsn: env_1.default.SENTRY_DSN,
    environment: env_1.default.SENTRY_ENV,
    maxValueLength: 8196,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new SentryTracing.Integrations.Express({ app: app }),
        new SentryTracing.Integrations.Postgres(),
    ],
    tracesSampler: function (ctx) {
        var _a, _b;
        return ((_a = ctx.request) === null || _a === void 0 ? void 0 : _a.method) === 'OPTIONS' ? false : (_b = ctx.parentSampled) !== null && _b !== void 0 ? _b : true;
    },
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
var origin = __spreadArray([env_1.default.CLIENT_URL], env_1.default.CORS_ORIGINS, true);
logger_1.default.info("CORS origins: ".concat(origin));
app.use((0, cors_1.default)({ origin: origin, credentials: true }));
app.options('*', (0, cors_1.default)());
app.use((0, morgan_1.default)(env_1.default.MORGAN_LOG_LEVEL, {
    stream: {
        write: function (message) {
            logger_1.default.http(message.trim()); // Trim because Morgan and Logger both add \n, so avoid duplicates here
        },
    },
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// =========================================
//                 API ⬇️
// =========================================
// Public routes
// Keep this route public for Render health checks - https://render.com/docs/deploys#health-checks
app.get('/v1', function (_req, res) {
    res.status(200).json({ msg: 'API Running' });
});
app.get('/debug-sentry', function mainHandler(_req, _res) {
    throw new Error('Server sentry is working correctly');
});
// Sentry must be the *first* handler
app.use(Sentry.Handlers.errorHandler());
// Errors will pass through in order listed, these MUST be at the bottom of this server file
app.use(middleware_1.authErrorHandler); // Handles auth/authz specific errors
app.use(middleware_1.defaultErrorHandler); // Fallback handler
exports.default = app;
