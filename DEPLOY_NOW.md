# 🚀 Quick Deployment Commands

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `gamified-fitness-mentor` (or your choice)
3. Keep it **Public** or **Private** (your choice)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click **Create repository**
6. **Copy the repository URL** (it will look like: `https://github.com/YOUR_USERNAME/gamified-fitness-mentor.git`)

## Step 2: Push to GitHub

Run these commands in your terminal:

```bash
cd /Users/anmolmohan/.gemini/antigravity/scratch/gamified-fitness-mentor

# Replace YOUR_GITHUB_REPO_URL with the URL from Step 1
git remote add origin YOUR_GITHUB_REPO_URL

# Push to GitHub
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/yourusername/gamified-fitness-mentor.git
git push -u origin main
```

---

## Step 3: Deploy Backend to Render

1. Go to https://render.com/
2. Sign in / Create account
3. Click **New** → **Blueprint**
4. Click **Connect GitHub** (authorize if needed)
5. Select your repository: `gamified-fitness-mentor`
6. Render will detect `render.yaml` automatically
7. Set these environment variables:
   - `DID_API_KEY`: Get from https://studio.d-id.com/ → API Keys
   - `CORS_ORIGIN`: Leave **empty** for now
8. Click **Apply**
9. Wait for deployment (5-10 minutes)
10. **Copy your backend URL**: `https://gamified-fitness-mentor-api.onrender.com`

---

## Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com/
2. Sign in / Create account
3. Click **Add New** → **Project**
4. **Import** your GitHub repository
5. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
6. Add Environment Variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: Your Render URL from Step 3 (e.g., `https://gamified-fitness-mentor-api.onrender.com`)
7. Click **Deploy**
8. Wait for deployment (2-3 minutes)
9. **Copy your frontend URL**: `https://gamified-fitness-mentor.vercel.app`

---

## Step 5: Update CORS (Important!)

1. Go back to Render dashboard
2. Click on your backend service
3. Go to **Environment** tab
4. Update `CORS_ORIGIN`: 
   - Paste your Vercel URL from Step 4
   - Example: `https://gamified-fitness-mentor.vercel.app`
5. Click **Save Changes**
6. Backend will auto-redeploy (1-2 minutes)

---

## Step 6: Test Your App! 🎉

1. Open your Vercel URL in a browser
2. Fill out the profile and select a mentor
3. Click "Generate My Life"
4. Complete some actions
5. Watch the mentor video!

---

## ✅ Verification Checklist

- [ ] App loads on Vercel URL
- [ ] No console errors in browser
- [ ] Mentor video generates successfully
- [ ] Backend health check works: `https://YOUR_RENDER_URL/api/health`
- [ ] No API key visible in browser Network tab

---

## 🆘 Need Help?

Check `DEPLOYMENT.md` for detailed troubleshooting or let me know!
