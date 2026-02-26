# Vercel Deployment Setup

## Quick Setup (One Command)

Run this script to set up everything:
```bash
./setup-vercel.sh
```

## Manual Steps Required

### 1. Get Your Vercel Credentials

You need to get these from your Vercel dashboard:

1. Go to [vercel.com](https://vercel.com)
2. Sign in to your account
3. Go to Settings → Tokens and create a new token
4. Copy the token value

### 2. Set Up GitHub Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 3. Add Secrets to GitHub

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `VERCEL_TOKEN`: Your Vercel token from step 1
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

To find your org and project IDs:
1. Go to your Vercel dashboard
2. Open your project
3. Check the URL: `https://vercel.com/[org-id]/[project-id]`

### 4. Deploy

Run the deployment script:
```bash
./deploy.sh
```

## Automatic Deployments

Once set up, every push to main/master will automatically deploy to Vercel!

## Manual Deployment

To deploy manually:
```bash
./deploy.sh
```

## Troubleshooting

- If you get permission errors, make sure the scripts are executable: `chmod +x *.sh`
- If deployment fails, check the GitHub Actions logs
- Make sure all secrets are correctly set in GitHub
