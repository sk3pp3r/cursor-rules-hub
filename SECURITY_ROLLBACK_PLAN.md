# 🔄 Security Rollback Plan

## 📋 **Quick Rollback Overview**

This document provides step-by-step instructions to rollback security changes if they cause issues in production.

### ⏰ **Estimated Rollback Time: 5-10 minutes**

---

## 🚨 **Emergency Rollback (Critical Issues)**

If the site is completely broken or inaccessible:

### **Step 1: Remove Middleware (2 minutes)**
```bash
# Delete the security middleware
rm src/middleware.ts
```

### **Step 2: Revert Next.js Config (1 minute)**
```bash
# Restore original next.config.js
git checkout HEAD~1 -- next.config.js
```

### **Step 3: Deploy Immediately**
```bash
# If using Vercel
vercel --prod

# If using other platforms
npm run build && npm start
```

---

## 🔧 **Selective Rollback (Specific Issues)**

### **CSP Issues (Scripts/Styles Not Loading)**

#### **Option A: Disable CSP Temporarily**
Edit `src/middleware.ts`:
```typescript
// Comment out CSP header
// 'Content-Security-Policy': cspPolicy,
```

#### **Option B: Relax CSP Policy**
```typescript
const cspPolicy = [
  "default-src *",  // Allow all sources temporarily
  "script-src * 'unsafe-inline' 'unsafe-eval'",
  "style-src * 'unsafe-inline'",
  // ... rest remains same
].join('; ');
```

### **Frame/Embed Issues**

#### **Allow Specific Domains**
Edit `src/middleware.ts`:
```typescript
'X-Frame-Options': 'SAMEORIGIN',  // Instead of 'DENY'
// OR in CSP:
"frame-ancestors 'self' https://trusted-domain.com",
```

### **Image Loading Issues**

#### **Relax Image CSP**
Edit `src/middleware.ts`:
```typescript
"img-src * data: blob:",  // Allow all images
```

### **API Issues**

#### **Remove API Headers**
Edit `next.config.js`:
```typescript
// Comment out the entire headers() section
/*
async headers() {
  // ...
},
*/
```

---

## 📁 **File-by-File Rollback**

### **Critical Files Created/Modified**

| File | Action | Rollback Command |
|------|--------|------------------|
| `src/middleware.ts` | Created | `rm src/middleware.ts` |
| `next.config.js` | Modified | `git checkout HEAD~1 -- next.config.js` |
| `extract_rules.py` | Modified | `git checkout HEAD~1 -- extract_rules.py` |
| `package.json` | Modified | `git checkout HEAD~1 -- package.json` |
| `SECURITY.md` | Created | `rm SECURITY.md` |

### **Complete Rollback Command**
```bash
# Single command to rollback all security changes
git checkout HEAD~1 -- next.config.js extract_rules.py package.json
rm src/middleware.ts SECURITY.md SECURITY_ROLLBACK_PLAN.md
npm install
npm run build
```

---

## 🔍 **Issue Diagnosis Guide**

### **Common Issues & Solutions**

#### **1. White Screen / App Won't Load**
**Symptom**: Page loads but shows blank screen
**Cause**: CSP blocking scripts
**Fix**: 
```typescript
// In middleware.ts, temporarily add:
"script-src 'self' 'unsafe-inline' 'unsafe-eval' *",
```

#### **2. Styles Not Applied**
**Symptom**: Page loads but no styling
**Cause**: CSP blocking stylesheets
**Fix**:
```typescript
// In middleware.ts, temporarily add:
"style-src 'self' 'unsafe-inline' *",
```

#### **3. Images Not Loading**
**Symptom**: Broken image icons
**Cause**: CSP blocking image sources
**Fix**:
```typescript
// In middleware.ts, temporarily add:
"img-src * data: blob:",
```

#### **4. GitHub OAuth Broken**
**Symptom**: Login doesn't work
**Cause**: CSP blocking OAuth redirect
**Fix**:
```typescript
// In middleware.ts, add:
"connect-src 'self' https://*.github.com https://api.github.com",
```

#### **5. Build Failures**
**Symptom**: `npm run build` fails
**Cause**: TypeScript/ESLint errors
**Fix**:
```bash
# Quick build without strict checks
npm run build -- --no-lint
# OR
npm run build -- --ignore-error
```

---

## 📊 **Monitoring After Rollback**

### **Immediate Checks (0-5 minutes)**
- [ ] Homepage loads correctly
- [ ] User can log in with GitHub
- [ ] Rules page displays correctly
- [ ] Search functionality works
- [ ] Mobile view works

### **Extended Checks (5-15 minutes)**
- [ ] All pages accessible
- [ ] Forms work (submit rules)
- [ ] Images load correctly
- [ ] Navigation works
- [ ] User profile displays

### **Security Verification**
```bash
# Check if security headers are still present
curl -I https://cursor-rules-hub.haimc.xyz/

# Verify no X-Powered-By leak
curl -I https://cursor-rules-hub.haimc.xyz/ | grep -i "x-powered-by"

# Test basic functionality
curl https://cursor-rules-hub.haimc.xyz/api/rules
```

---

## 🎯 **Gradual Re-implementation**

If you need to rollback, here's how to gradually re-implement security:

### **Phase 1: Basic Headers**
```typescript
// Add only basic security headers first
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};
```

### **Phase 2: Permissive CSP**
```typescript
// Add very permissive CSP
const cspPolicy = [
  "default-src *",
  "script-src * 'unsafe-inline' 'unsafe-eval'",
  "style-src * 'unsafe-inline'",
  "img-src * data: blob:",
].join('; ');
```

### **Phase 3: Gradually Restrict**
Gradually tighten CSP directives one by one, testing after each change.

---

## 🛡️ **Testing in Development**

Before deploying security changes to production:

```bash
# Test locally first
npm run dev
# Verify all functionality works

# Test build
npm run build
npm start
# Verify production build works

# Test security headers
curl -I http://localhost:3000/
```

---

## 📞 **Emergency Contacts**

| Role | Contact | When to Contact |
|------|---------|-----------------|
| **Site Down** | [Primary Developer] | Site completely inaccessible |
| **Security Issue** | [Security Team] | Security vulnerability discovered |
| **User Issues** | [Support Team] | Users reporting problems |

---

## 📝 **Post-Rollback Actions**

1. **Document the Issue**
   - What went wrong?
   - When did it happen?
   - What was the impact?

2. **Root Cause Analysis**
   - Why did the security change cause issues?
   - Was it a configuration problem?
   - Was testing insufficient?

3. **Prevent Recurrence**
   - Update testing procedures
   - Improve staging environment
   - Better CSP testing tools

4. **Plan Re-implementation**
   - Address root cause
   - Test more thoroughly
   - Gradual rollout strategy

---

## ⚡ **Quick Reference Commands**

```bash
# Emergency full rollback
git reset --hard HEAD~1

# Remove just middleware
rm src/middleware.ts

# Disable CSP only
# Edit src/middleware.ts and comment out CSP line

# Check deployment status
vercel --prod --confirm

# Monitor logs
vercel logs
``` 