# 🚀 Vercel CLI Deployment Guide - Real-time Leaderboard Update

## 📋 What You'll Need:
- Your Vercel CLI installed
- Your project cloned locally
- Access to your Vercel dashboard

## 🔧 Step-by-Step Deployment Process:

### 1. **Install Vercel CLI (if not installed)**
```bash
npm install -g vercel
# or
yarn global add vercel
```

### 2. **Update Your Local Code**
The changes I made to your leaderboard are in these files:
- `src/components/Leaderboard.tsx` - Updated to fetch real-time data from Supabase
- `src/pages/LandingPage.tsx` - Already configured to use the leaderboard

**If you have the updated files locally:**
```bash
# Copy the updated files from my workspace to your local project
# The main changes are in Leaderboard.tsx (removed mock data, added real Supabase queries)
```

**If you need the updated code:**
The key changes I made to `Leaderboard.tsx`:
- Removed all mock data
- Added real Supabase queries to fetch user profiles
- Added progress tracking from user_progress table
- Added "last active" timestamps

### 3. **Build and Test Locally**
```bash
# Navigate to your project directory
cd your-awareness-hub-project

# Install dependencies
pnpm install
# or
npm install

# Build the project
pnpm build
# or  
npm run build

# Test locally (optional)
pnpm preview
# or
npm run preview
```

### 4. **Deploy to Vercel**

**Option A: Deploy Current Directory**
```bash
# In your project root, run:
vercel --prod
```

**Option B: Deploy Specific Directory**
```bash
# If your project is in a subdirectory:
vercel --prod ./path-to-your-project
```

**Option C: Deploy with Environment Variables**
```bash
# If you need to set/verify environment variables:
vercel --prod --env
```

### 5. **Verify Deployment**
After deployment, Vercel will provide you with a URL. Check that:
- ✅ The landing page loads correctly
- ✅ The leaderboard shows real user data (not mock data)
- ✅ No console errors
- ✅ Responsive design works on mobile

## 🔧 Environment Variables Check

Make sure these environment variables are set in your Vercel dashboard:

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Required Variables:**
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **To Add/Update:**
   - Click "Add New"
   - Enter variable name and value
   - Select environments (Production, Preview, Development)
   - Save

## 🚨 If You Get Errors:

### Common Issues & Solutions:

**1. Build Fails with TypeScript Errors**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
pnpm install
pnpm build
```

**2. Environment Variables Not Working**
- Check variable names start with `VITE_`
- Redeploy after adding variables
- Verify values are correct in Vercel dashboard

**3. Supabase Connection Issues**
- Test locally first with your Supabase credentials
- Verify your Supabase project is active
- Check RLS policies allow public reads for leaderboard data

**4. 404 or Deployment Issues**
```bash
# Force new deployment
vercel --prod --force
```

## 📊 New Features Your Users Will See:

✅ **Real User Rankings** - Shows actual enrolled users
✅ **Live Points** - Real scores from your database  
✅ **Activity Status** - "Last active" timestamps
✅ **Challenge Progress** - Completed challenges count
✅ **No More Dummy Data** - Authentic social proof

## 🔄 Quick Deployment Commands:

```bash
# Complete workflow:
vercel login                    # Login to Vercel
vercel --prod                   # Deploy to production
vercel --prod --env            # Deploy with environment variables
```

## 📱 Testing Your Deployment:

1. **Visit your Vercel URL**
2. **Scroll to the leaderboard section** (should be in the main CTA area)
3. **Verify it shows real users** instead of mock data like "CyberWarrior_21"
4. **Check rankings** update based on actual user scores
5. **Test on mobile** to ensure responsive design

## 🎯 Expected Results:

After deployment, your landing page will show:
- Real usernames from your user_profiles table
- Actual point totals from your database
- Live activity status ("2 hours ago", "1 day ago")
- Challenge completion counts from user_progress table
- Authentic rankings based on real user performance

---

## 🆘 Need Help?

If you encounter any issues:
1. Check Vercel deployment logs in the dashboard
2. Verify your local build works before deploying
3. Ensure environment variables are correctly set
4. Test the Supabase connection locally first

Your updated webapp with real-time leaderboard will be live! 🚀