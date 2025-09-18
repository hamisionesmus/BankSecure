#!/bin/bash

# FREE HOSTING DEPLOYMENT SCRIPT
# Supabase + Vercel = 100% FREE

#!/bin/bash

echo "🚀 FREE ATM System Deployment (Supabase + Vercel)"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "api" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   cd c:/xampp/htdocs/AAssignement"
    exit 1
fi

echo "📁 Project directory: $(pwd)"
echo ""

# Check if Vercel CLI is installed
echo "📦 Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed!"
else
    echo "✅ Vercel CLI already installed"
fi

echo ""

# Check if user has Vercel account
echo "🔐 Checking Vercel account..."
if ! vercel whoami &> /dev/null; then
    echo "❌ You need to login to Vercel first!"
    echo ""
    echo "📋 Please run these commands:"
    echo "   vercel login"
    echo "   # Follow the browser prompts to authenticate"
    echo ""
    echo "💡 Then run this script again:"
    echo "   npm run deploy-free"
    exit 1
fi

echo "✅ Vercel account authenticated!"
echo ""

# Show current project status
echo "📊 Project Status:"
echo "   ✅ React Frontend: $([ -d "atm-app" ] && echo "Found" || echo "Missing")"
echo "   ✅ API Routes: $([ -d "api" ] && echo "Found" || echo "Missing")"
echo "   ✅ Vercel Config: $([ -f "vercel.json" ] && echo "Found" || echo "Missing")"
echo ""

# Deploy to Vercel
echo "📤 Starting Vercel Deployment..."
echo "   This will create your FREE hosting!"
echo "   Project will be available at: https://your-app.vercel.app"
echo ""

# Run deployment with specific settings
echo "🔧 Deployment Configuration:"
echo "   - Project Name: atm-system-free"
echo "   - Directory: $(pwd)"
echo "   - Build Command: npm run build (for React app)"
echo ""

vercel --prod --yes

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "📋 IMMEDIATE NEXT STEPS:"
echo "========================"
echo ""
echo "1. 🌐 COPY YOUR LIVE URL:"
echo "   The URL shown above is your live website!"
echo "   Example: https://atm-system-free-abc123.vercel.app"
echo ""
echo "2. 🗄️  SET UP FREE DATABASE (REQUIRED):"
echo "   ==================================="
echo "   • Go to: https://neon.tech"
echo "   • Click: 'Sign up'"
echo "   • Choose: 'Continue with GitHub' or 'Continue with Google' or 'Continue with email'"
echo "   • Click: 'Create a project'"
echo "   • Name: 'atm-system' (exactly)"
echo "   • PostgreSQL Version: Keep default"
echo "   • Region: Choose closest to you"
echo "   • Click: 'Create project'"
echo "   • Wait: 30 seconds for creation"
echo "   • Click: 'Dashboard' tab"
echo "   • Scroll to: 'Connection Details'"
echo "   • Copy: Connection string and parameters"
echo "   • Click: 'SQL Editor' in left sidebar"
echo "   • Click: 'New Query'"
echo "   • Copy: ALL content from 'setup-free-database-postgres.sql'"
echo "   • Paste: Into the SQL editor"
echo "   • Click: 'Run' button"
echo ""
echo "3. ⚙️  CONFIGURE ENVIRONMENT VARIABLES:"
echo "   ================================="
echo "   • Go to: https://vercel.com/dashboard"
echo "   • Click: Your project (atm-system-free)"
echo "   • Click: 'Settings' tab"
echo "   • Click: 'Environment Variables'"
echo "   • Click: 'Add New' for each:"
echo ""
echo "   DB_HOST = your-project.neon.tech"
echo "   DB_USER = your-neon-username"
echo "   DB_PASSWORD = your-neon-password"
echo "   DB_NAME = neon"
echo ""
echo "4. 🔄 REDEPLOY WITH DATABASE:"
echo "   ========================="
echo "   vercel --prod"
echo ""
echo "5. 🧪 TEST YOUR LIVE SYSTEM:"
echo "   ========================"
echo "   • Visit: Your Vercel URL"
echo "   • Login with:"
echo "     - Card Number: 123456789"
echo "     - PIN: 1234"
echo "   • Try: Withdraw $50"
echo "   • Check: Transaction History"
echo ""
echo "💡 FREE SERVICE LIMITS:"
echo "   ==================="
echo "   • Vercel: 100GB bandwidth, 3000 function seconds/month"
echo "   • Neon: 512MB PostgreSQL, 100 hours compute time/month"
echo "   • Both services are completely FREE for your usage!"
echo ""
echo "🎯 TROUBLESHOOTING:"
echo "   ================"
echo "   • If login fails: Check environment variables"
echo "   • If transactions don't work: Verify database connection"
echo "   • If page doesn't load: Check Vercel function logs"
echo ""
echo "🚀 YOUR ATM SYSTEM IS NOW LIVE AND 100% FREE!"
echo "=============================================="
echo ""
echo "Need help? Check the README-FREE-HOSTING.md file! 📖"