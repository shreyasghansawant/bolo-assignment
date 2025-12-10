# BoloForms Signature Injection Engine

A full-stack MERN application for injecting signatures into PDFs at precise coordinates, handling the conversion between browser CSS pixels (top-left origin) and PDF points (bottom-left origin).

## 🏗️ Project Structure

```
BoloAssignment/
├── bolo-sign-frontend/    # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── vercel.json        # Vercel deployment config
│
└── bolo-sign-engine/      # Node.js + Express backend
    ├── src/
    ├── storage/           # Temporary PDF storage (ephemeral)
    ├── package.json
    └── render.yaml        # Render deployment config
```

## 🚀 Deployment Guide

### Prerequisites
- GitHub account
- MongoDB Atlas account (free tier available)
- Vercel account (for frontend)
- Render account (for backend)

---

## Step 1: Prepare Your Code for GitHub

### 1.1 Initialize Git Repository

Open terminal in the project root (`BoloAssignment` folder) and run:

```bash
git init
```

### 1.2 About node_modules

**IMPORTANT:** `node_modules` folders are already in `.gitignore` files. You should **NEVER** push `node_modules` to GitHub because:
- They're huge (hundreds of MB)
- They're platform-specific
- They can be regenerated with `npm install`
- Hosting platforms install dependencies automatically

**What gets pushed:**
- ✅ Source code (`src/` folders)
- ✅ Configuration files (`package.json`, `vite.config.js`, etc.)
- ✅ `.gitignore` files
- ✅ `package-lock.json` (for consistent dependency versions)

**What doesn't get pushed:**
- ❌ `node_modules/` (excluded by `.gitignore`)
- ❌ `.env` files (excluded by `.gitignore`)
- ❌ `storage/` folder (excluded by `.gitignore`)
- ❌ `dist/` folder (excluded by `.gitignore`)

### 1.3 Verify .gitignore Files

The project already has `.gitignore` files:
- `bolo-sign-frontend/.gitignore`
- `bolo-sign-engine/.gitignore`
- Root `.gitignore` (created)

These files ensure `node_modules` and other unnecessary files are excluded.

---

## Step 2: Push to GitHub

### 2.1 Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click **"New repository"**
3. Name it: `bolo-sign-engine` (or any name you prefer)
4. Choose **Public** (required for free hosting)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

### 2.2 Add Files and Push

In your terminal (in `BoloAssignment` folder):

```bash
# Add all files (gitignore will exclude node_modules automatically)
git add .

# Check what will be committed (verify node_modules is NOT listed)
git status

# Commit your code
git commit -m "Initial commit: BoloForms Signature Engine"

# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Verify:** After pushing, check GitHub. You should see:
- ✅ All source code files
- ✅ `package.json` files
- ✅ Configuration files
- ❌ NO `node_modules` folders
- ❌ NO `.env` files

---

## Step 3: Set Up MongoDB Atlas

### 3.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a **Free** cluster (M0)

### 3.2 Get Connection String
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `bolosign` (or any name)

**Save this connection string** - you'll need it for backend deployment.

---

## Step 4: Deploy Backend to Render

### 4.1 Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub (recommended)

### 4.2 Deploy Backend Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your repository
4. Configure:
   - **Name:** `bolo-sign-engine`
   - **Root Directory:** `bolo-sign-engine` (important!)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### 4.3 Set Environment Variables
In Render dashboard, go to **"Environment"** tab and add:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `FRONTEND_URL` | (Leave empty for now, update after frontend deploy) |
| `BASE_URL` | (Auto-set by Render, but you can set it manually) |
| `NODE_ENV` | `production` |
| `PORT` | (Auto-set by Render) |

**Note:** After deploying frontend, come back and update `FRONTEND_URL` with your frontend URL.

### 4.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL (e.g., `https://bolo-sign-engine.onrender.com`)

**Test:** Visit `https://your-backend.onrender.com/health` - should return `{"ok":true}`

---

## Step 5: Deploy Frontend to Vercel

### 5.1 Create Vercel Account
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)

### 5.2 Deploy Frontend
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Configure:
   - **Root Directory:** `bolo-sign-frontend` (click "Edit" and set this)
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

### 5.3 Set Environment Variables
In Vercel dashboard, go to **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | Your Render backend URL (e.g., `https://bolo-sign-engine.onrender.com`) |

**Important:** 
- Vercel environment variables starting with `VITE_` are exposed to the frontend
- After adding, **redeploy** the project for changes to take effect

### 5.4 Deploy
1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Copy your frontend URL (e.g., `https://bolo-sign-frontend.vercel.app`)

---

## Step 6: Update Backend CORS

### 6.1 Update FRONTEND_URL in Render
1. Go back to Render dashboard
2. Navigate to your backend service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL` with your Vercel frontend URL:
   ```
   https://bolo-sign-frontend.vercel.app
   ```
5. Click **"Save Changes"**
6. Render will automatically redeploy

---

## Step 7: Test Your Deployment

1. **Frontend:** Visit your Vercel URL
2. **Backend Health:** Visit `https://your-backend.onrender.com/health`
3. **Test Flow:**
   - Upload a PDF
   - Add signature field
   - Sign the document
   - Download the signed PDF

---

## 🔧 Alternative: Deploy Frontend to Netlify

If you prefer Netlify over Vercel:

### Netlify Deployment Steps:
1. Go to [Netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Select your GitHub repository
5. Configure:
   - **Base directory:** `bolo-sign-frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `bolo-sign-frontend/dist`
6. Add environment variable:
   - `VITE_API_URL` = Your Render backend URL
7. Click **"Deploy site"**

---

## 🔧 Alternative: Deploy Backend to Railway

If you prefer Railway over Render:

### Railway Deployment Steps:
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway auto-detects Node.js
6. Set **Root Directory** to `bolo-sign-engine`
7. Add environment variables:
   - `MONGO_URI`
   - `FRONTEND_URL`
   - `NODE_ENV` = `production`
8. Railway auto-deploys

---

## 📝 Environment Variables Summary

### Backend (Render/Railway)
```
MONGO_URI=mongodb+srv://...
FRONTEND_URL=https://your-frontend.vercel.app
BASE_URL=https://your-backend.onrender.com (optional)
NODE_ENV=production
PORT=10000 (auto-set)
```

### Frontend (Vercel/Netlify)
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🐛 Troubleshooting

### Backend Issues
- **404 on /health:** Check if service is running in Render dashboard
- **CORS errors:** Verify `FRONTEND_URL` is set correctly
- **MongoDB connection failed:** Check `MONGO_URI` format and network access in Atlas

### Frontend Issues
- **API calls failing:** Verify `VITE_API_URL` is set and redeployed
- **Build fails:** Check Vercel build logs for errors
- **Blank page:** Check browser console for errors

### File Download Issues
- **Download works immediately:** ✅ Expected behavior
- **Download fails after restart:** ⚠️ Expected (ephemeral storage)
- **Solution:** Download immediately after signing

---

## 📦 Local Development

### Backend
```bash
cd bolo-sign-engine
npm install
# Create .env file with variables from .env.example
npm start
```

### Frontend
```bash
cd bolo-sign-frontend
npm install
# Create .env file with VITE_API_URL=http://localhost:4000
npm run dev
```

---

## 📚 Tech Stack

- **Frontend:** React, Vite, react-pdf
- **Backend:** Node.js, Express, pdf-lib, MongoDB
- **Hosting:** Vercel (Frontend), Render (Backend)
- **Database:** MongoDB Atlas

---

## 📄 License

ISC

