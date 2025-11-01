# 🚀 Deploy AwarenessHub to Render - Complete Guide

## Overview
This guide will help you deploy your AwarenessHub cybersecurity learning platform to Render, a cloud hosting platform that supports static sites and web applications.

## Prerequisites
- Render account (free tier available)
- Your GitHub repository (we'll assume your awareness-hub project is pushed to GitHub)
- Supabase project credentials

## 📋 Step-by-Step Deployment Process

### Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Ensure your project has the required files:**
   - ✅ `render.yaml` (already created)
   - ✅ `package.json` with build scripts
   - ✅ `vite.config.ts` (Vite configuration)
   - ✅ `dist/` directory with built files

### Step 2: Create Render Account and Repository

1. **Sign up at [Render.com](https://render.com)**
   - Use GitHub, Google, or email to sign up
   - Free tier includes 750 hours of web service per month

2. **Connect your GitHub account:**
   - Go to Dashboard → Settings → Connected Accounts
   - Click "Connect" next to GitHub
   - Authorize Render to access your repositories

### Step 3: Deploy the Web Service

#### Option A: Automatic Deployment (Recommended)

1. **In Render Dashboard:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository containing awareness-hub
   - Select the repository with your React app

2. **Configure Service Settings:**
   - **Name:** `awarenesshub` (or your preferred name)
   - **Region:** Choose closest to your users (Oregon for US West Coast)
   - **Branch:** `main` (or your main branch)
   - **Root Directory:** Leave empty (if project is at root)
   - **Runtime:** Node.js

3. **Build and Deploy Settings:**
   - **Build Command:** `pnpm install --prefer-offline && rm -rf node_modules/.vite-temp && tsc -b && vite build`
   - **Start Command:** Leave empty (for static sites)
   - **Plan:** Free tier is sufficient for testing

4. **Click "Create Web Service"**
   - Render will automatically build and deploy your app
   - Build time: Usually 2-5 minutes
   - You'll get a random URL like `https://awarenesshub-app.onrender.com`

#### Option B: Manual Upload

1. **Build locally:**
   ```bash
   cd awareness-hub
   pnpm install
   pnpm run build
   ```

2. **Drag and Drop:**
   - In Render dashboard: "New +" → "Static Site"
   - Drag your entire `dist` folder to the deployment area
   - Service will be deployed automatically

### Step 4: Configure Environment Variables

In your Render service dashboard:

1. **Go to "Environment" tab**
2. **Add required Supabase variables:**

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Get Supabase credentials:**
   - Go to your Supabase dashboard
   - Project Settings → API
   - Copy the URL and anon/public key

4. **Rebuild service** after adding environment variables

### Step 5: Custom Domain (Optional)

1. **In Render dashboard:**
   - Go to your service → "Settings" → "Domains"
   - Click "Add Custom Domain"
   - Enter your domain (e.g., `awarenesshub.yourdomain.com`)
   - Follow DNS configuration instructions

2. **DNS Setup:**
   - Point your domain to Render's provided IP
   - Or add CNAME record pointing to your service

## 🔧 Environment Variables Reference

| Variable | Value | Purpose |
|----------|--------|---------|
| `NODE_VERSION` | `18.18.0` | Node.js runtime version |
| `PNPM_VERSION` | `9.7.1` | Package manager version |
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `your-key-here` | Supabase public API key |

## 📁 Project Structure

Your deployed application should have this structure:
```
/
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
├── USER_GUIDE.md
├── audio/
└── videos/
```

## 🎯 Post-Deployment Checklist

### ✅ Test Your Deployed App:

1. **Basic Functionality:**
   - [ ] Login page loads
   - [ ] User registration works
   - [ ] Dashboard navigation functional
   - [ ] Videos play properly
   - [ ] Interactive challenges work
   - [ ] MCQ questions submit successfully

2. **Database Connectivity:**
   - [ ] User progress saves correctly
   - [ ] Leaderboard updates
   - [ ] Authentication flow works
   - [ ] Supabase edge functions respond

3. **Performance:**
   - [ ] Page load times < 3 seconds
   - [ ] Videos buffer properly
   - [ ] Mobile responsiveness works
   - [ ] Dark mode renders correctly

## 🚨 Troubleshooting Common Issues

### Build Failures:

**Issue:** `Command failed: pnpm install`
```bash
# Solution: Update build command
pnpm install --prefer-offline --frozen-lockfile
```

**Issue:** `Module not found`
```bash
# Solution: Clear cache and rebuild
rm -rf node_modules .vite-temp
pnpm install
pnpm run build
```

### Runtime Errors:

**Issue:** `Supabase connection failed`
- ✅ Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- ✅ Check Supabase project is active
- ✅ Ensure CORS settings include your Render domain

**Issue:** Videos not loading
- ✅ Verify video URLs are correct
- ✅ Check if YouTube embeds are working
- ✅ Ensure videos directory is included in build

**Issue:** Authentication problems
- ✅ Supabase Auth settings include Render domain
- ✅ Environment variables are correctly set
- ✅ Database RLS policies allow access

### Performance Issues:

**Issue:** Slow loading times
- ✅ Enable gzip compression (Render does this automatically)
- ✅ Use image optimization
- ✅ Minimize bundle size
- ✅ Consider using a CDN

**Issue:** Mobile layout broken
- ✅ Test responsive design on different screen sizes
- ✅ Check CSS media queries
- ✅ Verify touch interactions work

## 🔄 Continuous Deployment

### Auto-Deploy on Code Changes:

1. **GitHub Integration:**
   - Render automatically detects GitHub pushes
   - Deploys new version within 2-3 minutes
   - Builds from your main branch by default

2. **Manual Deploy:**
   - Dashboard → "Manual Deploy" → "Deploy latest commit"

3. **Preview Deployments:**
   - Create pull requests to test changes
   - Render creates preview environments
   - Merge to main triggers production deploy

## 💰 Cost Optimization

### Free Tier Limits:
- 750 hours/month web service time
- 100GB bandwidth
- Unlimited deployments
- SSL certificates included

### When to Upgrade:
- Heavy traffic (>750 hours/month)
- Custom domains
- Advanced scaling needs
- Priority support

## 🔒 Security Considerations

### Environment Variables:
- ✅ Never commit sensitive data to Git
- ✅ Use Render's encrypted environment variables
- ✅ Rotate keys regularly
- ✅ Monitor API usage

### HTTPS:
- ✅ Render provides automatic SSL
- ✅ Redirect HTTP to HTTPS
- ✅ Update Supabase settings for HTTPS

### CORS Settings:
```javascript
// In Supabase dashboard, add your Render domain
https://awarenesshub-app.onrender.com
```

## 📊 Monitoring and Analytics

### Render Dashboard:
- Real-time logs and metrics
- Build and deploy history
- Resource usage tracking
- Custom domains management

### Application Analytics:
- Google Analytics integration (optional)
- User behavior tracking
- Performance monitoring
- Error reporting

## 🎉 Final Steps

1. **Test everything thoroughly**
2. **Share your deployed URL** with team/users
3. **Monitor performance** for first few days
4. **Set up monitoring** for downtime alerts
5. **Plan for scale** if traffic increases

## 📞 Support

If you encounter issues:
1. Check Render documentation: [docs.render.com](https://docs.render.com)
2. Render Community Discord for help
3. Review build logs in Render dashboard
4. Test locally first to isolate issues

---

## 🚀 Quick Deploy Summary

1. **Push to GitHub** → Your code is ready
2. **Create web service** → Connect repository
3. **Configure build** → Use provided commands
4. **Add environment variables** → Supabase credentials
5. **Deploy and test** → Your app is live!

**Your app will be available at:** `https://your-service-name.onrender.com`

---

*Deployment usually takes 3-5 minutes. After deployment, remember to test all major features and update any hardcoded URLs in your database.*
