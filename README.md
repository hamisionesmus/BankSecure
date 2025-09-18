# 🏦 **ATM Banking System** - Complete Full-Stack Application

## 📋 **Table of Contents**

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Installation & Setup](#-installation--setup)
- [🎮 Usage Guide](#-usage-guide)
- [🔗 API Documentation](#-api-documentation)
- [🗄️ Database Schema](#️-database-schema)
- [🚀 Deployment Guide](#-deployment-guide)
- [🧪 Testing](#-testing)
- [🔍 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 **Overview**

A modern, full-stack ATM banking system built with React, Node.js, and MySQL. Features a beautiful, responsive UI with secure authentication, real-time transactions, and comprehensive banking functionality.

### **Key Highlights:**
- ✅ **Professional UI/UX** with Material-UI and animations
- ✅ **Secure Authentication** with PIN-based login
- ✅ **Real-time Transactions** (Deposit, Withdraw, Transfer)
- ✅ **Transaction History** with detailed records
- ✅ **Responsive Design** for mobile and desktop
- ✅ **RESTful API** with proper error handling
- ✅ **Database Integration** with MySQL
- ✅ **Production Ready** with Vercel deployment

---

## ✨ **Features**

### **🔐 Authentication & Security**
- Secure PIN-based authentication
- Session management
- Input validation and sanitization
- CORS enabled for cross-origin requests

### **💳 Banking Operations**
- **Deposit:** Add funds to account
- **Withdraw:** Remove funds with balance validation
- **Transfer:** Send money between accounts
- **Balance Check:** Real-time balance updates
- **Transaction History:** Complete audit trail

### **📊 Dashboard & Analytics**
- Account overview with balance display
- Recent transactions summary
- Quick action buttons
- Spending analytics (charts and graphs)
- Account summary and statistics

### **🎨 User Experience**
- Modern glassmorphism design
- Smooth animations with Framer Motion
- Responsive layout for all devices
- Loading states and error handling
- SweetAlert notifications

### **🔧 Technical Features**
- RESTful API architecture
- Database connection pooling
- Environment-based configuration
- Error logging and monitoring
- Modular component structure

---

## 🏗️ **Architecture**

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐    SQL    ┌─────────────────┐
│   React App     │◄────────────────►│  Node.js API    │◄─────────►│   MySQL DB      │
│   (Frontend)    │                  │   (Backend)     │           │   (Database)    │
│                 │                  │                 │           │                 │
│ • Components    │                  │ • REST API      │           │ • customers     │
│ • State Mgmt    │                  │ • Auth Logic    │           │ • accounts      │
│ • UI/UX         │                  │ • Business Logic│           │ • transactions │
└─────────────────┘                  └─────────────────┘           └─────────────────┘
         │                                   │                            │
         │                                   │                            │
   Vercel Hosting                     Vercel Functions              Cloud Database
   (Production)                      (Serverless)                 (Development)
```

---

## 🛠️ **Tech Stack**

### **Frontend:**
- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Professional UI components
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client for API calls
- **Styled Components** - Custom styling
- **SweetAlert2** - User notifications

### **Backend:**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL2** - Database connectivity
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment configuration

### **Database:**
- **MySQL** - Relational database
- **Connection Pooling** - Efficient database connections
- **Prepared Statements** - SQL injection prevention

### **Deployment:**
- **Vercel** - Frontend hosting and serverless functions
- **Neon** - PostgreSQL cloud database (production)
- **Git** - Version control

### **Development Tools:**
- **npm** - Package management
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

---

## 🚀 **Quick Start**

### **Prerequisites:**
- Node.js (v16 or higher)
- MySQL Server
- Git
- npm or yarn

### **One-Command Setup:**
```bash
# Clone repository
git clone <your-repo-url>
cd atm-system

# Install dependencies
npm install

# Start MySQL server (if using local)
# Configure database connection in .env

# Start development servers
npm run dev
```

### **Access Application:**
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:3001`
- **Test Credentials:**
  - Card Number: `123456789`
  - PIN: `1234`

---

## 📁 **Project Structure**

```
📁 atm-system/
├── 📁 atm-app/                    # React Frontend
│   ├── 📁 public/                 # Static assets
│   ├── 📁 src/                    # Source code
│   │   ├── 📄 App.tsx            # Main application
│   │   ├── 📄 index.tsx          # Entry point
│   │   └── 📄 ...                # Components & styles
│   ├── 📄 package.json           # Dependencies
│   └── 📄 tsconfig.json          # TypeScript config
│
├── 📁 atm-backend/                # Node.js Backend
│   ├── 📄 server.js              # Main server file
│   ├── 📄 schema.sql             # Database schema
│   ├── 📄 .env                   # Environment variables
│   └── 📄 package.json           # Dependencies
│
├── 📁 api/                        # Vercel API Functions
│   ├── 📄 authenticate.js        # Authentication endpoint
│   ├── 📄 withdraw.js            # Withdrawal endpoint
│   ├── 📄 deposit.js             # Deposit endpoint
│   ├── 📄 transfer.js            # Transfer endpoint
│   ├── 📁 accounts/              # Account-related APIs
│   ├── 📁 transactions/          # Transaction APIs
│   └── 📁 balance/               # Balance APIs
│
├── 📄 vercel.json                # Vercel deployment config
├── 📄 package.json               # Root package config
├── 📄 README.md                  # This file
└── 📄 ...                        # Configuration files
```

---

## 🔧 **Installation & Setup**

### **Step 1: Clone Repository**
```bash
git clone <your-repository-url>
cd atm-system
```

### **Step 2: Install Dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd atm-app
npm install
cd ..

# Install backend dependencies
cd atm-backend
npm install
cd ..
```

### **Step 3: Database Setup**

#### **Option A: Local MySQL**
```bash
# Start MySQL server
# Create database
mysql -u root -p
CREATE DATABASE atm_db;
exit;

# Import schema
mysql -u root -p atm_db < atm-backend/schema.sql
```

#### **Option B: Docker MySQL**
```bash
# Run MySQL in Docker
docker run --name mysql-atm \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=atm_db \
  -p 3306:3306 -d mysql:8.0

# Import schema
docker exec -i mysql-atm mysql -uroot -ppassword atm_db < atm-backend/schema.sql
```

### **Step 4: Environment Configuration**

#### **Backend (.env):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=atm_db
PORT=3001
```

#### **Frontend:**
No additional configuration needed - automatically detects environment.

### **Step 5: Start Development Servers**
```bash
# Terminal 1: Start Backend
cd atm-backend
node server.js

# Terminal 2: Start Frontend
cd atm-app
npm start
```

---

## 🎮 **Usage Guide**

### **1. Access Application**
- Open browser: `http://localhost:3000`
- You'll see the login screen

### **2. Login Process**
```
Card Number: 123456789
PIN: 1234
```
- Click "Login" button
- System validates credentials
- Redirects to dashboard on success

### **3. Dashboard Overview**
- **Balance Display:** Current account balance
- **Quick Actions:** Deposit, Withdraw, Transfer buttons
- **Recent Transactions:** Last 3 transactions
- **Account Summary:** Account details and status

### **4. Banking Operations**

#### **Deposit:**
1. Click "Deposit" button
2. Enter amount
3. Confirm transaction
4. Balance updates automatically

#### **Withdraw:**
1. Click "Withdraw" button
2. Enter amount (must be ≤ balance)
3. Confirm transaction
4. Balance updates automatically

#### **Transfer:**
1. Click "Transfer" button
2. Enter recipient account number
3. Enter amount
4. Confirm transaction
5. Balance updates automatically

### **5. Transaction History**
- Click "History" tab or button
- View all transactions with details
- Filter and search capabilities
- Export options available

### **6. Settings & Profile**
- Update profile information
- Change security settings
- Manage notification preferences
- View account details

---

## 🔗 **API Documentation**

### **Base URL:**
- **Development:** `http://localhost:3001/api`
- **Production:** `https://your-app.vercel.app/api`

### **Authentication Endpoints**

#### **POST /api/authenticate**
Authenticate user credentials.

**Request:**
```json
{
  "cardNumber": "123456789",
  "pin": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "customer": {
    "id": 1,
    "name": "Hamisi",
    "card_number": "123456789"
  }
}
```

### **Account Endpoints**

#### **GET /api/accounts/:customerId**
Get user accounts.

**Response:**
```json
[
  {
    "id": 1,
    "account_number": "ACC001",
    "balance": 1000.00,
    "type": "Savings",
    "customer_id": 1
  }
]
```

#### **GET /api/balance/:accountId**
Get account balance.

**Response:**
```json
{
  "balance": 1000.00
}
```

### **Transaction Endpoints**

#### **POST /api/deposit**
Deposit funds.

**Request:**
```json
{
  "accountId": 1,
  "amount": 500.00
}
```

**Response:**
```json
{
  "success": true,
  "message": "Deposit successful"
}
```

#### **POST /api/withdraw**
Withdraw funds.

**Request:**
```json
{
  "accountId": 1,
  "amount": 200.00
}
```

**Response:**
```json
{
  "success": true,
  "message": "Withdrawal successful"
}
```

#### **POST /api/transfer**
Transfer funds.

**Request:**
```json
{
  "fromAccountId": 1,
  "toAccountNumber": "ACC002",
  "amount": 100.00
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transfer successful"
}
```

#### **GET /api/transactions/:accountId**
Get transaction history.

**Response:**
```json
[
  {
    "id": 1,
    "type": "deposit",
    "amount": 500.00,
    "date": "2025-09-18T10:00:00.000Z",
    "account_id": 1
  }
]
```

### **Error Responses**

#### **400 Bad Request**
```json
{
  "success": false,
  "message": "Invalid input data"
}
```

#### **401 Unauthorized**
```json
{
  "success": false,
  "message": "Authentication failed"
}
```

#### **500 Internal Server Error**
```json
{
  "success": false,
  "message": "Server error occurred"
}
```

---

## 🗄️ **Database Schema**

### **Tables Overview**

```sql
-- Customers table
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pin VARCHAR(255) NOT NULL,
    card_number VARCHAR(255) UNIQUE NOT NULL
);

-- Accounts table
CREATE TABLE accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(255) UNIQUE NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    type VARCHAR(50) DEFAULT 'Savings',
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Transactions table
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50),
    amount DECIMAL(10,2),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    account_id INT,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- ATMs table
CREATE TABLE atms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255),
    cash_available DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'operational'
);

-- Technicians table
CREATE TABLE technicians (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Maintenance table
CREATE TABLE maintenance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    technician_id INT,
    atm_id INT,
    FOREIGN KEY (technician_id) REFERENCES technicians(id),
    FOREIGN KEY (atm_id) REFERENCES atms(id)
);
```

### **Sample Data**
```sql
-- Insert sample customer
INSERT INTO customers (name, pin, card_number)
VALUES ('Hamisi', '1234', '123456789');

-- Insert sample account
INSERT INTO accounts (account_number, balance, customer_id)
VALUES ('ACC001', 1000.00, 1);

-- Insert sample ATM
INSERT INTO atms (location, cash_available)
VALUES ('Main Street', 10000.00);
```

---

## 🚀 **Deployment Guide**

### **Option 1: Vercel + Neon (Recommended)**

#### **Step 1: Set Up Neon Database**
1. Create account at `https://neon.tech`
2. Create new project
3. Get connection string

#### **Step 2: Set Up Vercel**
1. Create account at `https://vercel.com`
2. Import your GitHub repository
3. Configure environment variables

#### **Step 3: Environment Variables**
```env
# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Or individual variables
DB_HOST=your-host
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=your-database
```

#### **Step 4: Deploy**
```bash
git add .
git commit -m "Production deployment"
git push origin main
```

### **Option 2: Local Production**

#### **Using PM2:**
```bash
# Install PM2
npm install -g pm2

# Start backend
cd atm-backend
pm2 start server.js --name "atm-backend"

# Start frontend (build for production)
cd atm-app
npm run build
pm2 serve build 3000 --name "atm-frontend"
```

#### **Using Docker:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: atm_db
    ports:
      - "3306:3306"

  backend:
    build: ./atm-backend
    ports:
      - "3001:3001"
    depends_on:
      - mysql

  frontend:
    build: ./atm-app
    ports:
      - "3000:3000"
```

---

## 🧪 **Testing**

### **Unit Tests**
```bash
# Frontend tests
cd atm-app
npm test

# Backend tests (if implemented)
cd atm-backend
npm test
```

### **API Testing**
```bash
# Test authentication
curl -X POST http://localhost:3001/api/authenticate \
  -H "Content-Type: application/json" \
  -d '{"cardNumber":"123456789","pin":"1234"}'

# Test deposit
curl -X POST http://localhost:3001/api/deposit \
  -H "Content-Type: application/json" \
  -d '{"accountId":1,"amount":100}'

# Test withdrawal
curl -X POST http://localhost:3001/api/withdraw \
  -H "Content-Type: application/json" \
  -d '{"accountId":1,"amount":50}'
```

### **End-to-End Testing**
1. Login with test credentials
2. Perform deposit transaction
3. Check balance update
4. Perform withdrawal
5. Check transaction history
6. Test transfer functionality

### **Performance Testing**
```bash
# Load testing with Artillery
npm install -g artillery
artillery quick --count 10 --num 5 http://localhost:3001/api/test
```

---

## 🔍 **Troubleshooting**

### **Common Issues**

#### **1. Database Connection Failed**
```bash
# Check MySQL service
sudo service mysql status

# Test connection
mysql -u root -p -e "SHOW DATABASES;"

# Check environment variables
cat atm-backend/.env
```

#### **2. Port Already in Use**
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3002
```

#### **3. CORS Errors**
```javascript
// Add to API functions
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

#### **4. Build Failures**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear React cache
cd atm-app
rm -rf node_modules .cache
npm install
```

#### **5. Database Schema Issues**
```bash
# Drop and recreate database
mysql -u root -p
DROP DATABASE atm_db;
CREATE DATABASE atm_db;
exit;

# Re-import schema
mysql -u root -p atm_db < atm-backend/schema.sql
```

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=* npm start

# Check application logs
tail -f logs/app.log

# Check database logs
tail -f /var/log/mysql/error.log
```

---

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Commit changes: `git commit -m "Add new feature"`
5. Push to branch: `git push origin feature/new-feature`
6. Create Pull Request

### **Code Standards**
- Use TypeScript for type safety
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation

### **Branch Naming**
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical fixes

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### **MIT License Summary:**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ⚠️ No liability
- ⚠️ No warranty

---

## 🎯 **Support & Resources**

### **Documentation**
- [React Documentation](https://reactjs.org/)
- [Node.js Documentation](https://nodejs.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Material-UI Documentation](https://mui.com/)

### **Tools & Services**
- [Vercel](https://vercel.com/) - Hosting & deployment
- [Neon](https://neon.tech/) - PostgreSQL database
- [GitHub](https://github.com/) - Version control
- [Postman](https://postman.com/) - API testing

### **Community**
- [Stack Overflow](https://stackoverflow.com/) - Technical questions
- [GitHub Issues](https://github.com/your-repo/issues) - Bug reports
- [GitHub Discussions](https://github.com/your-repo/discussions) - General discussion

---

## 🚀 **Roadmap**

### **Version 2.0 Features**
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Biometric authentication
- [ ] QR code payments
- [ ] International transfers

### **Version 1.5 Features**
- [ ] Email notifications
- [ ] PDF statement generation
- [ ] Advanced security features
- [ ] Admin dashboard
- [ ] API rate limiting

---

## 📞 **Contact Information**

**Project:** ATM Banking System
**Version:** 1.0.0
**Author:** [Your Name]
**Email:** [your-email@example.com]
**GitHub:** [https://github.com/your-username/atm-system]

---

## 🎉 **Thank You!**

Thank you for using the ATM Banking System! We hope this comprehensive banking solution meets your needs and provides a solid foundation for your financial application.

**Happy coding!** 🚀

---

*Last updated: September 18, 2025*
*ATM Banking System v1.0.0*