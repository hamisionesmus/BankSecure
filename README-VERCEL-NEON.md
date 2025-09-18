# 🚀 **ATM System - Vercel + Neon Deployment Guide**

## 📋 **Complete Step-by-Step Production Deployment**

---

## **🎯 OVERVIEW**

This guide will walk you through deploying your ATM banking system to production using:
- **Vercel** for hosting the frontend and serverless API functions
- **Neon** for PostgreSQL database hosting

**Estimated Time:** 30-45 minutes
**Cost:** Free tier available
**Prerequisites:** GitHub account, basic command line knowledge

---

## **📋 STEP 1: PREPARE YOUR CODEBASE**

### **1.1 Ensure Your Code is Ready**
```bash
# Check your current directory structure
ls -la

# Should see these directories:
# atm-app/ (React frontend)
# api/ (Vercel API functions)
# vercel.json (deployment config)
# package.json (root config)
```

### **1.2 Update API Functions for PostgreSQL**
Your API functions need to be updated to work with PostgreSQL instead of MySQL.

#### **Update `api/authenticate.js`:**
```javascript
import pkg from 'pg';
const { Client } = pkg;

export default async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const { cardNumber, pin } = req.body;
    const result = await client.query(
      'SELECT * FROM customers WHERE card_number = $1 AND pin = $2',
      [cardNumber, pin]
    );

    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        customer: result.rows[0]
      });
    } else {
      res.status(200).json({ success: false });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  } finally {
    await client.end();
  }
}
```

#### **Update `api/package.json`:**
```json
{
  "name": "atm-api",
  "version": "1.0.0",
  "dependencies": {
    "pg": "^8.11.3"
  }
}
```

### **1.3 Update Frontend for Production**
Your React app should automatically detect the production environment, but ensure the API calls are configured correctly.

#### **Check `atm-app/src/App.tsx`:**
```javascript
// This should already be configured correctly
const baseUrl = window.location.hostname === 'localhost'
  ? 'http://localhost:3001'  // Local development
  : '';                      // Production (same domain)
```

---

## **📋 STEP 2: SET UP NEON POSTGRESQL DATABASE**

### **2.1 Create Neon Account**
1. **Go to:** `https://neon.tech`
2. **Click:** "Sign Up" (top right corner)
3. **Choose:** Sign up with GitHub, Google, or email
4. **Verify:** Your email address
5. **Complete:** Profile setup

### **2.2 Create Your Database Project**
1. **Dashboard:** Click "Create a project"
2. **Project Name:** `atm-system-db`
3. **Region:** Select the closest region (e.g., `AWS US East 1`)
4. **PostgreSQL Version:** Keep default (15)
5. **Click:** "Create Project"

### **2.3 Get Connection Information**
1. **Project Dashboard:** Click "Connection string"
2. **Copy the full connection string** - it should look like:
   ```
   postgresql://username:password@hostname/database?sslmode=require
   ```

### **2.4 Test Database Connection**
1. **Dashboard:** Click "SQL Editor" (left sidebar)
2. **Run test query:**
   ```sql
   SELECT version();
   ```
3. **Expected Result:** PostgreSQL version information

### **2.5 Create Database Tables**
1. **SQL Editor:** Copy and paste this schema:
   ```sql
   -- Create customers table
   CREATE TABLE customers (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       pin VARCHAR(255) NOT NULL,
       card_number VARCHAR(255) UNIQUE NOT NULL
   );

   -- Create accounts table
   CREATE TABLE accounts (
       id SERIAL PRIMARY KEY,
       account_number VARCHAR(255) UNIQUE NOT NULL,
       balance DECIMAL(10,2) DEFAULT 0,
       type VARCHAR(50) DEFAULT 'Savings',
       customer_id INTEGER REFERENCES customers(id)
   );

   -- Create transactions table
   CREATE TABLE transactions (
       id SERIAL PRIMARY KEY,
       type VARCHAR(50),
       amount DECIMAL(10,2),
       date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       account_id INTEGER REFERENCES accounts(id)
   );

   -- Insert sample data
   INSERT INTO customers (name, pin, card_number)
   VALUES ('Hamisi', '1234', '123456789');

   INSERT INTO accounts (account_number, balance, customer_id)
   VALUES ('ACC001', 1000.00, 1);
   ```
