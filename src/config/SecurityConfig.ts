import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Express } from 'express';

export class SecurityConfig {
  private static readonly SALT_ROUNDS = 12;
  private static readonly ENCRYPTION_ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32;
  private static readonly AUTH_TOKEN_EXPIRY = '24h';

  public static configureSecurityMiddleware(app: Express): void {
    // Enable Helmet middleware for security headers
    app.use(helmet());

    // Configure rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    });
    app.use('/api/', limiter);

    // Configure stricter rate limits for authentication endpoints
    const authLimiter = rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5 // limit each IP to 5 login attempts per hour
    });
    app.use('/api/auth/', authLimiter);
  }

  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  public static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public static encryptData(data: string, secretKey: string): {
    encryptedData: string;
    iv: string;
    authTag: string;
  } {
    const iv = crypto.randomBytes(12);
    const key = crypto.scryptSync(secretKey, 'salt', this.KEY_LENGTH);
    const cipher = crypto.createCipheriv(
      this.ENCRYPTION_ALGORITHM,
      key,
      iv
    ) as crypto.CipherGCM;

    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return {
      encryptedData,
      iv: iv.toString('hex'),
      authTag
    };
  }

  public static decryptData(
    encryptedData: string,
    iv: string,
    authTag: string,
    secretKey: string
  ): string {
    const key = crypto.scryptSync(secretKey, 'salt', this.KEY_LENGTH);
    const decipher = crypto.createDecipheriv(
      this.ENCRYPTION_ALGORITHM,
      key,
      Buffer.from(iv, 'hex')
    ) as crypto.DecipherGCM;

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    return decryptedData;
  }

  public static sanitizeInput(input: string): string {
    // Basic XSS protection
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  public static validateInput(input: string, pattern: RegExp): boolean {
    return pattern.test(input);
  }

  public static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  public static readonly INPUT_PATTERNS = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    USERNAME: /^[a-zA-Z0-9_-]{3,16}$/,
    PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
    ISBN: /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
  };
}
