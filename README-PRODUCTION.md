# 🚀 **ATM Banking System - Production Deployment Guide**

## **Architecture Overview**

This ATM system is designed for **production deployment** using three services:

- **🖥️ Vercel** - Frontend (React) + API Functions (Serverless)
- **🔧 Render** - Backend API (Node.js/Express) [Optional - can use Vercel only]
- **🗄️ Neon** - PostgreSQL Database (Cloud)

## **📋 Prerequisites**

- GitHub account
- Vercel account (free)
- Render account (free tier available)
- Neon account (free PostgreSQL)

---

# **1. 🗄️ Database Setup (Neon)**

### **Step 1: Create Neon Project**
1. Go to [neon.tech](https://neon.tech) and sign up/login
2. Click **"Create a project"**
3. Name: `atm-banking-system`
4. PostgreSQL Version: **15** or **16**
5. Region: Choose closest to your users
6. Click **"Create project"**

### **Step 2: Set Up Database Schema**
1. In Neon dashboard, click **"SQL Editor"**
2. Copy entire contents of `setup-free-database-postgres.sql`
3. Paste into SQL Editor
4. Click **"Run"**

### **Step 3: Get Connection Details**
1. Go to **"Dashboard"** tab
2. Scroll to **"Connection Details"**
3. Copy the **Connection String** (it looks like):
   ```
   postgresql://username:password@hostname/database?sslmode=require
   ```

### **Step 4: Test Database**
Run this query in SQL Editor:
```sql
SELECT 'Database setup complete!' as status;
SELECT COUNT(*) as customers FROM customers;
SELECT COUNT(*) as technicians FROM technicians;
SELECT COUNT(*) as banks FROM banks;
```

---

# **2. 🔧 Backend Setup (Render)**

### **Step 1: Prepare Backend for Render**
1. The `atm-backend/` folder contains the Express server
2. Update `atm-backend/.env` with your Neon database URL:
   ```env
   DB_HOST=your-neon-hostname
   DB_USER=your-neon-username
   DB_PASSWORD=your-neon-password
   DB_NAME=neondb
   PORT=10000
   ```

### **Step 2: Deploy to Render**
1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. **Service Settings:**
   - **Name:** `atm-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`

### **Step 3: Environment Variables**
In Render dashboard, add these environment variables:
```
DB_HOST=your-neon-hostname
DB_USER=your-neon-username
DB_PASSWORD=your-neon-password
DB_NAME=neondb
PORT=10000
```

### **Step 4: Deploy**
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Copy the **service URL** (e.g., `https://atm-backend.onrender.com`)

---

# **3. 🖥️ Frontend + API Setup (Vercel)**

### **Step 1: Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"New Project"**
3. Import your GitHub repository
4. **Configure Project:**
   - **Framework Preset:** `Create React App`
   - **Root Directory:** `atm-app`
   - **Build Settings:** Leave defaults

### **Step 2: Environment Variables**
In Vercel dashboard → Project Settings → Environment Variables:

**Required Variables:**
```
REACT_APP_API_BASE_URL=https://your-render-backend-url
SUPABASE_KEY=your-supabase-anon-key
```

**If using Neon directly (alternative to Render):**
```
DB_HOST=your-neon-hostname
DB_USER=your-neon-username
DB_PASSWORD=your-neon-password
DB_NAME=neondb
```

### **Step 3: Deploy**
1. Click **"Deploy"**
2. Wait for build completion
3. Copy the **deployment URL** (e.g., `https://atm-system.vercel.app`)

---

# **4. 🔗 Service Connections**

### **Update Frontend API Calls**
The React app automatically uses `REACT_APP_API_BASE_URL` for all API calls.

**Current API endpoints working:**
- `POST /api/authenticate` - Customer login
- `GET /api/accounts/:customerId` - Get accounts
- `POST /api/deposit` - Deposit money
- `POST /api/withdraw` - Withdraw money
- `POST /api/transfer` - Transfer money
- `GET /api/transactions/:accountId` - Transaction history
- `POST /api/technician-auth` - Technician login
- `POST /api/maintenance/replenish` - Replenish ATM
- `POST /api/maintenance/diagnose` - Diagnose ATM
- `POST /api/maintenance/upgrade` - Upgrade ATM
- `POST /api/bank/authorize` - Authorize transactions
- `POST /api/bank/link-account` - Link accounts

---

# **5. 🧪 Testing Production System**

### **Customer Testing**
1. Visit your Vercel URL
2. **Login Credentials:**
   - Card Number: `123456789`
   - PIN: `1234`
3. Test operations:
   - Check balance
   - Deposit $100
   - Withdraw $50
   - Transfer $25 to another account
   - View transaction history

### **Technician Testing**
1. Use technician login (if implemented in frontend)
2. **Technician Credentials:**
   - Technician ID: `TECH001`
   - PIN: `tech123`
3. Test maintenance operations:
   - Diagnose ATM
   - Replenish supplies
   - Upgrade system

---

# **6. 🔧 Troubleshooting**

### **Database Connection Issues**
```bash
# Test database connection
psql "your-neon-connection-string" -c "SELECT * FROM customers;"
```

### **API Not Working**
1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints directly:
   ```bash
   curl -X POST https://your-vercel-url/api/authenticate \
     -H "Content-Type: application/json" \
     -d '{"cardNumber":"123456789","pin":"1234"}'
   ```

### **Frontend Not Loading**
1. Check browser console for errors
2. Verify `REACT_APP_API_BASE_URL` is set correctly
3. Check Vercel build logs

---

# **7. 📊 Monitoring & Maintenance**

### **Vercel Monitoring**
- View function execution logs
- Monitor response times
- Check error rates

### **Render Monitoring**
- View application logs
- Monitor CPU/memory usage
- Check response times

### **Neon Monitoring**
- Query performance insights
- Database size monitoring
- Connection monitoring

---

# **8. 🚀 Scaling Considerations**

### **Free Tiers:**
- **Vercel:** 100GB bandwidth, 3000 function seconds/month
- **Render:** 750 hours/month, 512MB RAM
- **Neon:** 512MB storage, 100 compute hours/month

### **Upgrade Paths:**
- Increase Render instance size for more traffic
- Add Redis caching for better performance
- Implement rate limiting for API protection

---

# **9. 🔒 Security Checklist**

- ✅ Environment variables configured
- ✅ Database connections secure (SSL)
- ✅ CORS properly configured
- ✅ Input validation in place
- ✅ No sensitive data in client-side code

---

# **10. 📞 Support**

**Issues? Check:**
1. Vercel function logs
2. Render application logs
3. Neon SQL query logs
4. Browser developer console

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Neon Docs: https://neon.tech/docs

---

**🎉 Your ATM Banking System is now live and production-ready!**

**Access your application at:** `https://your-vercel-deployment-url`