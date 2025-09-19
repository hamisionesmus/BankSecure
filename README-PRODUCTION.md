# 🚀 Production Deployment Guide - Render + Vercel

This guide will walk you through deploying the ATM Banking System to production using **Render** (backend) and **Vercel** (frontend).

## 📋 Prerequisites

- GitHub account
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- Neon PostgreSQL database (https://neon.tech) - Free tier available

## 🗄️ Step 1: Set Up PostgreSQL Database (Neon)

1. **Create Neon Account**
   - Go to https://neon.tech
   - Sign up with GitHub/Google/Email
   - Click "Create a project"
   - Name: `atm-production`
   - Region: Choose closest to your users
   - Click "Create project"

2. **Get Database Credentials**
   - Go to Dashboard → Connection Details
   - Copy the "Connection string" (it looks like: `postgresql://user:pass@host/db?sslmode=require`)
   - Save this for later - you'll need it for Render

3. **Create Database Tables**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"
   - Copy the entire content from `atm-backend/schema-postgres.sql`
   - Paste into the editor
   - Click "Run"
   - Verify tables were created successfully

## 🔧 Step 2: Deploy Backend to Render

1. **Connect GitHub Repository**
   - Go to https://dashboard.render.com
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing this project

2. **Configure Web Service**
   - **Name:** `atm-backend` (or your preferred name)
   - **Environment:** `Node`
   - **Build Command:** `cd atm-backend && npm install`
   - **Start Command:** `cd atm-backend && npm start`
   - **Plan:** Free tier (750 hours/month)

3. **Set Environment Variables**
   - In Render dashboard, go to your service → Environment
   - Add these variables:

   ```
   DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
   NODE_ENV=production
   PORT=10000
   ```

   Replace `DATABASE_URL` with your Neon connection string.

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete (5-10 minutes)
   - Copy the service URL (e.g., `https://atm-backend.onrender.com`)
   - This will be your backend API URL

## 🎨 Step 3: Deploy Frontend to Vercel

1. **Connect Repository**
   - Go to https://vercel.com/dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - **Framework Preset:** `Create React App`
     - **Root Directory:** `./atm-app`
     - **Build Command:** `npm run build`
     - **Output Directory:** `build`

2. **Set Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add:

   ```
   REACT_APP_API_BASE_URL=https://your-render-service.onrender.com
   ```

   Replace with your Render backend URL from Step 2.

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend will be live at `https://your-project.vercel.app`

## 🔗 Step 4: Update CORS (Backend)

Since your frontend and backend are on different domains, update CORS in `atm-backend/server.js`:

```javascript
app.use(cors({
  origin: 'https://your-vercel-app.vercel.app', // Your Vercel frontend URL
  credentials: true
}));
```

## 🧪 Step 5: Test Your Production System

1. **Visit Frontend URL**
   - Go to your Vercel deployment URL

2. **Test Login**
   - Card Number: `123456789`
   - PIN: `1234`

3. **Test Transactions**
   - Try deposit/withdraw/transfer
   - Check transaction history
   - Verify balance updates

## 🔧 Troubleshooting

### Backend Issues
- **Database Connection Failed:** Check DATABASE_URL in Render environment variables
- **Port Issues:** Render assigns PORT automatically, code uses `process.env.PORT || 3001`
- **CORS Errors:** Update allowed origins in server.js

### Frontend Issues
- **API Calls Failing:** Verify REACT_APP_API_BASE_URL points to correct Render URL
- **Build Errors:** Check Vercel build logs
- **Environment Variables:** Ensure variables are set in Vercel dashboard

### Database Issues
- **Tables Not Created:** Run schema-postgres.sql manually in Neon SQL Editor
- **Connection Timeout:** Check Neon connection limits (free tier: 100 connections)

## 📊 Monitoring & Maintenance

### Render Backend
- View logs in Render dashboard
- Monitor response times and errors
- Scale up if needed (paid plans)

### Vercel Frontend
- Monitor build status and performance
- View analytics in Vercel dashboard
- Set up error tracking

### Database
- Monitor usage in Neon dashboard
- Set up automated backups
- Check connection pool usage

## 💰 Cost Optimization

- **Render:** Free tier (750 hours/month) - sufficient for development/testing
- **Vercel:** Free tier (100GB bandwidth) - good for production traffic
- **Neon:** Free tier (512MB, 100 compute hours) - upgrade if needed

## 🔄 Updates & Redeployment

1. **Backend Updates:**
   - Push changes to GitHub
   - Render auto-deploys from main branch

2. **Frontend Updates:**
   - Push changes to GitHub
   - Vercel auto-deploys from main branch

## 🚀 Going Live

Once everything is working:

1. Update domain settings if using custom domains
2. Set up monitoring alerts
3. Configure backup strategies
4. Test with real users
5. Monitor performance and scale as needed

## 📞 Support

- **Render Docs:** https://docs.render.com/
- **Vercel Docs:** https://vercel.com/docs
- **Neon Docs:** https://neon.tech/docs/

