# GitHub Setup Instructions

## Quick Commands

After creating your GitHub repository, run these commands:

```bash
# Add the remote repository (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step-by-Step

1. **Create repository on GitHub:**
   - Go to https://github.com/new
   - Enter repository name (e.g., "NeedsConnectV2")
   - Choose public or private
   - DO NOT initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Copy the repository URL** from GitHub (it will look like: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git`)

3. **Run these commands in your terminal:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

4. **If you need to authenticate:**
   - GitHub may ask for your username and password
   - For password, use a Personal Access Token (not your GitHub password)
   - Create one at: https://github.com/settings/tokens
   - Select scope: `repo` (full control of private repositories)

## Future Updates

After making changes, use:
```bash
git add .
git commit -m "Your commit message"
git push
```

