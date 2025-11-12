# Deploying Supabase Edge Function via GitHub Actions

This workflow automatically deploys the `submit-answer` edge function to Supabase when you push changes to the `main` or `master` branch.

## Setup Instructions

### 1. Get Your Supabase Access Token

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click on your profile icon (top right)
3. Go to **Account Settings** → **Access Tokens**
4. Click **Generate New Token**
5. Give it a name (e.g., "GitHub Actions Deployment")
6. Copy the token (you won't see it again!)

### 2. Get Your Supabase Project ID

1. In your Supabase Dashboard, go to your project
2. Go to **Settings** → **General**
3. Find **Reference ID** (this is your project ID)
   - It looks like: `jglhhlximslbdnwjaclm`

### 3. Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

   **Secret 1:**
   - Name: `SUPABASE_ACCESS_TOKEN`
   - Value: (paste the access token from step 1)

   **Secret 2:**
   - Name: `SUPABASE_PROJECT_ID`
   - Value: (paste your project reference ID from step 2)

### 4. Push Your Code

Once secrets are set up, push your code:

```bash
git add .
git commit -m "Add GitHub Actions workflow for edge function deployment"
git push origin main
```

The workflow will automatically:
- ✅ Deploy the edge function when you push changes to `supabase/functions/submit-answer/`
- ✅ Allow manual triggers from the Actions tab

### 5. Manual Deployment

You can also trigger the deployment manually:

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Deploy Supabase Edge Function** workflow
4. Click **Run workflow** → **Run workflow**

## Troubleshooting

### Workflow Fails with "Authentication failed"
- Check that `SUPABASE_ACCESS_TOKEN` is correct and not expired
- Regenerate the token if needed

### Workflow Fails with "Project not found"
- Verify `SUPABASE_PROJECT_ID` matches your project's Reference ID
- Check that the token has access to the project

### Function Not Updating
- Check the Actions tab for deployment logs
- Verify the function files were actually changed
- Check Supabase dashboard → Edge Functions → Logs

