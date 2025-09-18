@echo off

REM FREE HOSTING DEPLOYMENT SCRIPT FOR WINDOWS
REM Neon + Vercel = 100% FREE

echo 🚀 FREE ATM System Deployment (Neon + Vercel)
echo ==================================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the project root directory
    echo    cd c:\xampp\htdocs\AAssignement
    pause
    exit /b 1
)

if not exist "api" (
    echo ❌ Error: API directory not found
    echo    Please ensure you're in the correct project directory
    pause
    exit /b 1
)

echo 📁 Project directory: %cd%
echo.

REM Check if Vercel CLI is installed
echo 📦 Checking Vercel CLI...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📥 Installing Vercel CLI...
    npm install -g vercel
    echo ✅ Vercel CLI installed!
) else (
    echo ✅ Vercel CLI already installed
)

echo.

REM Check if user has Vercel account
echo 🔐 Checking Vercel account...
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ You need to login to Vercel first!
    echo.
    echo 📋 Please run these commands:
    echo    vercel login
    echo    # Follow the browser prompts to authenticate
    echo.
    echo 💡 Then run this script again:
    echo    deploy-free.bat
    pause
    exit /b 1
)

echo ✅ Vercel account authenticated!
echo.

REM Show current project status
echo 📊 Project Status:
if exist "atm-app" (
    echo    ✅ React Frontend: Found
) else (
    echo    ❌ React Frontend: Missing
)

if exist "api" (
    echo    ✅ API Routes: Found
) else (
    echo    ❌ API Routes: Missing
)

if exist "vercel.json" (
    echo    ✅ Vercel Config: Found
) else (
    echo    ❌ Vercel Config: Missing
)

echo.

REM Deploy to Vercel
echo 📤 Starting Vercel Deployment...
echo    This will create your FREE hosting!
echo    Project will be available at: https://your-app.vercel.app
echo.

REM Run deployment with specific settings
echo 🔧 Deployment Configuration:
echo    - Project Name: atm-system-free
echo    - Directory: %cd%
echo    - Build Command: npm run build (for React app)
echo.

vercel --prod --yes

echo.
echo 🎉 DEPLOYMENT COMPLETE!
echo ======================
echo.

echo 📋 IMMEDIATE NEXT STEPS:
echo ========================
echo.

echo 1. 🌐 COPY YOUR LIVE URL:
echo    The URL shown above is your live website!
echo    Example: https://atm-system-free-abc123.vercel.app
echo.

echo 2. 🗄️  SET UP FREE DATABASE (REQUIRED):
echo    ==================================
echo    • Go to: https://neon.tech
echo    • Click: 'Sign up'
echo    • Choose: 'Continue with GitHub' or 'Continue with Google' or 'Continue with email'
echo    • Click: 'Create a project'
echo    • Name: 'atm-system' (exactly)
echo    • PostgreSQL Version: Keep default
echo    • Region: Choose closest to you
echo    • Click: 'Create project'
echo    • Wait: 30 seconds for creation
echo    • Click: 'Dashboard' tab
echo    • Scroll to: 'Connection Details'
echo    • Copy: Connection string and parameters
echo    • Click: 'SQL Editor' in left sidebar
echo    • Click: 'New Query'
echo    • Copy: ALL content from 'setup-free-database-postgres.sql'
echo    • Paste: Into the SQL editor
echo    • Click: 'Run' button
echo.

echo 3. ⚙️  CONFIGURE ENVIRONMENT VARIABLES:
echo    ================================
echo    • Go to: https://vercel.com/dashboard
echo    • Click: Your project (atm-system-free)
echo    • Click: 'Settings' tab
echo    • Click: 'Environment Variables'
echo    • Click: 'Add New' for each:
echo.
echo    DATABASE_URL = postgresql://neondb_owner:npg_l1ncmz8sxdkq@ep-wild-moon-a1fa5rb5-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
echo.

echo 4. 🔄 REDEPLOY WITH DATABASE:
echo    ========================
echo    vercel --prod
echo.

echo 5. 🧪 TEST YOUR LIVE SYSTEM:
echo    =======================
echo    • Visit: Your Vercel URL
echo    • Login with:
echo       - Card Number: 123456789
echo       - PIN: 1234
echo    • Try: Withdraw $50
echo    • Check: Transaction History
echo.

echo 💡 FREE SERVICE LIMITS:
echo    ==================
echo    • Vercel: 100GB bandwidth, 3000 function seconds/month
echo    • Neon: 512MB PostgreSQL, 100 hours compute time/month
echo    • Both services are completely FREE for your usage!
echo.

echo 🎯 TROUBLESHOOTING:
echo    ===============
echo    • If login fails: Check environment variables
echo    • If transactions don't work: Verify database connection
echo    • If page doesn't load: Check Vercel function logs
echo.

echo 🚀 YOUR ATM SYSTEM IS NOW LIVE AND 100% FREE!
echo ==============================================
echo.

echo Need help? Check the README-FREE-HOSTING.md file! 📖

pause