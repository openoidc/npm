import {z} from 'zod';
import {toOriginArray} from 'utils/origin-array';

const envSchema = z.object({
  PORT: z.string().default('8080'),

  CLIENT_URL: z.string().url().default('http://localhost:3000'),

  SENTRY_DSN: z.string().optional(),
  SENTRY_ENV: z.string().optional(),

  CORS_ORIGINS: z
    .string()
    .default('https://localhost:8080')
    .transform(toOriginArray),

  MORGAN_LOG_LEVEL: z
    .string()
    .default(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'),
});

const env = envSchema.parse(process.env);

export default env;