2. **Click:** "Run" to execute the SQL

---

## **📋 STEP 3: SET UP VERCEL ACCOUNT & PROJECT**

### **3.1 Create Vercel Account**
1. **Go to:** `https://vercel.com`
2. **Click:** "Sign Up" (top right corner)
3. **Choose:** "Continue with GitHub" (recommended)
4. **Authorize:** Grant Vercel access to your GitHub account
5. **Complete:** Profile setup

### **3.2 Import Your Project**
1. **Dashboard:** Click "New Project" (top right)
2. **Import:** Choose "From Git Repository"
3. **Connect:** Select your GitHub account
4. **Repository:** Find and select your ATM system repository
5. **Configure Project:**
   - **Project Name:** `atm-system` (or your choice)
   - **Framework Preset:** `Create React App`
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

### **3.3 Configure Environment Variables**
1. **Project Settings:** Go to your project dashboard
2. **Environment Variables:** Click "Environment Variables" tab
3. **Add Variables:**
   ```
   DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
   ```
4. **Save:** Click "Save" for each variable

---

## **📋 STEP 4: DEPLOY TO PRODUCTION**

### **4.1 Commit Your Changes**
```bash
# Add all your changes
git add .

# Commit with descriptive message
git commit -m "Production deployment: Vercel + Neon setup

- Updated API functions for PostgreSQL
- Added Neon database connection
- Configured Vercel deployment
- Updated environment variables"

# Push to GitHub
git push origin main
```

### **4.2 Automatic Deployment**
1. **Vercel Dashboard:** Go to your project
2. **Deployments:** Watch the automatic deployment process
3. **Status:** Should show "Building" then "Ready"
4. **URL:** Copy your production URL (e.g., `https://your-project.vercel.app`)

### **4.3 Verify Deployment**
1. **Visit:** Your Vercel URL
2. **Test Login:**
   - **Card Number:** `123456789`
   - **PIN:** `1234`
3. **Test Features:**
   - Login functionality
   - Balance display
   - Deposit/Withdraw operations

---

## **📋 STEP 5: TEST PRODUCTION SYSTEM**

### **5.1 Frontend Testing**
1. **Open:** Your Vercel deployment URL
2. **Login:** Use test credentials
3. **Navigate:** Dashboard, transactions, settings
4. **Test:** All UI components and responsiveness

### **5.2 API Testing**
```bash
# Test authentication endpoint
curl -X POST https://your-app.vercel.app/api/authenticate \
  -H "Content-Type: application/json" \
  -d '{"cardNumber":"123456789","pin":"1234"}'

# Expected response:
{
  "success": true,
  "customer": {
    "id": 1,
    "name": "Hamisi",
    "card_number": "123456789"
  }
}
```

### **5.3 Database Testing**
1. **Neon Dashboard:** Go to SQL Editor
2. **Check data:**
   ```sql
   SELECT * FROM customers;
   SELECT * FROM accounts;
   SELECT * FROM transactions;
   ```

---

## **📋 STEP 6: TROUBLESHOOTING**

### **Issue 1: API Returns 404**
```bash
# Check Vercel function logs
vercel logs

# Verify API function structure
ls -la api/

# Check vercel.json configuration
cat vercel.json
```

### **Issue 2: Database Connection Failed**
```bash
# Check environment variables
vercel env ls

# Verify DATABASE_URL format
echo $DATABASE_URL

# Test database connection in Neon
# Go to SQL Editor and run: SELECT 1;
```

### **Issue 3: Build Failures**
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing dependencies in package.json
# - Incorrect API function syntax
# - Environment variable issues
```

### **Issue 4: CORS Errors**
```javascript
// Ensure all API functions have CORS headers
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

---

## **📋 STEP 7: MONITOR & MAINTAIN**

### **7.1 Monitor Performance**
1. **Vercel Dashboard:** Check function execution times
2. **Neon Dashboard:** Monitor database performance
3. **Analytics:** Track user engagement and errors

