# 🚀 Quick Deploy to Render (5 Minutes)

## Fast Track Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. Deploy to Render
1. Go to [render.com](https://render.com) and sign up/login
2. **Dashboard → New → Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `pnpm install --prefer-offline && rm -rf node_modules/.vite-temp && tsc -b && vite build`
   - **Plan:** Free
   - **Region:** Oregon (US West)

### 3. Add Environment Variables
In Render service settings:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Deploy
- Click "Create Web Service"
- Wait 3-5 minutes for build
- Get your live URL: `https://awarenesshub-app.onrender.com`

### 5. Test
- Login works
- Videos play
- Challenges function
- Database saves progress

**Done!** Your AwarenessHub is now live on Render! 🎉

For detailed troubleshooting, see `DEPLOY_TO_RENDER.md`
