# Content Security Policy (CSP) Implementation

## Overview

This document explains the Content Security Policy (CSP) implementation for the Cursor Rules Hub application, which provides protection against Cross-Site Scripting (XSS) and data injection attacks.

## Current CSP Implementation

### CSP Policy Directives

```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com https://static.cloudflareinsights.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: blob: https: http:;
font-src 'self' https://fonts.gstatic.com data:;
connect-src 'self' https://vercel.live https://api.github.com https://github.com https://vitals.vercel-insights.com;
frame-src 'self' https://vercel.live;
media-src 'self' data:;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
block-all-mixed-content
```

### Directive Explanations

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src` | `'self'` | Default fallback - only allow resources from same origin |
| `script-src` | `'self' 'unsafe-eval' 'unsafe-inline' vercel...` | Allow scripts from same origin and trusted CDNs |
| `style-src` | `'self' 'unsafe-inline' fonts.googleapis.com` | Allow styles from same origin and Google Fonts |
| `img-src` | `'self' data: blob: https: http:` | Allow images from various sources (broad for flexibility) |
| `font-src` | `'self' fonts.gstatic.com data:` | Allow fonts from same origin and Google Fonts |
| `connect-src` | `'self' vercel... github...` | Allow connections to trusted APIs |
| `frame-src` | `'self' vercel.live` | Allow frames from same origin and Vercel |
| `media-src` | `'self' data:` | Allow media from same origin and data URLs |
| `object-src` | `'none'` | Block all object, embed, and applet elements |
| `base-uri` | `'self'` | Restrict base tag URLs to same origin |
| `form-action` | `'self'` | Only allow forms to submit to same origin |
| `frame-ancestors` | `'none'` | Prevent page from being embedded in frames |
| `upgrade-insecure-requests` | - | Upgrade HTTP to HTTPS automatically |
| `block-all-mixed-content` | - | Block mixed HTTP/HTTPS content |

## Implementation Details

### Dual Implementation Strategy

We implement CSP headers through two mechanisms for maximum coverage:

1. **Middleware (`src/middleware.ts`)**: Primary implementation for all routes
2. **Next.js Headers (`next.config.js`)**: Fallback implementation

### Middleware Implementation

```typescript
// src/middleware.ts
const cspPolicy = [
  "default-src 'self'",
  // ... policy directives
].join('; ');

response.headers.set('Content-Security-Policy', cspPolicy);
```

**Coverage**: All routes except static assets (images, CSS, JS files)

### Next.js Configuration

```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [{ key: 'Content-Security-Policy', value: cspPolicy }]
    }
  ];
}
```

**Coverage**: Fallback for any routes not covered by middleware

## Security Benefits

### XSS Protection
- Prevents execution of malicious scripts
- Blocks inline scripts unless explicitly allowed
- Restricts script sources to trusted domains

### Data Injection Prevention
- Controls resource loading from external sources
- Prevents unauthorized API calls
- Blocks malicious content injection

### Clickjacking Protection
- `frame-ancestors 'none'` prevents embedding in malicious frames
- `X-Frame-Options: DENY` provides additional protection

## Trusted Domains

### Vercel Services
- `vercel.live` - Vercel preview deployments
- `va.vercel-scripts.com` - Vercel Analytics
- `vitals.vercel-insights.com` - Vercel Web Vitals

### External Services
- `fonts.googleapis.com` - Google Fonts CSS
- `fonts.gstatic.com` - Google Fonts files
- `api.github.com` - GitHub API (if used)
- `github.com` - GitHub resources
- `static.cloudflareinsights.com` - Cloudflare analytics (if used)

## Testing CSP Implementation

### Manual Testing

1. **Check Headers in Browser**:
   - Open DevTools → Network tab
   - Reload page
   - Check response headers for `Content-Security-Policy`

2. **Test CSP Violations**:
   - Open DevTools → Console tab
   - Look for CSP violation warnings

### Automated Testing

```bash
# Test security headers
curl -I https://cursor-rules-hub.haimc.xyz | grep -i content-security-policy

# Test API endpoints
curl -I https://cursor-rules-hub.haimc.xyz/api/docs | grep -i content-security-policy
```

### CSP Testing Tools

- **CSP Evaluator**: https://csp-evaluator.withgoogle.com/
- **Security Headers**: https://securityheaders.com/
- **Mozilla Observatory**: https://observatory.mozilla.org/

## Common CSP Violations and Solutions

### Inline Scripts
**Problem**: `Refused to execute inline script because it violates CSP`
**Solution**: 
- Use external script files
- Add nonce/hash if inline scripts are necessary
- Review if `'unsafe-inline'` is needed

### External Resources
**Problem**: `Refused to load because it violates CSP`
**Solution**:
- Add trusted domain to appropriate directive
- Use `data:` for inline resources if safe

### Third-party Integrations
**Problem**: New service not loading
**Solution**:
1. Identify required domains from browser console
2. Add to appropriate CSP directives
3. Test thoroughly

## Maintenance Guidelines

### Adding New Trusted Domains

1. **Identify the resource type**:
   - Scripts → `script-src`
   - Stylesheets → `style-src` 
   - Images → `img-src`
   - API calls → `connect-src`

2. **Update both implementations**:
   - Update `src/middleware.ts`
   - Update `next.config.js`

3. **Test the changes**:
   - Build application
   - Check for CSP violations
   - Verify functionality

### Security Review Schedule

- **Monthly**: Review CSP violation logs
- **Quarterly**: Audit trusted domains
- **Before releases**: Test CSP with new features
- **After incidents**: Review and strengthen policy

## Monitoring and Alerting

### CSP Violation Reporting

Consider implementing CSP violation reporting:

```javascript
// Add to CSP policy
"report-uri /api/csp-violations"
```

### Browser Console Monitoring

Monitor for these CSP-related messages:
- `Refused to execute inline script`
- `Refused to load the script`
- `Refused to apply inline style`

## Security vs Functionality Balance

### Current Compromises

1. **`'unsafe-inline'` for scripts**: Required for Next.js functionality
2. **`'unsafe-eval'` for scripts**: Required for some React features
3. **Broad `img-src`**: Allows flexibility for user-generated content

### Hardening Opportunities

1. **Implement nonces**: Replace `'unsafe-inline'` with nonces
2. **Restrict image sources**: Use specific domains instead of `https:`
3. **Add violation reporting**: Monitor attempted attacks

## Emergency Procedures

### CSP Breaking the Site

1. **Immediate rollback**:
   ```bash
   git revert [commit-hash]
   npm run build && npm run deploy
   ```

2. **Quick fix**:
   - Comment out CSP headers in middleware
   - Deploy hotfix
   - Investigate and fix properly

3. **Gradual re-enable**:
   - Start with report-only mode
   - Monitor violations
   - Adjust policy incrementally

### Performance Impact

- **Minimal overhead**: CSP headers add ~1KB to responses
- **Client-side processing**: Browser validates resources
- **No server impact**: Headers are static

## Compliance and Standards

### Security Standards Met

- **OWASP Top 10**: Addresses XSS and injection attacks
- **NIST Cybersecurity Framework**: Implements protective controls
- **CSP Level 3**: Uses modern CSP directives

### Browser Support

- **Modern browsers**: Full CSP support
- **Legacy browsers**: Graceful degradation
- **Mobile browsers**: Full support on iOS/Android

## References

- **MDN CSP Guide**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- **OWASP CSP Cheat Sheet**: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- **Google CSP Guide**: https://developers.google.com/web/fundamentals/security/csp 