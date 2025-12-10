# 📤 GitHub Push Guide

## Quick Steps to Push Your Code

### Step 1: Open Terminal
Open PowerShell or Command Prompt in your project root folder:
```
C:\Users\Shreyas Ghansawant\Desktop\BoloAssignment
```

### Step 2: Initialize Git (if not already done)
```bash
git init
```

### Step 3: Check What Will Be Committed
```bash
git status
```

**✅ You should see:**
- Source code files (`src/`, `package.json`, etc.)
- Configuration files

**❌ You should NOT see:**
- `node_modules/` folders
- `.env` files
- `storage/` folder (with PDFs)

If you see `node_modules` listed, check your `.gitignore` files.

### Step 4: Add All Files
```bash
git add .
```

This will add all files **except** those in `.gitignore` (like `node_modules`).

### Step 5: Verify What's Being Committed
```bash
git status
```

Again, verify `node_modules` is NOT listed.

### Step 6: Create Your First Commit
```bash
git commit -m "Initial commit: BoloForms Signature Engine"
```

### Step 7: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click **"New repository"** (green button)
3. Repository name: `bolo-sign-engine` (or any name)
4. Description: (optional)
5. Choose **Public** (required for free hosting)
6. **DO NOT** check "Add a README file"
7. **DO NOT** check "Add .gitignore"
8. **DO NOT** check "Choose a license"
9. Click **"Create repository"**

### Step 8: Connect Local Repository to GitHub
After creating the repository, GitHub will show you commands. Use these:

**Replace `YOUR_USERNAME` and `REPO_NAME` with your actual values:**

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/johndoe/bolo-sign-engine.git
git branch -M main
git push -u origin main
```

### Step 9: Enter GitHub Credentials
When you run `git push`, you'll be prompted for:
- **Username:** Your GitHub username
- **Password:** Use a **Personal Access Token** (not your GitHub password)

**To create a Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name it: "Git Push Token"
4. Select scopes: Check `repo` (full control)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)
7. Use this token as your password when pushing

### Step 10: Verify on GitHub
1. Go to your GitHub repository
2. You should see all your files
3. **Verify:** No `node_modules` folders visible
4. **Verify:** No `.env` files visible
5. **Verify:** Source code is there

---

## 🔄 Updating Code Later

After making changes, push updates:

```bash
# Check what changed
git status

# Add changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

---

## ❓ Troubleshooting

### Problem: "node_modules is too large"
**Solution:** Check `.gitignore` files include `node_modules/`

### Problem: "Authentication failed"
**Solution:** Use Personal Access Token instead of password

### Problem: "Repository not found"
**Solution:** Check repository name and username are correct

### Problem: "Everything is ignored"
**Solution:** Check `.gitignore` files aren't too restrictive

---

## 📋 What Gets Pushed vs What Doesn't

### ✅ Gets Pushed (Tracked)
- All source code (`src/` folders)
- `package.json` files
- `package-lock.json` files
- Configuration files (`vite.config.js`, `render.yaml`, etc.)
- `.gitignore` files
- `README.md` and other docs

### ❌ Doesn't Get Pushed (Ignored)
- `node_modules/` folders (excluded by `.gitignore`)
- `.env` files (excluded by `.gitignore`)
- `storage/` folder (excluded by `.gitignore`)
- `dist/` folder (excluded by `.gitignore`)
- `.DS_Store` files (excluded by `.gitignore`)
- Log files (`*.log`)

---

## 🎯 Summary

**The key point:** `node_modules` is automatically excluded by `.gitignore`, so you don't need to worry about it. Just run:

```bash
git add .
git commit -m "Your message"
git push
```

And Git will automatically skip `node_modules` and other ignored files!

