# Deployment Runbook

## Overview
This runbook provides step-by-step procedures for deploying the Cursor Rules Hub application to various environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [Static Export Deployment](#static-export-deployment)
- [Rollback Procedures](#rollback-procedures)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Vercel CLI (for Vercel deployments)
- Docker (for container deployments)

### Environment Variables
```bash
# Required for production
NEXT_PUBLIC_SITE_URL=https://cursor-rules-hub.haimc.xyz
NEXT_PUBLIC_GA_ID=GA_MEASUREMENT_ID (optional)

# Optional monitoring
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### Pre-deployment Checklist
- [ ] All tests passing (`npm run test`)
- [ ] Linting clean (`npm run lint`)
- [ ] Type checking clean (`npm run type-check`)
- [ ] Build successful (`npm run build`)
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Database integrity verified
- [ ] Backup procedures confirmed

## Vercel Deployment

### Initial Setup

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Link Project**
```bash
vercel link
```

### Production Deployment

1. **Pre-deployment Steps**
```bash
# Ensure clean working directory
git status

# Pull latest changes
git pull origin main

# Install dependencies
npm ci

# Run quality checks
npm run lint
npm run type-check
npm run test
npm run build
```

2. **Deploy to Production**
```bash
# Deploy to production
vercel --prod

# Alternative: Deploy specific commit
vercel --prod --target production
```

3. **Set Environment Variables** (First time only)
```bash
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_GA_ID production
```

### Preview Deployment

```bash
# Deploy preview from current branch
vercel

# Deploy specific branch
git checkout feature/new-feature
vercel
```

### Deployment Status Check

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]
```

## Docker Deployment

### Build Docker Image

1. **Create Dockerfile** (if not exists)
```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

2. **Build and Tag Image**
```bash
# Build image
docker build -t cursor-rules-hub:latest .

# Tag for registry
docker tag cursor-rules-hub:latest your-registry/cursor-rules-hub:v1.0.0
```

3. **Push to Registry**
```bash
# Push to Docker Hub
docker push your-registry/cursor-rules-hub:v1.0.0

# Push to ECR (AWS)
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-west-2.amazonaws.com
docker push your-account.dkr.ecr.us-west-2.amazonaws.com/cursor-rules-hub:v1.0.0
```

### Container Deployment

#### Local Docker Run
```bash
docker run -d \
  --name cursor-rules-hub \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  cursor-rules-hub:latest
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    image: cursor-rules-hub:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SITE_URL=https://cursor-rules-hub.haimc.xyz
      - NODE_ENV=production
    restart: unless-stopped
```

```bash
# Deploy with Docker Compose
docker-compose up -d

# Update deployment
docker-compose pull
docker-compose up -d --force-recreate
```

#### Kubernetes Deployment
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cursor-rules-hub
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cursor-rules-hub
  template:
    metadata:
      labels:
        app: cursor-rules-hub
    spec:
      containers:
      - name: app
        image: your-registry/cursor-rules-hub:v1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_SITE_URL
          value: "https://cursor-rules-hub.haimc.xyz"
---
apiVersion: v1
kind: Service
metadata:
  name: cursor-rules-hub-service
spec:
  selector:
    app: cursor-rules-hub
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

```bash
# Deploy to Kubernetes
kubectl apply -f k8s-deployment.yaml

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services
```

## Static Export Deployment

### Generate Static Export

1. **Configure for Static Export**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

2. **Build and Export**
```bash
# Build for static export
npm run build

# Generate static files
npm run export
```

### Deploy to Static Hosting

#### AWS S3 + CloudFront
```bash
# Sync to S3 bucket
aws s3 sync out/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=out
```

#### GitHub Pages
```bash
# Push to gh-pages branch
npm install -g gh-pages
gh-pages -d out
```

## Rollback Procedures

### Vercel Rollback
```bash
# List recent deployments
vercel ls

# Promote previous deployment
vercel promote [previous-deployment-url]
```

### Docker Rollback
```bash
# Stop current container
docker stop cursor-rules-hub

# Remove current container
docker rm cursor-rules-hub

# Run previous version
docker run -d \
  --name cursor-rules-hub \
  -p 3000:3000 \
  cursor-rules-hub:v0.9.0
```

### Kubernetes Rollback
```bash
# Check rollout history
kubectl rollout history deployment/cursor-rules-hub

# Rollback to previous version
kubectl rollout undo deployment/cursor-rules-hub

# Rollback to specific revision
kubectl rollout undo deployment/cursor-rules-hub --to-revision=2
```

## Post-Deployment Verification

### Automated Health Checks

1. **Basic Health Check**
```bash
# Check if site is responding
curl -f https://your-domain.com || exit 1

# Check specific endpoints
curl -f https://your-domain.com/api/rules || exit 1
curl -f https://your-domain.com/categories || exit 1
```

2. **Performance Verification**
```bash
# Check page load time
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com

# Where curl-format.txt contains:
#      time_namelookup:  %{time_namelookup}\n
#         time_connect:  %{time_connect}\n
#      time_appconnect:  %{time_appconnect}\n
#     time_pretransfer:  %{time_pretransfer}\n
#        time_redirect:  %{time_redirect}\n
#   time_starttransfer:  %{time_starttransfer}\n
#                     ----------\n
#           time_total:  %{time_total}\n
```

### Manual Verification Checklist
- [ ] Homepage loads correctly
- [ ] Search functionality works
- [ ] Category pages accessible
- [ ] Rule detail pages render
- [ ] Navigation works properly
- [ ] Mobile responsiveness
- [ ] Dark mode toggle
- [ ] Error pages (404, 500) display correctly
- [ ] Analytics tracking (if enabled)
- [ ] SEO meta tags present

### Database Integrity Check
```bash
# Verify rule count
curl -s https://your-domain.com/api/rules | jq '.total'

# Check for any missing categories
curl -s https://your-domain.com/api/categories | jq '.categories | length'

# Verify search is working
curl -s "https://your-domain.com/api/rules?search=react" | jq '.rules | length'
```

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### 2. Environment Variable Issues
```bash
# Check environment variables
vercel env ls

# Pull environment variables
vercel env pull .env.local
```

#### 3. Memory Issues (Docker)
```bash
# Increase memory limit
docker run -d --memory="2g" cursor-rules-hub:latest
```

#### 4. Database Loading Issues
```bash
# Verify database file exists and is valid JSON
jq . src/data/cursor_rules_database.json > /dev/null

# Check file size
ls -lh src/data/cursor_rules_database.json
```

### Monitoring Commands

```bash
# Check deployment status
vercel ls --scope=team

# View real-time logs
vercel logs --follow

# Check Docker container health
docker ps
docker logs cursor-rules-hub

# Monitor Kubernetes pods
kubectl get pods -w
kubectl logs -f deployment/cursor-rules-hub
```

### Emergency Contacts

- **Primary Engineer**: [email@example.com]
- **DevOps Team**: [devops@example.com]
- **Vercel Support**: [vercel.com/support]

### Escalation Procedures

1. **Level 1**: Self-service using this runbook
2. **Level 2**: Contact primary engineer
3. **Level 3**: Contact DevOps team
4. **Level 4**: Contact external support (Vercel, cloud provider)

---

**Last Updated**: 2024-01-01  
**Version**: 1.0  
**Owner**: DevOps Team 