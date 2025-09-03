# 🚀 Deployment Guide

This guide covers various deployment options for powerfulwebsites.space, a modern Angular v20+ application with static site generation capabilities.

## 📋 Table of Contents

- [Quick Deploy](#quick-deploy)
- [Build Process](#build-process)
- [Deployment Platforms](#deployment-platforms)
- [Environment Configuration](#environment-configuration)
- [CI/CD Setup](#cicd-setup)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

## ⚡ Quick Deploy

### 1. Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sayedmahmoud266/powerfulwebsites.space)

**Steps:**
1. Click the deploy button above
2. Connect your GitHub account
3. Configure environment variables
4. Deploy automatically

### 2. Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sayedmahmoud266/powerfulwebsites.space)

**Steps:**
1. Click the deploy button above
2. Connect your GitHub repository
3. Set build settings (see below)
4. Deploy

## 🏗️ Build Process

### Development Build
```bash
npm run build
```

### Production Build
```bash
npm run build:prod
```

### Static Site Generation (SSG)
```bash
npm run prerender
```

### Build Output
- **Location**: `dist/powerfulwebsites-space/`
- **Type**: Static files ready for any web server
- **Size**: Optimized for performance

## 🌐 Deployment Platforms

### Vercel (Recommended)

**Why Vercel?**
- Excellent Angular support
- Automatic deployments from Git
- Edge functions support
- Built-in performance optimization

**Configuration (`vercel.json`):**
```json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist/powerfulwebsites-space",
  "framework": "angular",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**Manual Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Build and deploy
npm run build:prod
vercel --prod
```

### Netlify

**Configuration (`netlify.toml`):**
```toml
[build]
  command = "npm run build:prod"
  publish = "dist/powerfulwebsites-space"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Manual Deployment:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build:prod
netlify deploy --prod --dir=dist/powerfulwebsites-space
```

### GitHub Pages

**Configuration (`.github/workflows/deploy.yml`):**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build:prod
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist/powerfulwebsites-space
```

### AWS S3 + CloudFront

**Prerequisites:**
- AWS CLI configured
- S3 bucket created
- CloudFront distribution set up

**Deployment Script:**
```bash
#!/bin/bash

# Build the application
npm run build:prod

# Sync to S3
aws s3 sync dist/powerfulwebsites-space/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Firebase Hosting

**Configuration (`firebase.json`):**
```json
{
  "hosting": {
    "public": "dist/powerfulwebsites-space",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Deployment:**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Build and deploy
npm run build:prod
firebase deploy
```

## 🔧 Environment Configuration

### Environment Variables

Create environment-specific files:

**Production (`environment.prod.ts`):**
```typescript
export const environment = {
  production: true,
  supabaseUrl: 'YOUR_PRODUCTION_SUPABASE_URL',
  supabaseAnonKey: 'YOUR_PRODUCTION_SUPABASE_KEY',
  apiUrl: 'https://api.powerfulwebsites.space',
  googleAnalyticsId: 'GA_TRACKING_ID'
};
```

**Staging (`environment.staging.ts`):**
```typescript
export const environment = {
  production: false,
  supabaseUrl: 'YOUR_STAGING_SUPABASE_URL',
  supabaseAnonKey: 'YOUR_STAGING_SUPABASE_KEY',
  apiUrl: 'https://staging-api.powerfulwebsites.space',
  googleAnalyticsId: ''
};
```

### Platform-Specific Environment Variables

**Vercel:**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

**Netlify:**
```bash
netlify env:set VITE_SUPABASE_URL "your_value"
netlify env:set VITE_SUPABASE_ANON_KEY "your_value"
```

**GitHub Actions Secrets:**
1. Go to repository Settings > Secrets
2. Add `VITE_SUPABASE_URL`
3. Add `VITE_SUPABASE_ANON_KEY`

## 🔄 CI/CD Setup

### GitHub Actions (Complete Workflow)

**`.github/workflows/ci-cd.yml`:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm test -- --watch=false --browsers=ChromeHeadless
    
    - name: Build application
      run: npm run build:prod

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build for staging
      run: npm run build:prod
      env:
        VITE_SUPABASE_URL: ${{ secrets.STAGING_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.STAGING_SUPABASE_ANON_KEY }}
    
    - name: Deploy to staging
      # Add your staging deployment steps here

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build for production
      run: npm run build:prod
      env:
        VITE_SUPABASE_URL: ${{ secrets.PROD_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.PROD_SUPABASE_ANON_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## ⚡ Performance Optimization

### Pre-deployment Checklist

- [ ] **Bundle Analysis**: Run `npm run analyze` to check bundle size
- [ ] **Lighthouse Audit**: Ensure scores > 90 across all metrics
- [ ] **Image Optimization**: All images optimized and using `NgOptimizedImage`
- [ ] **Lazy Loading**: All routes are lazy-loaded
- [ ] **Service Worker**: PWA features implemented
- [ ] **Compression**: Gzip/Brotli enabled on server
- [ ] **CDN**: Static assets served from CDN

### Bundle Analysis
```bash
npm run build:prod -- --stats-json
npx webpack-bundle-analyzer dist/powerfulwebsites-space/stats.json
```

### Performance Monitoring

**Add to `index.html`:**
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>

<!-- Web Vitals -->
<script type="module">
  import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';
  
  function sendToAnalytics(metric) {
    gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
  
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
</script>
```

## 🔍 Troubleshooting

### Common Issues

**1. Build Fails on Platform**
```bash
# Check Node.js version
node --version

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Build locally first
npm run build:prod
```

**2. Environment Variables Not Working**
- Ensure variables are prefixed with `VITE_`
- Check platform-specific environment setup
- Verify variables in build logs (without exposing secrets)

**3. Routing Issues in Production**
- Ensure proper redirect configuration
- Check that `index.html` fallback is set up
- Verify base href in `index.html`

**4. Large Bundle Size**
```bash
# Analyze bundle
npm run build:prod -- --stats-json
npx webpack-bundle-analyzer dist/powerfulwebsites-space/stats.json

# Check for duplicate dependencies
npm ls --depth=0
```

**5. Missing Environment Files**
```bash
# Create missing environment files
cp src/environments/environment.ts src/environments/environment.prod.ts
# Edit with production values
```

### Debug Build Issues

**Enable verbose logging:**
```bash
npm run build:prod -- --verbose
```

**Check file sizes:**
```bash
ls -la dist/powerfulwebsites-space/
```

**Test locally:**
```bash
# Serve built files locally
npx http-server dist/powerfulwebsites-space -p 8080
```

## 📊 Monitoring & Analytics

### Essential Metrics to Track

1. **Core Web Vitals**
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)

2. **Performance Metrics**
   - Page load times
   - Bundle sizes
   - API response times

3. **User Experience**
   - User interactions
   - Feature usage
   - Error rates

### Recommended Tools

- **Google Analytics 4**: User behavior and traffic
- **Google Search Console**: SEO performance
- **Vercel Analytics**: Real user monitoring
- **Lighthouse CI**: Automated performance testing

## 🆘 Support

If you encounter deployment issues:

1. **Check the deployment logs** on your platform
2. **Review this guide** for platform-specific configurations
3. **Test locally** with production build
4. **Open an issue** on GitHub with deployment details

---

**Happy Deploying! 🚀**
