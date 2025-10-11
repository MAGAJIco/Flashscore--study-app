# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Sports Central, please report it by emailing the security team. We take all security reports seriously and will respond promptly.

**Please do NOT open public issues for security vulnerabilities.**

### What to Include
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)

We aim to respond within 48 hours and will keep you updated on the resolution progress.

## Security Measures

### Authentication & Authorization
- **Age Verification**: Comprehensive age-based access control
  - Under 13: Blocked from payment features
  - 13-17: Require parental consent with $50 transaction limits
  - 18+: Full access
- **JWT Token Management**: Secure session handling with proper expiry
- **Role-based Access Control**: Admin, user, and minor roles

### API Security
- **CORS Protection**: Allowlist-based CORS configuration (no wildcard origins)
- **Rate Limiting**: API endpoint protection against abuse
- **Input Validation**: Comprehensive validation on all user inputs
- **Request Context Tracking**: Security audit logging

### Data Protection
- **Environment Variables**: Sensitive data stored in environment variables, never in code
- **MongoDB Security**: Production database enforcement with proper connection strings
- **Encryption**: Payment data encrypted via Stripe integration
- **COPPA Compliance**: Children's Online Privacy Protection Act adherence

### Infrastructure Security
- **Development vs Production**: Strict separation with different security policies
  - Development: MongoDB optional for local testing
  - Production: Database required (`REQUIRE_DB=true` or `NODE_ENV=production`)
- **Host Configuration**: 
  - Frontend (0.0.0.0:5000) for Replit/Vercel proxy compatibility
  - Backend (localhost:3001) for internal services in development
  - ML Service (0.0.0.0:8000) for FastAPI endpoints

### Frontend Security (Vercel)
- **Content Security Policy**: XSS protection
- **Service Worker**: PWA with secure offline capabilities
- **Secure Headers**: Configured via Vercel deployment
- **API Route Protection**: Server-side validation before backend calls

### Backend Security (Render)
- **Fastify Security Plugins**: helmet, cors, rate-limit
- **Error Handling**: No sensitive data in error responses
- **Health Checks**: Secure monitoring endpoints
- **Audit Logging**: All critical operations logged

### Payment Security
- **Stripe Integration**: PCI-compliant payment processing
- **Age Verification Metadata**: Included in all payment intents
- **Transaction Limits**: Enforced for minors ($50 max)
- **Parental Consent**: Required for 13-17 age group

## Security Best Practices for Contributors

1. **Never commit secrets or API keys** - Use environment variables
2. **Validate all inputs** - Sanitize user data before processing
3. **Use parameterized queries** - Prevent SQL/NoSQL injection
4. **Keep dependencies updated** - Regularly update npm/Python packages
5. **Follow least privilege** - Grant minimum required permissions
6. **Test security features** - Include security tests in PRs

## Security Utilities

The project includes dedicated security utilities in `packages/shared/src/libs/utils/`:
- `securityUtils.ts` - General security functions
- `apiSecurity.ts` - API protection and validation
- `ethicalSecurityManager.ts` - Security monitoring and audit

## Compliance

- **COPPA Compliant**: Full compliance with children's privacy regulations
- **GDPR Ready**: User data management and privacy controls
- **Accessibility**: WCAG 2.1 compliance for inclusive access

## Security Updates

We regularly review and update our security measures. This document was last updated: October 2025.

For deployment-specific security configurations, see:
- [Deployment Guide](DEPLOYMENT.md)
- [Replit Setup](replit.md)
