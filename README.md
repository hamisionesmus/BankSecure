# ATM Banking System

A complete full-stack banking application featuring secure authentication, real-time transactions, and responsive design across all devices. This system includes both customer banking operations and ATM technician maintenance functionality.

## 🚀 Features Implemented

### ✅ Customer Features
- **PIN-based authentication** with secure session management
- **Account balance inquiry** with real-time balance updates
- **Cash deposit and withdrawal** with transaction validation
- **Fund transfers** between accounts with atomic transactions
- **Transaction history** with complete audit trail
- **User profile management** (name, contact info)
- **Security settings** (PIN change functionality)
- **Notification preferences** (transaction alerts, low balance warnings)
- **App preferences** (theme settings, biometric login, auto-logout)

### ✅ Technician Features
- **ATM diagnostics** with health score calculation
- **Cash replenishment** with supply status tracking
- **Hardware/software upgrades** with version tracking
- **Maintenance logging** with detailed records
- **System status monitoring** with operational status

### ✅ Technical Features
- **Responsive design** optimized for mobile, tablet, and desktop
- **Material Design UI** with smooth animations
- **Real-time data updates** with automatic refresh
- **Secure API endpoints** with input validation
- **Database integration** with PostgreSQL
- **Error handling** with user-friendly notifications

## 🛠️ Technologies Used

### Frontend
- **React 19** with TypeScript
- **Material-UI (MUI)** for components
- **Framer Motion** for animations
- **Axios** for API calls
- **Recharts** for data visualization
- **SweetAlert2** for notifications

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **pg (node-postgres)** client
- **CORS** and security middleware
- **Environment variable** management

### Deployment
- **Vercel** for frontend hosting
- **Render** for backend hosting
- **Neon** for PostgreSQL database

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Git

## 🚀 How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/hamisionesmus/BankSecure.git
cd BankSecure
```

### 2. Install Dependencies
```bash
# Install all dependencies at once
npm run install-all

# Or install individually:
npm install                    # Root dependencies
cd atm-app && npm install     # Frontend dependencies
cd ../atm-backend && npm install  # Backend dependencies
```

### 3. Set Up Database
- Create a PostgreSQL database
- Run the schema file: `atm-backend/schema-postgres.sql`
- Update environment variables in `atm-backend/.env`

### 4. Start Development Servers
```bash
# Terminal 1: Start backend
npm run start-backend

# Terminal 2: Start frontend
cd atm-app
npm start
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔐 Default Test Credentials

### Customer Login
- **Card Number**: `123456789`
- **PIN**: `1234`

### Technician Login
- **Technician ID**: `tech123`
- **PIN**: `tech123`

## 📁 Project Structure

```
atm-system/
├── atm-app/                    # React Frontend
│   ├── src/
│   │   ├── components/         # UI Components
│   │   ├── App.tsx            # Main App Component
│   │   └── ...
│   └── package.json
├── atm-backend/                # Node.js Backend
│   ├── server.js              # Express Server
│   ├── schema-postgres.sql    # Database Schema
│   └── package.json
├── api/                       # Vercel Serverless Functions
├── vercel.json               # Deployment Config
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/authenticate` - Customer login
- `POST /api/technician-auth` - Technician login

### Banking Operations
- `GET /api/accounts/:customerId` - Get accounts
- `GET /api/balance/:accountId` - Get balance
- `POST /api/deposit` - Deposit funds
- `POST /api/withdraw` - Withdraw funds
- `POST /api/transfer` - Transfer funds
- `GET /api/transactions/:accountId` - Transaction history

### Settings & Preferences
- `GET/PUT /api/settings/profile/:customerId` - Profile management
- `PUT /api/settings/security/:customerId` - Security settings
- `GET/PUT /api/settings/preferences/:customerId` - App preferences

### Maintenance (Technician)
- `POST /api/maintenance/replenish` - Replenish supplies
- `POST /api/maintenance/diagnose` - Run diagnostics
- `POST /api/maintenance/upgrade` - Perform upgrades

## 🗄️ Database Schema

### Core Tables
- `customers` - Customer authentication
- `accounts` - Banking accounts
- `transactions` - Transaction records
- `technicians` - Maintenance staff
- `atms` - ATM machines
- `maintenance` - Service logs

### Settings Tables
- `user_profiles` - Extended profiles
- `user_preferences` - App settings
- `notification_preferences` - Alert settings

## 🔒 Security Features

- PIN-based authentication with validation
- SQL injection prevention via parameterized queries
- Input sanitization and validation
- CORS configuration
- Secure session management
- Environment variable protection

## 📜 Available Scripts

```bash
npm run dev              # Start frontend dev server
npm run start-backend    # Start backend server
npm run install-all      # Install all dependencies
npm run deploy          # Deploy to production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Student**: Olatunde Olowe
**Project**: ATM Banking System - Full-Stack Implementation
**Technologies**: React, Node.js, PostgreSQL, TypeScript
