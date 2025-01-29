# GitHub Repository Setup Instructions

## 1. Create a GitHub Account (if you don't have one)
- Go to https://github.com
- Click "Sign up"
- Follow the registration process

## 2. Create a New Repository
1. Log in to GitHub
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - Repository name: `cost-manager-frontend`
   - Description: `Cost manager application with React and IndexedDB`
   - Make it Public
   - Don't initialize with README (we already have one)
   - Click "Create repository"

## 3. Initialize Git in Your Project
Open Command Prompt and run these commands:

```bash
cd C:\Users\yuval\Desktop\cost-manager-frontend

# Initialize git repository
git init

# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit"

# Add GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/cost-manager-frontend.git

# Push code to GitHub
git push -u origin main
```

Note: Replace `YOUR_USERNAME` with your actual GitHub username.

## 4. If You Get Authentication Errors

If you're prompted for authentication, you'll need to:

1. Go to GitHub.com
2. Click your profile picture → Settings
3. Scroll down to "Developer settings" (bottom left)
4. Click "Personal access tokens" → "Tokens (classic)"
5. Generate new token
6. Give it a name and select "repo" permissions
7. Copy the token
8. Use this token as your password when pushing to GitHub

## 5. Verify Upload
1. Go to https://github.com/YOUR_USERNAME/cost-manager-frontend
2. You should see all your project files there

## Need Help?
If you get any errors during these steps, let me know and I can help troubleshoot them.
