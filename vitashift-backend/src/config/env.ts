import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, fallback?: string): string | undefined {
  const value = process.env[name] ?? fallback;
  return value === undefined || value === '' ? undefined : value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '4000', 10),
  mongoUri: requireEnv('MONGO_URI', 'mongodb://localhost:27017/vitashift'),
  useMemoryDb: (process.env.USE_MEMORY_DB ?? 'false').toLowerCase() === 'true',
  useInprocessWorker: (process.env.USE_INPROCESS_WORKER ?? 'true').toLowerCase() === 'true',
  jwtSecret: requireEnv('JWT_SECRET', 'dev-secret-change-me'),
  jwtRefreshSecret: requireEnv('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-me'),
  logLevel: process.env.LOG_LEVEL ?? 'info',
  // AWS / S3 / SES
  awsRegion: optionalEnv('AWS_REGION', 'us-east-1'),
  s3Bucket: optionalEnv('S3_BUCKET'),
  // Stripe
  stripeSecretKey: optionalEnv('STRIPE_SECRET_KEY'),
  // Email
  emailFrom: optionalEnv('EMAIL_FROM', 'no-reply@vitashift.local'),
};