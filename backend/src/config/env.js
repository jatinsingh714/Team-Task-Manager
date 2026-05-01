import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const mongoUri = process.env.MONGO_URI || (isProduction ? '' : 'mongodb://127.0.0.1:27017/tt-manager');
const clientUrl = process.env.CLIENT_URL || (isProduction ? '' : 'http://localhost:5173');
const defaultClientUrls = isProduction ? [] : ['http://localhost:5173', 'http://127.0.0.1:5173'];

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri,
  clientUrls: [...new Set([
    ...defaultClientUrls,
    ...clientUrl
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean)
  ])],
  jsonLimit: process.env.JSON_LIMIT || '1mb',
  jwtSecret: process.env.JWT_SECRET || 'development-jwt-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
};

if (isProduction && !process.env.MONGO_URI) {
  console.warn('MONGO_URI is not set. Database routes will fail until it is configured.');
}

if (isProduction && !process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Set it before using authenticated routes in production.');
}

if (isProduction && !process.env.CLIENT_URL) {
  console.warn('CLIENT_URL is not set. Browser CORS requests will be blocked until it is configured.');
}

export default env;
