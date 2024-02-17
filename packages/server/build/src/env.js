"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("zod");
var envSchema = zod_1.z.object({
    NX_PORT: zod_1.z.string().default('8080'),
    NX_SENTRY_DSN: zod_1.z.string().optional(),
    NX_SENTRY_ENV: zod_1.z.string().optional(),
    NX_MORGAN_LOG_LEVEL: zod_1.z
        .string()
        .default(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'),
});
var env = envSchema.parse(process.env);
exports.default = env;
