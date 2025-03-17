import dotenv from 'dotenv'

dotenv.config()

export const config = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'rereadery_db',
    port: parseInt(process.env.DB_PORT || '3306')
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || ''
  },
  payment: {
    yocoApiUrl: process.env.YOCO_API_URL || 'https://api.yoco.com/v1',
    secretKey: process.env.YOCO_SECRET_KEY || ''
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api'
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-default-jwt-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10')
  },
  cache: {
    enabled: process.env.CACHE_ENABLED === 'true',
    ttl: parseInt(process.env.CACHE_TTL || '3600')
  },
  analytics: {
    googleAnalyticsId: process.env.GA_ID || '',
    enableTracking: process.env.ENABLE_TRACKING === 'true'
  }
}