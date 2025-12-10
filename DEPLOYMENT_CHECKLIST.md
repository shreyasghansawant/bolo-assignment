# 🚀 Deployment Checklist

## Pre-Deployment Setup

### ✅ Step 1: Prepare Code
- [ ] Verify `.gitignore` files exclude `node_modules/`
- [ ] Verify `.gitignore` files exclude `.env` files
- [ ] Verify `.gitignore` files exclude `storage/` folder
- [ ] Check that `package.json` files have correct scripts

### ✅ Step 2: GitHub Setup
- [ ] Create GitHub account (if needed)
- [ ] Create new repository on GitHub
- [ ] Initialize git: `git init`
- [ ] Add files: `git add .`
- [ ] Verify `node_modules` is NOT in `git status` output
- [ ] Commit: `git commit -m "Initial commit"`
- [ ] Add remote: `git remote add origin https://github.com/USERNAME/REPO.git`
- [ ] Push: `git push -u origin main`
- [ ] Verify on GitHub: No `node_modules` folders visible

### ✅ Step 3: MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create free cluster (M0)
- [ ] Create database user
- [ ] Whitelist IP: `0.0.0.0/0` (allow all IPs)
- [ ] Get connection string
- [ ] Test connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

---

## Backend Deployment (Render)

### ✅ Step 4: Render Setup
- [ ] Create Render account (sign up with GitHub)
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Select repository
- [ ] Configure:
  - [ ] Name: `bolo-sign-engine`
  - [ ] Root Directory: `bolo-sign-engine` ⚠️ IMPORTANT
  - [ ] Environment: `Node`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
  - [ ] Plan: Free

### ✅ Step 5: Backend Environment Variables
Add these in Render dashboard → Environment tab:
- [ ] `MONGO_URI` = Your MongoDB Atlas connection string
- [ ] `FRONTEND_URL` = (Leave empty, update after frontend deploy)
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = (Auto-set by Render, don't change)

### ✅ Step 6: Deploy Backend
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Copy backend URL: `https://your-backend.onrender.com`
- [ ] Test: Visit `https://your-backend.onrender.com/health`
- [ ] Should see: `{"ok":true,"timestamp":"..."}`

---

## Frontend Deployment (Vercel)

### ✅ Step 7: Vercel Setup
- [ ] Create Vercel account (sign up with GitHub)
- [ ] Click "Add New..." → "Project"
- [ ] Import GitHub repository
- [ ] Configure:
  - [ ] Root Directory: `bolo-sign-frontend` ⚠️ IMPORTANT
  - [ ] Framework Preset: Vite (auto-detected)
  - [ ] Build Command: `npm run build` (auto-detected)
  - [ ] Output Directory: `dist` (auto-detected)

### ✅ Step 8: Frontend Environment Variables
Add in Vercel dashboard → Environment Variables:
- [ ] `VITE_API_URL` = Your Render backend URL (e.g., `https://bolo-sign-engine.onrender.com`)

### ✅ Step 9: Deploy Frontend
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Copy frontend URL: `https://your-frontend.vercel.app`
- [ ] Test: Visit frontend URL

---

## Final Configuration

### ✅ Step 10: Update Backend CORS
- [ ] Go back to Render dashboard
- [ ] Navigate to backend service
- [ ] Go to "Environment" tab
- [ ] Update `FRONTEND_URL` = Your Vercel frontend URL
- [ ] Click "Save Changes"
- [ ] Wait for redeploy

### ✅ Step 11: Final Testing
- [ ] Visit frontend URL
- [ ] Upload a PDF file
- [ ] Add a signature field
- [ ] Drag and position the field
- [ ] Sign the document
- [ ] Download the signed PDF immediately ✅
- [ ] Verify download works

---

## 🎯 Quick Reference

### Backend URL Format
```
https://your-service-name.onrender.com
```

### Frontend URL Format
```
https://your-project-name.vercel.app
```

### Environment Variables Needed

**Backend (Render):**
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

**Frontend (Vercel):**
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🐛 Common Issues

### Issue: Build fails on Render
**Solution:** Check Root Directory is set to `bolo-sign-engine`

### Issue: Build fails on Vercel
**Solution:** Check Root Directory is set to `bolo-sign-frontend`

### Issue: CORS errors
**Solution:** Verify `FRONTEND_URL` in backend matches your frontend URL exactly

### Issue: API calls fail
**Solution:** 
1. Verify `VITE_API_URL` is set in Vercel
2. Redeploy frontend after adding environment variable
3. Check browser console for errors

### Issue: MongoDB connection fails
**Solution:**
1. Verify connection string format
2. Check IP whitelist in MongoDB Atlas (should include `0.0.0.0/0`)
3. Verify database user credentials

---

## ✅ Success Criteria

Your deployment is successful when:
- ✅ Backend health endpoint returns `{"ok":true}`
- ✅ Frontend loads without errors
- ✅ You can upload a PDF
- ✅ You can add and position signature fields
- ✅ You can sign the document
- ✅ You can download the signed PDF immediately

---

## 📝 Notes

- **node_modules:** Never push to GitHub - hosting platforms install automatically
- **File Storage:** Files are ephemeral (lost on restart) - download immediately
- **Environment Variables:** Must be set in hosting platform dashboards
- **Root Directories:** Critical to set correctly for monorepo structure