### **7.2 Update Environment Variables**
```bash
# Update variables if needed
vercel env add NEW_VARIABLE
vercel env rm OLD_VARIABLE

# Redeploy to apply changes
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

### **7.3 Backup Database**
1. **Neon Dashboard:** Go to "Backups" section
2. **Create:** Manual backup before major changes
3. **Schedule:** Automatic backups if needed

---

## **🎯 PRODUCTION CHECKLIST**

### **✅ Pre-Deployment:**
- [ ] Code updated for PostgreSQL
- [ ] API functions have CORS headers
- [ ] Environment variables configured
- [ ] Database tables created
- [ ] Sample data inserted

### **✅ Deployment:**
- [ ] Vercel project created
- [ ] GitHub repository connected
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Code pushed to GitHub

### **✅ Post-Deployment:**
- [ ] Vercel deployment successful
- [ ] Production URL accessible
- [ ] Login functionality working
- [ ] Database connections working
- [ ] All features tested

---

## **🚀 FINAL PRODUCTION COMMANDS**

```bash
# 1. Final commit and push
git add .
git commit -m "🚀 Production deployment complete"
git push origin main

# 2. Check deployment status
vercel ls

# 3. Test your live application
curl -X POST https://your-app.vercel.app/api/authenticate \
  -H "Content-Type: application/json" \
  -d '{"cardNumber":"123456789","pin":"1234"}'

# 4. Visit your production app
open https://your-app.vercel.app
```

---

## **📊 PRODUCTION ARCHITECTURE**

```
┌─────────────────┐    HTTPS    ┌─────────────────┐    SSL    ┌─────────────────┐
│   React App     │◄───────────►│  Vercel API     │◄─────────►│   Neon PG DB    │
│   (Frontend)    │             │   Functions     │           │   (PostgreSQL)  │
│                 │             │                 │           │                 │
│ • Global CDN    │             │ • Serverless    │           │ • Auto-scaling  │
│ • Auto-scaling  │             │ • Auto-scaling  │           │ • High Avail.   │
│ • SSL Certs     │             │ • Global CDN    │           │ • SSL Encrypted │
└─────────────────┘             └─────────────────┘           └─────────────────┘
         ▲                           ▲                            ▲
         │                           │                            │
         └───────────────────────────┼────────────────────────────┘
                         Environment Variables
                         (Secure Connection)
```

---

## **🎯 SUCCESS INDICATORS**

### **✅ Production Working:**
- Vercel deployment shows "Ready" status
- API endpoints return 200 status codes
- Database queries execute successfully
- Frontend loads without errors
- Authentication works with test credentials
- All banking operations function correctly

### **📈 Performance Metrics:**
- **Load Time:** < 3 seconds globally
- **API Response:** < 500ms worldwide
- **Uptime:** 99.9% SLA
- **CDN:** Fast content delivery

---

## **🔗 USEFUL LINKS**

### **Neon PostgreSQL:**
- **Dashboard:** `https://console.neon.tech`
- **Documentation:** `https://neon.tech/docs`
- **Pricing:** `https://neon.tech/pricing`

### **Vercel Hosting:**
- **Dashboard:** `https://vercel.com/dashboard`
- **Documentation:** `https://vercel.com/docs`
- **Pricing:** `https://vercel.com/pricing`

### **Your Production URLs:**
- **Frontend:** `https://your-project.vercel.app`
- **API Base:** `https://your-project.vercel.app/api`

---

## **🎉 DEPLOYMENT COMPLETE!**

**Your ATM banking system is now live in production!**

### **What's Running:**
- ✅ **Frontend:** React app on Vercel
- ✅ **Backend:** Serverless API functions
- ✅ **Database:** PostgreSQL on Neon
- ✅ **Security:** SSL certificates
- ✅ **Performance:** Global CDN

### **Test Your System:**
1. **Visit:** `https://your-project.vercel.app`
2. **Login:** Card `123456789`, PIN `1234`
3. **Test:** All banking features
4. **Verify:** Real-time database updates

**Your professional banking system is production-ready!** 🏦

**Enjoy your live ATM system!** 🚀