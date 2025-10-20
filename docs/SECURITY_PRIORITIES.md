
# Security Implementation Priorities

**Critical for Production**: Must complete before Render deployment  
**Timeline**: 2 months  
**Compliance**: COPPA, GDPR, PCI-DSS (payments)

---

## 🔴 CRITICAL - Week 1-3 (Must Fix)

### 1. JWT Authentication Implementation
**Priority**: P0 - BLOCKER  
**Current State**: Placeholder functions only  
**File**: `apps/backend/src/middleware/authMiddleware.ts`

**What's Missing**:
```typescript
// Current - NOT SECURE
export const verifyToken = (token: string) => {
  // TODO: Implement actual JWT verification
  return { userId: 'placeholder' };
};
```

**Required Implementation**:
- ✅ Use `jsonwebtoken` library for signing/verification
- ✅ Implement token expiration (15min access, 7d refresh)
- ✅ Store refresh tokens in database with user association
- ✅ Implement token rotation on refresh
- ✅ Add token blacklist for logout
- ✅ Use RS256 algorithm (asymmetric keys)

**Security Requirements**:
- Private key stored in environment variable
- Public key for verification
- Token includes: userId, role, expiresAt
- HttpOnly, Secure cookies for token storage

---

### 2. Data Encryption Implementation
**Priority**: P0 - BLOCKER  
**Current State**: Returns plaintext  
**File**: `packages/shared/src/libs/utils/securityUtils.ts`

**What's Missing**:
```typescript
// Current - NOT SECURE
export function encryptData(data: string): string {
  return data; // Returns plaintext!
}
```

**Required Implementation**:
- ✅ Use Web Crypto API (browser) or Node crypto (server)
- ✅ Implement AES-256-GCM encryption
- ✅ Generate unique IV per encryption
- ✅ Use PBKDF2 for key derivation
- ✅ Add authentication tag verification

**What to Encrypt**:
- Payment card details (PCI-DSS required)
- User personal information (COPPA required)
- Session tokens
- API keys in database

**Key Management**:
- Master encryption key in environment variable
- Rotate keys every 90 days
- Keep old keys for decryption (with expiry)

---

### 3. SQL Injection Prevention
**Priority**: P0 - BLOCKER  
**Risk**: Database compromise

**Implementation**:
- ✅ Use parameterized queries (already using Mongoose - ✓)
- ✅ Validate all user inputs
- ✅ Escape special characters
- ✅ Use ORM exclusively (no raw queries)

**MongoDB Specific**:
- ✅ Disable `$where` operator
- ✅ Sanitize query operators
- ✅ Use schema validation

---

### 4. XSS Protection
**Priority**: P0 - BLOCKER  
**Current**: Basic headers only

**Required**:
- ✅ Content Security Policy (CSP) - already in `securityHeaders.ts`
- ✅ Sanitize all user-generated content
- ✅ Use DOMPurify for HTML sanitization
- ✅ Escape output in templates
- ✅ HttpOnly cookies for sensitive data

**CSP Configuration** (strengthen existing):
```typescript
"default-src 'self'; 
script-src 'self' 'unsafe-inline' 'unsafe-eval'; // REMOVE unsafe-* in production
style-src 'self' 'unsafe-inline'; // REMOVE unsafe-inline in production
img-src 'self' data: https:;
connect-src 'self' https://api.replit.com;
frame-ancestors 'none';"
```

---

## 🟡 HIGH - Week 4-5 (Important)

### 5. Rate Limiting Enhancement
**Priority**: P1  
**Current**: Global 100 req/min  
**File**: `apps/backend/src/main.ts`

**Endpoint-Specific Limits**:
```typescript
// Authentication endpoints
POST /api/auth/login        → 5 req/15min per IP
POST /api/auth/register     → 3 req/hour per IP
POST /api/auth/reset        → 3 req/hour per email

// Payment endpoints
POST /api/payments/*        → 10 req/hour per user

// ML Predictions
POST /api/predictions       → 30 req/min per user
POST /api/ml/predict        → 20 req/min per user

// General API
GET /api/*                  → 100 req/min per user
```

**Implementation**:
- ✅ Use `@fastify/rate-limit` with Redis store
- ✅ Track by: IP, userId, API key
- ✅ Return 429 with Retry-After header
- ✅ Log rate limit violations

---

### 6. CORS Hardening
**Priority**: P1  
**Current**: Dynamic origin checking (good start)  
**File**: `apps/backend/src/main.ts`

**Production CORS**:
```typescript
const PRODUCTION_ORIGINS = [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  'https://yourdomain.vercel.app'
];

// NO wildcards in production!
// NO 'http://localhost' in production!
```

**Requirements**:
- ✅ Strict origin whitelist (no regex in production)
- ✅ credentials: true only for trusted origins
- ✅ Limit allowed methods (no TRACE, TRACK)
- ✅ Limit exposed headers

---

### 7. Input Validation & Sanitization
**Priority**: P1  
**Current**: Minimal validation

**Implementation Needed**:
- ✅ Use `zod` for schema validation on all endpoints
- ✅ Validate: type, length, format, range
- ✅ Sanitize file uploads (if any)
- ✅ Validate Content-Type headers

**Example**:
```typescript
const PredictionSchema = z.object({
  features: z.array(z.number().min(0).max(1)).length(7),
  match_context: z.object({
    home_team: z.string().max(100),
    away_team: z.string().max(100)
  }).optional()
});
```

---

### 8. Session Management
**Priority**: P1  
**Current**: Not fully implemented

**Requirements**:
- ✅ Secure session storage (Redis recommended)
- ✅ Session timeout: 30 min idle, 12 hours absolute
- ✅ Session fixation prevention (regenerate on login)
- ✅ Concurrent session limits (max 3 per user)
- ✅ Logout from all devices feature

