# Deployment Guide - Gamified Fitness Mentor

##  Pre-Deployment Checklist

✅ Backend updated for production build (`npm run build`)  
✅ CORS configuration added with `CORS_ORIGIN` support  
✅ Frontend updated to use `VITE_API_BASE_URL`  
✅ `render.yaml` created at repository root  
✅ `vercel.json` created in frontend directory  
✅ Health endpoint at `/api/health`  

---

## Next Steps (Manual - Requires User Action)

### Step 1: Push Code to GitHub

```bash
cd /Users/anmolmohan/.gemini/antigravity/scratch/gamified-fitness-mentor
git init
git add .
git commit -m "Prepare for deployment: Add production configs"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### Step 2: Deploy Backend to Render

1. Go to https://render.com/
2. Click **New → Blueprint**
3. Connect your GitHub repository
4. Render will detect `render.yaml`
5. Set environment variables:
   - `DID_API_KEY`: Your D-ID API key (get from https://studio.d-id.com/)
   - `CORS_ORIGIN`: Leave blank for now (will update after Vercel deployment)
6. Click **Apply**
7. Wait for deployment to complete
8. **Note the URL**: `https://gamified-fitness-mentor-api.onrender.com` (or similar)

### Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com/
2. Click **Add New → Project**
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://gamified-fitness-mentor-api.onrender.com` (your Render URL from Step 2)
6. Click **Deploy**
7. Wait for deployment to complete
8. **Note the URL**: `https://your-app-name.vercel.app`

### Step 4: Update CORS Configuration

1. Return to Render dashboard
2. Go to your backend service
3. Navigate to **Environment**
4. Update `CORS_ORIGIN`:
   - **Value**: `https://your-app-name.vercel.app` (your Vercel URL from Step 3)
5. Click **Save Changes**
6. Backend will automatically redeploy

---

## Testing Your Deployment

1. Open your Vercel URL in a browser
2. Fill out the profile form and select a mentor
3. Click "Generate My Life"
4. Navigate through the chapters
5. Select an action and click "Complete X Action(s)"
6. Verify:
   - ✅ Video generates and plays
   - ✅ No console errors
   - ✅ Network tab shows requests to your Render backend
   - ✅ `DID_API_KEY` is NOT visible in browser requests

##  Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGIN` in Render matches your exact Vercel domain (including `https://`)
- Check browser console for the actual error message

### Video Not Loading
- Check Render logs for D-ID API errors
- Verify `DID_API_KEY` is set correctly in Render environment variables  
- Ensure backend health endpoint works: `https://your-backend.onrender.com/api/health`

### 404 Errors on Refresh
- Verify `vercel.json` exists in the frontend directory with SPA rewrites

---

## URLs to Share

Backend API: `https://gamified-fitness-mentor-api.onrender.com`  
Frontend App: `https://your-app-name.vercel.app`  

---

## Security Notes

✅ D-ID API key is stored only on Render (server-side)  
✅ API key is never exposed to the browser  
✅ CORS restricts API access to your Vercel domain only  
