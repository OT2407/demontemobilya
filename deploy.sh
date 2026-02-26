#!/bin/bash

echo "🚀 Building project..."
npm run build

echo "🔗 Logging into Vercel..."
npx vercel login

echo "📤 Deploying to Vercel..."
npx vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your site will be available at the URL shown above."