---

## 🟢 MEDIUM - Week 6-7 (Should Fix)

### 9. API Key Management
**Priority**: P2  
**For**: Partner integrations, developer portal

**Implementation**:
- ✅ Generate cryptographically secure API keys
- ✅ Hash keys before storage (like passwords)
- ✅ Key rotation mechanism
- ✅ Scope-based permissions
- ✅ Usage tracking and quotas

---

### 10. Audit Logging
**Priority**: P2  
**Current**: Basic error logging only

**What to Log**:
- ✅ All authentication attempts (success/failure)
- ✅ Authorization failures
- ✅ Data access (PII, payments)
- ✅ Configuration changes
- ✅ Admin actions
- ✅ COPPA consent events

**Log Format**:
```typescript
{
  timestamp: ISO8601,
  level: 'info' | 'warn' | 'error',
  userId: string,
  action: string,
  resource: string,
  ip: string,
  userAgent: string,
  result: 'success' | 'failure',
  metadata: object
}
```

---

### 11. Dependency Security
**Priority**: P2  
**Action**: Regular audits

**Process**:
- ✅ Run `pnpm audit` weekly
- ✅ Update dependencies monthly
- ✅ Use Snyk or Dependabot
- ✅ Review security advisories
- ✅ Lock file integrity checks

---

### 12. Error Handling Security
**Priority**: P2  
**Risk**: Information disclosure

**Requirements**:
- ✅ Never expose stack traces to users (production)
- ✅ Generic error messages to client
- ✅ Detailed logs server-side only
- ✅ No sensitive data in error messages
- ✅ Proper HTTP status codes

---

## 🧒 COPPA SPECIFIC SECURITY

### 13. Parental Consent Verification
**Priority**: P0 - LEGAL REQUIREMENT  
**For**: Users under 13

**Implementation**:
1. **Email Verification** (Minimum)
   - Send verification email to parent
   - Confirm consent with unique link
   - Log consent with timestamp

2. **Credit Card Verification** (Recommended)
   - Charge $0.50 to parent's card
   - Refund immediately
   - Proves adult cardholder

3. **Video Consent** (Future)
   - Parent records video consent
   - Verify against ID document

**Database Schema**:
```typescript
interface ParentalConsent {
  childUserId: string;
  parentEmail: string;
  verificationMethod: 'email' | 'credit_card' | 'video';
  consentGivenAt: Date;
  ipAddress: string;
  consentDocument: string; // Stored securely
  verified: boolean;
  expiresAt: Date; // Re-verify annually
}
```

---

### 14. Data Minimization (COPPA)
**Priority**: P0 - LEGAL REQUIREMENT

**Rules**:
- ✅ Collect only necessary data from minors
- ✅ No behavioral tracking for <13
- ✅ No targeted ads for <13
- ✅ No geolocation for <13
- ✅ No social features for <13 (or heavy moderation)

**Implementation**:
- Age-based feature gating
- Separate database tables for minor data
- Automatic data deletion on age-out (13th birthday)

---

### 15. Kids Mode Security
**Priority**: P1  
**Current**: Frontend restrictions only

**Server-Side Enforcement**:
- ✅ Check `user.isMinor` on every request
- ✅ Block betting endpoints (403 Forbidden)
- ✅ Block payment endpoints (403 Forbidden)
- ✅ Filter explicit content
- ✅ Moderate chat messages
- ✅ Parent-approved contacts only

**File**: `apps/backend/src/plugins/kidsModeGating.ts` (already exists, verify logic)

---

## 🔒 PAYMENT SECURITY (PCI-DSS)

### 16. Payment Card Data
**Priority**: P0 - PCI-DSS REQUIRED

**Rules** (if storing cards):
- ✅ NEVER store CVV/CVC
- ✅ Encrypt PAN (Primary Account Number)
- ✅ Tokenize cards (use Stripe tokens)
- ✅ Use PCI-compliant processor
- ✅ Annual PCI audit

**Recommendation**: **Never store card data yourself**
- ✅ Use Stripe Payment Intents (recommended)
- ✅ Stripe handles all card data
- ✅ You only store Stripe customer ID

---

## 📋 SECURITY CHECKLIST

**Before Deployment**:
- [ ] All P0 issues fixed (Critical)
- [ ] All P1 issues fixed (High)
- [ ] Penetration testing completed
- [ ] Security audit passed
- [ ] COPPA compliance verified
- [ ] PCI-DSS questionnaire (if applicable)
- [ ] Secrets rotated (new keys for production)
- [ ] WAF configured (Cloudflare/AWS WAF)
- [ ] DDoS protection enabled
- [ ] Monitoring and alerts configured

**Post-Deployment**:
- [ ] Monitor logs for 48 hours
- [ ] Verify rate limits working
- [ ] Test auth flows in production
- [ ] Verify encryption working
- [ ] Check CSP violations
- [ ] Review access logs

---

## 🚨 INCIDENT RESPONSE PLAN

**If Security Breach Detected**:
1. **Immediately**: Isolate affected systems
2. **Within 1 hour**: Notify team lead
3. **Within 24 hours**: Assess impact
4. **Within 72 hours**: Notify users (GDPR/COPPA)
5. **Within 1 week**: Root cause analysis
6. **Within 2 weeks**: Implement fixes

**Contacts**:
- Security Lead: [email]
- Legal Team: [email]
- Hosting Provider: Render support
- Users: Email notification system

---

## 📊 SECURITY METRICS

**Track Weekly**:
- Failed login attempts
- Rate limit violations
- CORS errors
- Auth token failures
- API errors by endpoint
- Payment failures

**Track Monthly**:
- Dependency vulnerabilities
- Security scan results
- Audit log volume
- Incident count
- Response times
