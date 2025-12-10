# ⚡ Quick Start Deployment Guide

## 🎯 TL;DR - What You Need to Know

### About node_modules
**✅ DO NOT push `node_modules` to GitHub**
- Already excluded by `.gitignore` files
- Hosting platforms install dependencies automatically
- Just run `git add .` - Git will skip `node_modules` automatically

### What Gets Pushed
- ✅ Source code
- ✅ `package.json` files
- ✅ Configuration files
- ❌ `node_modules` (automatically skipped)
- ❌ `.env` files (automatically skipped)
- ❌ `storage/` folder (automatically skipped)

---

## 🚀 5-Minute Deployment

### 1. Push to GitHub (2 minutes)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

### 2. Deploy Backend to Render (3 minutes)
1. Go to [render.com](https://render.com) → Sign up
2. New Web Service → Connect GitHub repo
3. Root Directory: `bolo-sign-engine`
4. Add env vars:
   - `MONGO_URI` = MongoDB connection string
   - `FRONTEND_URL` = (update after frontend deploy)
5. Deploy → Copy backend URL

### 3. Deploy Frontend to Vercel (2 minutes)
1. Go to [vercel.com](https://vercel.com) → Sign up
2. New Project → Import GitHub repo
3. Root Directory: `bolo-sign-frontend`
4. Add env var:
   - `VITE_API_URL` = Your Render backend URL
5. Deploy → Copy frontend URL

### 4. Update Backend CORS (1 minute)
1. Go back to Render
2. Update `FRONTEND_URL` = Your Vercel URL
3. Save → Auto-redeploys

**Done!** 🎉

---

## 📚 Detailed Guides

- **Full Deployment:** See `README.md`
- **Step-by-Step Checklist:** See `DEPLOYMENT_CHECKLIST.md`
- **GitHub Push Details:** See `GITHUB_PUSH_GUIDE.md`

---

## 🔑 Key Environment Variables

### Backend (Render)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## ✅ Verify Deployment

1. **Backend:** `https://your-backend.onrender.com/health` → Should return `{"ok":true}`
2. **Frontend:** Visit your Vercel URL → Should load the app
3. **Test:** Upload PDF → Add signature → Sign → Download

---

## 🐛 Quick Fixes

**Build fails?** → Check Root Directory is set correctly
**CORS errors?** → Update `FRONTEND_URL` in backend
**API fails?** → Verify `VITE_API_URL` is set and redeploy frontend

---

## 📝 Files Created

✅ `.gitignore` - Root level ignore rules
✅ `bolo-sign-frontend/vercel.json` - Vercel config
✅ `bolo-sign-frontend/netlify.toml` - Netlify config (alternative)
✅ `bolo-sign-engine/render.yaml` - Render config
✅ `README.md` - Full documentation
✅ `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
✅ `GITHUB_PUSH_GUIDE.md` - GitHub push instructions

All ready to go! 🚀

