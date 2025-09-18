#!/bin/bash

# ATM System Serverless Deployment Script
echo "🚀 Starting ATM System Serverless Deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel login

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your ATM system is now live!"
echo "📋 Don't forget to:"
echo "   1. Set up your cloud database"
echo "   2. Configure environment variables in Vercel dashboard"
echo "   3. Update your frontend API calls to use the production URL"