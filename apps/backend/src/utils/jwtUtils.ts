import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  email?: string;
  role?: string;
}

// The JWTOptions interface is not directly used in the current implementation,
// but it's good practice to have it if we were to pass options directly to jwt.sign.
// For now, the options are hardcoded within the sign calls.
interface JWTOptions {
  expiresIn?: string | number; // Allow string or number for expiresIn
}

export class JWTUtils {
  private static readonly ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  private static readonly REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production';
  private static readonly ACCESS_TOKEN_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
  private static readonly REFRESH_TOKEN_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';
  
  /**
   * Helper to convert time string to seconds
   * Supports formats like: '15m', '7d', '1h', '30s'
   */
  private static parseTimeToSeconds(timeStr: string): number {
    const match = timeStr.match(/^(\d+)([smhd])$/);
    if (!match) {
      // If invalid format, default to treating as seconds
      return parseInt(timeStr) || 900;
    }
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 60 * 60 * 24;
      default: return value;
    }
  }
  
  private static readonly ACCESS_TOKEN_EXPIRES_SECONDS = this.parseTimeToSeconds(this.ACCESS_TOKEN_EXPIRES);
  private static readonly REFRESH_TOKEN_EXPIRES_SECONDS = this.parseTimeToSeconds(this.REFRESH_TOKEN_EXPIRES);

  /**
   * Generate an access token (short-lived)
   */
  static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(
      payload,
      this.ACCESS_TOKEN_SECRET,
      {
        expiresIn: this.ACCESS_TOKEN_EXPIRES_SECONDS,
        issuer: 'magajico-backend',
        audience: 'magajico-users'
      }
    );
  }

  /**
   * Generate a refresh token (long-lived)
   */
  static generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(
      payload,
      this.REFRESH_TOKEN_SECRET,
      {
        expiresIn: this.REFRESH_TOKEN_EXPIRES_SECONDS,
        issuer: 'magajico-backend',
        audience: 'magajico-users'
      }
    );
  }

  /**
   * Generate both access and refresh tokens
   */
  static generateTokenPair(payload: JWTPayload): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload)
    };
  }

  /**
   * Verify an access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET, {
        issuer: 'magajico-backend',
        audience: 'magajico-users'
      }) as JWTPayload;
      return decoded;
    } catch (error) {
      // The error message is generic, but indicates a failure during verification.
      // For debugging, it might be helpful to log the specific error.
      // console.error("Access token verification failed:", error);
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify a refresh token
   */
  static verifyRefreshToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET, {
        issuer: 'magajico-backend',
        audience: 'magajico-users'
      }) as JWTPayload;
      return decoded;
    } catch (error) {
      // The error message is generic, but indicates a failure during verification.
      // For debugging, it might be helpful to log the specific error.
      // console.error("Refresh token verification failed:", error);
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  static decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      // console.error("Token decoding failed:", error);
      return null; // Return null or throw an error if decoding fails
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) return true; // Token is invalid or has no expiry
      // decoded.exp is in seconds, Date.now() is in milliseconds
      return Date.now() >= decoded.exp * 1000;
    } catch (error) {
      // console.error("Error checking token expiry:", error);
      return true; // Assume expired if any error occurs during decoding or check
    }
  }
}
