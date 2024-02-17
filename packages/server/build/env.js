"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("zod");
var origin_array_1 = require("utils/origin-array");
var envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('8080'),
    CLIENT_URL: zod_1.z.string().url().default('http://localhost:3000'),
    SENTRY_DSN: zod_1.z.string().optional(),
    SENTRY_ENV: zod_1.z.string().optional(),
    CORS_ORIGINS: zod_1.z.string().default('https://localhost:8080').transform(origin_array_1.toOriginArray),
    MORGAN_LOG_LEVEL: zod_1.z
        .string()
        .default(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'),
});
var env = envSchema.parse(process.env);
exports.default = env;
