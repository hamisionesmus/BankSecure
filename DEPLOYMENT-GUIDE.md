# 🚀 ATM Banking System - Production Deployment Guide

This guide provides step-by-step instructions to deploy the ATM Banking System using **Render** (backend) and **Vercel** (frontend).

## 📋 Prerequisites

- GitHub account
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- Neon PostgreSQL database (https://neon.tech) - Free tier available

## 🗄️ Step 1: Set Up Database (Neon PostgreSQL)

### 1.1 Create Neon Account
1. Go to https://neon.tech
2. Sign up with GitHub/Google/Email
3. Click "Create a project"
4. Name: `atm-production-db`
5. PostgreSQL Version: Keep default (15)
6. Region: Choose closest to your users
7. Click "Create project"

### 1.2 Set Up Database Schema
1. In Neon dashboard, click "SQL Editor" in left sidebar
2. Click "New Query"
3. Copy the entire content from `setup-free-database-postgres.sql`
4. Paste into the SQL editor
5. Click "Run"
6. Verify tables were created by running:
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```

### 1.3 Get Connection Details
1. Click "Dashboard" tab
2. Scroll to "Connection Details"
3. Copy the "Connection string" - it should look like:
   ```
   postgresql://username:password@ep-example.region.aws.neon.tech/dbname?sslmode=require
   ```
4. Save this connection string - you'll need it later

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Prepare Backend Repository
1. Push your code to GitHub (if not already done)
2. Ensure your repository contains:
   - `atm-backend/` directory with `server.js`, `package.json`, etc.
   - `atm-backend/.env.example` (created)
   - `setup-free-database-postgres.sql`

### 2.2 Create Render Service
1. Go to https://dashboard.render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure service:
   - **Name:** `atm-backend` (or your preferred name)
   - **Environment:** `Node`
   - **Build Command:** `cd atm-backend && npm install`
   - **Start Command:** `cd atm-backend && npm start`

### 2.3 Set Environment Variables
In Render dashboard, go to your service → "Environment":
```
DATABASE_URL=postgresql://username:password@ep-example.region.aws.neon.tech/dbname?sslmode=require
NODE_ENV=production
PORT=10000
```

### 2.4 Deploy Backend
1. Click "Create Web Service"
2. Wait for deployment (usually 2-5 minutes)
3. Once deployed, copy the service URL: `https://your-app-name.onrender.com`
4. Test the backend: `https://your-app-name.onrender.com/api/test`

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend
1. Ensure your repository has:
   - `atm-app/` directory with React app
   - `atm-app/.env.example` (created)
   - `vercel.json` (configured)

### 3.2 Create Vercel Project
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** `Create React App`
   - **Root Directory:** `atm-app` (important!)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

### 3.3 Set Environment Variables
In Vercel project settings → "Environment Variables":
```
REACT_APP_API_BASE_URL=https://your-render-app.onrender.com
```

### 3.4 Deploy Frontend
1. Click "Deploy"
2. Wait for deployment (usually 1-3 minutes)
3. Once deployed, you'll get a URL like: `https://your-app.vercel.app`

## 🔗 Step 4: Update CORS (if needed)

If you encounter CORS issues, update the backend `server.js`:

```javascript
const corsOptions = {
  origin: ['https://your-vercel-app.vercel.app', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

## 🧪 Step 5: Test Production Deployment

### 5.1 Test Login
1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Login with test credentials:
   - Card Number: `123456789`
   - PIN: `1234`

### 5.2 Test Transactions
1. Try depositing $100
2. Check balance updates
3. Try withdrawing $50
4. Verify transaction history

### 5.3 Test Database
1. Check Render logs for database connection
2. Verify data persists between sessions

## 🔧 Step 6: Troubleshooting

### Backend Issues
- **Database Connection Failed:** Check DATABASE_URL format and Neon credentials
- **Port Issues:** Render assigns PORT automatically, don't hardcode it
- **Build Failures:** Ensure all dependencies are in `atm-backend/package.json`

### Frontend Issues
- **API Calls Failing:** Verify REACT_APP_API_BASE_URL is set correctly
- **CORS Errors:** Update backend CORS settings
- **Build Errors:** Check if `vercel.json` points to correct directories

### Database Issues
- **Connection Timeout:** Neon free tier has connection limits
- **SSL Issues:** Ensure `sslmode=require` in connection string
- **Schema Errors:** Re-run the SQL setup script

## 📊 Step 7: Monitor and Maintain

### Render Monitoring
- View logs in Render dashboard
- Monitor response times and error rates
- Scale instance type if needed (paid plans)

### Vercel Monitoring
- Check function logs in Vercel dashboard
- Monitor bandwidth usage
- Set up analytics if needed

### Database Monitoring
- Monitor connection count in Neon dashboard
- Check query performance
- Set up automated backups

## 💰 Cost Estimation

### Free Tier Limits
- **Render:** 750 hours/month free, then $7/month
- **Vercel:** 100GB bandwidth, 3000 function seconds/month free
- **Neon:** 512MB storage, 100 compute hours/month free

### Scaling Costs
- Additional Render hours: ~$7/month
- Extra Vercel bandwidth: $0.15/GB
- Neon storage: $0.00015/GB/hour

## 🔒 Security Considerations

1. **Environment Variables:** Never commit real credentials to Git
2. **HTTPS:** Both Render and Vercel provide SSL certificates
3. **Database Security:** Use strong passwords, enable SSL
4. **API Security:** Consider adding rate limiting and authentication
5. **Input Validation:** Backend validates all inputs

## 🚀 Going Live

1. Update domain names (optional)
2. Set up custom domain on Vercel
3. Configure monitoring alerts
4. Test with real users
5. Monitor performance and scale as needed

## 📞 Support

- **Render Docs:** https://docs.render.com/
- **Vercel Docs:** https://vercel.com/docs
- **Neon Docs:** https://neon.tech/docs

---

**🎉 Your ATM Banking System is now live and production-ready!**

Test all features thoroughly before announcing to users.