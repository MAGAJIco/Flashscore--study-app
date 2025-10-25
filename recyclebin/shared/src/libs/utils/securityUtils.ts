//packages/shared/src/libs/utils/security utile.ts
class SecurityUtils {
  // Input sanitization
  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .replace(/[<>"/\\&]/g, '') // Remove dangerous characters
      .trim()
      .substring(0, 1000); // Limit length
  }

  static sanitizeEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = this.sanitizeInput(email);
    return emailRegex.test(sanitized) ? sanitized : '';
  }

  static sanitizeUsername(username: string): string {
    const sanitized = this.sanitizeInput(username);
    // Only allow alphanumeric, underscore, hyphen
    return sanitized.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 30);
  }

  // Rate limiting
  private static rateLimitStore: Map<string, { count: number; resetTime: number; blockedUntil?: number }> = new Map();
  private static blockedIPs: Set<string> = new Set();

  static checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    
    // Check if IP is permanently blocked
    if (this.blockedIPs.has(identifier)) {
      this.logSecurityEvent('blocked_ip_attempt', { identifier });
      return false;
    }
    
    const record = this.rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
      this.rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    // Temporary block on excessive violations
    if (record.blockedUntil && now < record.blockedUntil) {
      return false;
    }

    if (record.count >= maxRequests) {
      // Block for 15 minutes after 3 violations
      if (record.count >= maxRequests * 3) {
        record.blockedUntil = now + 15 * 60 * 1000;
        this.logSecurityEvent('rate_limit_block', { identifier, duration: '15min' });
      }
      return false;
    }

    record.count++;
    return true;
  }
  
  // Cleanup old entries periodically
  static cleanupRateLimits(): void {
    const now = Date.now();
    for (const [key, value] of this.rateLimitStore.entries()) {
      if (now > value.resetTime && (!value.blockedUntil || now > value.blockedUntil)) {
        this.rateLimitStore.delete(key);
      }
    }
  }

  // Session management
  static generateSecureToken(): string {
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for server-side
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static validateSession(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    return token.length === 64 && /^[a-f0-9]+$/.test(token);
  }

  // XSS Protection
  static escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // CSRF Protection
  static generateCSRFToken(): string {
    return this.generateSecureToken();
  }

  static validateCSRFToken(token: string, storedToken: string): boolean {
    return token === storedToken && token.length === 64;
  }

  // Data encryption for sensitive storage
  static encryptData(data: string, key: string): string {
    // WARNING: This is NOT secure encryption - use Web Crypto API in production
    console.warn('SecurityUtils.encryptData: Using insecure encryption method');
    throw new Error('Use Web Crypto API (crypto.subtle) for actual encryption in production');
  }

  static decryptData(encryptedData: string, key: string): string {
    console.warn('SecurityUtils.decryptData: Using insecure decryption method');
    throw new Error('Use Web Crypto API (crypto.subtle) for actual decryption in production');
  }

  // Token validation with expiration
  static isTokenValid(token: string): boolean {
    if (!this.validateSession(token)) return false;
    
    // Check token age (demo implementation)
    const tokenData = this.getTokenData(token);
    if (!tokenData) return false;
    
    const tokenAge = Date.now() - tokenData.created;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    return tokenAge < maxAge;
  }

  static getTokenData(token: string): { created: number; userId?: string } | null {
    try {
      if (typeof localStorage !== 'undefined') {
        const tokenStore = JSON.parse(localStorage.getItem('token_store') || '{}');
        return tokenStore[token] || null;
      }
    } catch {
      return null;
    }
    return null;
  }

  static storeTokenData(token: string, data: { created: number; userId?: string }): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const tokenStore = JSON.parse(localStorage.getItem('token_store') || '{}');
        tokenStore[token] = data;
        localStorage.setItem('token_store', JSON.stringify(tokenStore));
      }
    } catch (error) {
      console.error('Failed to store token data:', error);
    }
  }

  // Ethical hacking protection
  static detectSuspiciousActivity(identifier: string, action: string): boolean {
    const key = `suspicious_${identifier}_${action}`;
    const now = Date.now();
    
    // Check for rapid successive requests
    if (!this.checkRateLimit(key, 5, 10000)) { // 5 actions per 10 seconds
      this.logSecurityEvent('suspicious_activity_detected', {
        identifier,
        action,
        reason: 'rate_limit_exceeded'
      });
      return true;
    }

    // Check for unusual patterns
    const patterns = this.getActivityPatterns(identifier);
    if (patterns.distinctActions > 10 && patterns.timeSpan < 60000) {
      this.logSecurityEvent('suspicious_activity_detected', {
        identifier,
        action,
        reason: 'unusual_pattern',
        patterns
      });
      return true;
    }

    return false;
  }

  private static getActivityPatterns(identifier: string): {
    distinctActions: number;
    timeSpan: number;
    frequency: number;
  } {
    // Simplified pattern detection
    const logs = this.getSecurityLogs();
    const userLogs = logs.filter(log => 
      log.details?.identifier === identifier || 
      log.details?.ip === identifier
    ).slice(0, 50); // Last 50 activities

    if (userLogs.length === 0) {
      return { distinctActions: 0, timeSpan: 0, frequency: 0 };
    }

    const actions = new Set(userLogs.map(log => log.event));
    const oldest = new Date(userLogs[userLogs.length - 1].timestamp).getTime();
    const newest = new Date(userLogs[0].timestamp).getTime();

    return {
      distinctActions: actions.size,
      timeSpan: newest - oldest,
      frequency: userLogs.length / Math.max(1, (newest - oldest) / 60000) // per minute
    };
  }

  static getSecurityLogs(): any[] {
    try {
      if (typeof localStorage !== 'undefined') {
        return JSON.parse(localStorage.getItem('security_logs') || '[]');
      }
    } catch {
      return [];
    }
    return [];
  }

  // User data protection
  static maskSensitiveData(data: any): any {
    if (typeof data === 'string') {
      // Mask emails
      if (data.includes('@')) {
        const [local, domain] = data.split('@');
        return `${local.substring(0, 2)}***@${domain}`;
      }
      // Mask long strings (potential tokens/passwords)
      if (data.length > 20) {
        return `${data.substring(0, 4)}***${data.substring(data.length - 4)}`;
      }
    }
    
    if (typeof data === 'object' && data !== null) {
      const masked: any = {};
      for (const key in data) {
        if (['password', 'token', 'secret', 'key'].some(sensitive => 
          key.toLowerCase().includes(sensitive))) {
          masked[key] = '***MASKED***';
        } else {
          masked[key] = this.maskSensitiveData(data[key]);
        }
      }
      return masked;
    }
    
    return data;
  }

  // Security audit logging
  static logSecurityEvent(event: string, details: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details: this.maskSensitiveData(details),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      ip: 'masked' // In production, get real IP from headers
    };

    // Store in localStorage for demo (use proper logging service in production)
    if (typeof localStorage !== 'undefined') {
      const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      logs.unshift(logEntry);
      logs.splice(100); // Keep only last 100 logs
      localStorage.setItem('security_logs', JSON.stringify(logs));
    }

    console.warn('Security Event:', logEntry);
  }
}

export { SecurityUtils };
export const securityUtils = SecurityUtils;
