
class EthicalSecurityManager {
  private static readonly THREAT_PATTERNS = [
    /\b(script|javascript|vbscript|onload|onerror)\b/i,
    /[<>].*script/i,
    /<.*on\w+.*=/i,
    /sql.*injection/i,
    /union.*select/i,
    /\beval\s*\(/i,
    /\bexec\s*\(/i
  ];

  private static readonly RATE_LIMITS = {
    login_attempts: { max: 5, window: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
    api_calls: { max: 100, window: 60 * 1000 }, // 100 calls per minute
    cache_access: { max: 50, window: 60 * 1000 }, // 50 cache accesses per minute
    data_requests: { max: 20, window: 60 * 1000 } // 20 data requests per minute
  };

  // Detect potential XSS attempts
  static detectXSS(input: string): boolean {
    if (typeof input !== 'string') return false;
    
    return this.THREAT_PATTERNS.some(pattern => pattern.test(input));
  }

  // Comprehensive input validation
  static validateInput(input: any, type: 'username' | 'email' | 'general' | 'content'): boolean {
    if (input == null) return false;
    
    const str = String(input);
    
    // Check for malicious patterns
    if (this.detectXSS(str)) {
      this.logThreat('xss_attempt', { input: str.substring(0, 100) });
      return false;
    }

    // Type-specific validation
    switch (type) {
      case 'username':
        return /^[a-zA-Z0-9_-]{3,30}$/.test(str);
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str) && str.length <= 254;
      case 'content':
        return str.length <= 5000 && !this.detectXSS(str);
      case 'general':
        return str.length <= 1000;
      default:
        return false;
    }
  }

  // Enhanced rate limiting with user behavior analysis
  static checkAdvancedRateLimit(
    identifier: string, 
    action: string, 
    userId?: string
  ): { allowed: boolean; reason?: string } {
    const limits = this.RATE_LIMITS[action as keyof typeof this.RATE_LIMITS];
    if (!limits) return { allowed: true };

    const SecurityUtils = require('./securityUtils').default;
    const key = `${action}_${identifier}`;
    
    if (!SecurityUtils.checkRateLimit(key, limits.max, limits.window)) {
      this.logThreat('rate_limit_exceeded', {
        identifier,
        action,
        userId,
        limits
      });
      return { allowed: false, reason: 'Rate limit exceeded' };
    }

    // Additional behavioral analysis
    if (userId) {
      const behavior = this.analyzeBehavior(userId, action);
      if (behavior.suspicious) {
        this.logThreat('suspicious_behavior', {
          userId,
          action,
          behavior
        });
        return { allowed: false, reason: 'Suspicious behavior detected' };
      }
    }

    return { allowed: true };
  }

  // User behavior analysis
  private static analyzeBehavior(userId: string, action: string): {
    suspicious: boolean;
    score: number;
    factors: string[];
  } {
    const SecurityUtils = require('./securityUtils').default;
    const logs = SecurityUtils.getSecurityLogs();
    const userLogs = logs.filter(log => 
      log.details?.userId === userId
    ).slice(0, 100);

    let suspiciousScore = 0;
    const factors: string[] = [];

    // Check for rapid actions
    const recentActions = userLogs.filter(log => 
      Date.now() - new Date(log.timestamp).getTime() < 60000
    );

    if (recentActions.length > 20) {
      suspiciousScore += 30;
      factors.push('rapid_actions');
    }

    // Check for error patterns
    const errors = userLogs.filter(log => log.event.includes('error'));
    if (errors.length > 10) {
      suspiciousScore += 20;
      factors.push('high_error_rate');
    }

    // Check for unauthorized access attempts
    const unauthorized = userLogs.filter(log => 
      log.event.includes('unauthorized')
    );
    if (unauthorized.length > 3) {
      suspiciousScore += 40;
      factors.push('unauthorized_attempts');
    }

    return {
      suspicious: suspiciousScore > 50,
      score: suspiciousScore,
      factors
    };
  }

  // Content filtering and sanitization
  static sanitizeContent(content: string): string {
    if (!content || typeof content !== 'string') return '';
    
    // Remove potential XSS patterns
    let sanitized = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<\s*\/?\s*(script|object|embed|link|style|meta)[^>]*>/gi, '');
    
    // Encode special characters
    sanitized = sanitized
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
    
    return sanitized.trim().substring(0, 5000);
  }

  // Real-time threat monitoring
  static monitorThreat(action: string, details: any): void {
    const threat = {
      timestamp: new Date().toISOString(),
      action,
      details: this.maskSensitiveData(details),
      severity: this.calculateSeverity(action, details),
      mitigated: false
    };

    // Store threat log
    if (typeof localStorage !== 'undefined') {
      const threats = JSON.parse(localStorage.getItem('threat_log') || '[]');
      threats.unshift(threat);
      threats.splice(50); // Keep last 50 threats
      localStorage.setItem('threat_log', JSON.stringify(threats));
    }

    // Auto-mitigation for high-severity threats
    if (threat.severity >= 8) {
      this.autoMitigate(threat);
    }
  }

  private static calculateSeverity(action: string, details: any): number {
    let severity = 1;

    // Base severity by action type
    const severityMap: { [key: string]: number } = {
      'xss_attempt': 8,
      'sql_injection': 9,
      'rate_limit_exceeded': 4,
      'suspicious_behavior': 6,
      'unauthorized_access': 7,
      'data_breach_attempt': 10
    };

    severity = severityMap[action] || 1;

    // Adjust based on user history
    if (details.userId && this.analyzeBehavior(details.userId, action).suspicious) {
      severity += 2;
    }

    return Math.min(severity, 10);
  }

  private static autoMitigate(threat: any): void {
    // In production, implement actual mitigation strategies
    console.warn('High-severity threat detected - implementing mitigation:', threat);
    
    this.logThreat('auto_mitigation', {
      originalThreat: threat,
      action: 'temporary_restriction'
    });
  }

  private static logThreat(type: string, details: any): void {
    const SecurityUtils = require('./securityUtils').default;
    SecurityUtils.logSecurityEvent(`threat_${type}`, details);
    this.monitorThreat(type, details);
  }

  private static maskSensitiveData(data: any): any {
    const SecurityUtils = require('./securityUtils').default;
    return SecurityUtils.maskSensitiveData(data);
  }

  // Get security dashboard data
  static getSecurityDashboard(): {
    threats: any[];
    riskLevel: string;
    recommendations: string[];
  } {
    const threats = typeof localStorage !== 'undefined' 
      ? JSON.parse(localStorage.getItem('threat_log') || '[]')
      : [];

    const recentThreats = threats.filter((t: any) => 
      Date.now() - new Date(t.timestamp).getTime() < 24 * 60 * 60 * 1000
    );

    const highSeverityThreats = recentThreats.filter((t: any) => t.severity >= 7);

    let riskLevel = 'LOW';
    const recommendations: string[] = [];

    if (highSeverityThreats.length > 0) {
      riskLevel = 'HIGH';
      recommendations.push('Review and address high-severity threats immediately');
    } else if (recentThreats.length > 10) {
      riskLevel = 'MEDIUM';
      recommendations.push('Monitor increased security activity');
    }

    if (recentThreats.some((t: any) => t.action === 'rate_limit_exceeded')) {
      recommendations.push('Consider implementing CAPTCHA for repeated actions');
    }

    return {
      threats: threats.slice(0, 20),
      riskLevel,
      recommendations
    };
  }
}

export { EthicalSecurityManager };
