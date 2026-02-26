#!/bin/bash

# Demonte Concept Vercel Setup Script
# This script automates the entire Vercel setup process

set -e

echo "🚀 Demonte Concept Vercel Setup"
echo "================================"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "vercel.json" ]; then
    echo "❌ Please run this script from the project root directory."
    exit 1
fi

echo "✅ Project structure verified"

# Install Vercel CLI locally (no sudo required)
echo "📦 Installing Vercel CLI locally..."
npm install vercel@latest --save-dev

# Create a deployment script
echo "📝 Creating deployment script..."
cat > deploy.sh << 'EOF'
#!/bin/bash

echo "🚀 Building project..."
npm run build

echo "🔗 Logging into Vercel..."
npx vercel login

echo "📤 Deploying to Vercel..."
npx vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your site will be available at the URL shown above."
EOF

chmod +x deploy.sh

# Create a GitHub Actions workflow for automatic deployments
echo "🤖 Creating GitHub Actions workflow..."
mkdir -p .github/workflows

cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to Vercel

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build project
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
EOF

echo "✅ GitHub Actions workflow created"

# Create a README with instructions
echo "📚 Creating setup instructions..."
cat > VERCEL_SETUP.md << 'EOF'
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
EOF

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📋 Next Steps:"
echo "1. Make the setup script executable: chmod +x setup-vercel.sh"
echo "2. Run the setup: ./setup-vercel.sh"
echo "3. Get your Vercel credentials from vercel.com"
echo "4. Add the required secrets to your GitHub repository"
echo "5. Run: ./deploy.sh"
echo ""
echo "🤖 After setup, every push to main/master will auto-deploy!"
echo ""
echo "📖 Detailed instructions: VERCEL_SETUP.md"