# ATM Banking System - UML Design Implementation

This project implements a complete Automated Teller Machine (ATM) banking system based on UML class diagram design principles, demonstrating full compliance with object-oriented design patterns and real-world banking system requirements.

## UML Design Compliance Demonstration

### Core UML Classes Implemented

#### 1. Customer Class
**UML Requirements:**
- Attributes: customerID, name, pin, cardNumber
- Methods: authenticate(pin), checkBalance(), deposit(amount), withdraw(amount), transfer(toAccount, amount)

**Implementation Status:**
- All attributes implemented in database and frontend
- All methods implemented with API endpoints
- Extended with user profile management and settings

#### 2. ATM Class
**UML Requirements:**
- Attributes: atmID, location, isOperational
- Methods: validateCard(cardNumber), processTransaction(transaction), displayMenu(), ejectCard()

**Implementation Status:**
- All attributes implemented with database integration
- All methods implemented in transaction processing flow
- Extended with maintenance features (diagnostics, upgrades)

#### 3. BankAccount Class
**UML Requirements:**
- Attributes: accountNumber, balance, accountType
- Methods: getBalance(), credit(amount), debit(amount)

**Implementation Status:**
- All attributes implemented with PostgreSQL DECIMAL precision
- All methods implemented with atomic transactions
- Proper foreign key relationships maintained

#### 4. Transaction Class Hierarchy
**UML Requirements:**
- Abstract Transaction class with execute() method
- Subclasses: BalanceInquiry, Deposit, Withdrawal, FundTransfer
- Polymorphic execute() method implementation

**Implementation Status:**
- Abstract transaction processing implemented
- All four transaction types fully functional
- Polymorphism demonstrated through different transaction behaviors
- Complete audit trail with database logging

#### 5. ATMTechnician Class
**UML Requirements:**
- Attributes: technicianID, name
- Methods: performMaintenance(atm), repairATM(atm)

**Implementation Status:**
- All attributes implemented with separate authentication
- All methods implemented with extended maintenance operations
- Added replenishATM(), upgradeATM(), diagnoseATM() methods

#### 6. Bank Class
**UML Requirements:**
- Attributes: bankName, branchCode
- Methods: authorizeTransaction(), linkAccount(cardNumber)

**Implementation Status:**
- Authorization logic implemented for all transactions
- Account linking functionality working
- Security validation and transaction approval

### UML Relationships Implemented

#### Association Relationships
- Customer ↔ ATM (Customer uses ATM)
- Customer ↔ BankAccount (Customer owns accounts)
- ATM ↔ BankAccount (ATM accesses accounts)
- ATMTechnician ↔ ATM (Technician maintains ATM)
- Bank ↔ ATM (Bank owns ATM)
- Bank ↔ BankAccount (Bank manages accounts)
- Bank ↔ Transaction (Bank authorizes transactions)

#### Generalization (Inheritance)
- Transaction → BalanceInquiry, Deposit, Withdrawal, FundTransfer
- Polymorphic execute() method in all subclasses

### Object-Oriented Principles Demonstrated

#### Encapsulation
- Private attributes in database schema
- Public methods for controlled access
- Data integrity through constraints and validation

#### Inheritance
- Transaction class hierarchy implemented
- Method overriding in subclasses
- Code reuse through inheritance

#### Polymorphism
- execute() method behaves differently for each transaction type
- Dynamic method dispatch based on transaction type
- Extensible design for new transaction types

#### Association
- Proper relationships between all classes
- Foreign key constraints in database
- Navigation between related objects

## Implemented Features

### Customer Banking Operations
- PIN-based authentication with secure validation
- Real-time account balance inquiry
- Cash deposit with transaction logging
- Cash withdrawal with balance validation
- Fund transfers between accounts (atomic transactions)
- Complete transaction history with audit trail
- User profile management (name, contact information)
- Security settings (PIN change functionality)
- Notification preferences (transaction alerts, low balance warnings)
- App preferences (theme settings, biometric login, auto-logout)

### ATM Technician Operations
- ATM diagnostics with health score calculation
- Cash replenishment with supply status tracking
- Hardware and software upgrades with version tracking
- Maintenance logging with detailed records
- System status monitoring with operational status
- Supply management (cash, ink, paper)

### Technical Features
- Responsive design (mobile, tablet, desktop)
- Material Design UI with smooth animations
- Real-time data updates and synchronization
- Secure API endpoints with input validation
- PostgreSQL database with proper relationships
- Error handling with user-friendly notifications
- Cross-platform compatibility

## Technology Stack

### Frontend
- React 19 with TypeScript
- Material-UI (MUI) components
- Framer Motion animations
- Axios for API communication
- Recharts for data visualization
- SweetAlert2 for notifications

### Backend
- Node.js with Express.js
- PostgreSQL database
- pg (node-postgres) client
- CORS and security middleware
- Environment variable management

### Deployment
- Vercel (frontend hosting)
- Render (backend hosting)
- Neon (PostgreSQL database)

## Database Schema

### Core Tables
- customers - Customer authentication and basic info
- accounts - Banking accounts with balances
- transactions - Complete transaction history
- technicians - Maintenance staff credentials
- atms - ATM machine information
- maintenance - Service records and logs

### Settings Tables
- user_profiles - Extended user information
- user_preferences - App settings and preferences
- notification_preferences - Alert configuration

## API Endpoints

### Authentication
- POST /api/authenticate - Customer login
- POST /api/technician-auth - Technician login

### Banking Operations
- GET /api/accounts/:customerId - Get customer accounts
- GET /api/balance/:accountId - Get account balance
- POST /api/deposit - Deposit funds
- POST /api/withdraw - Withdraw funds
- POST /api/transfer - Transfer funds
- GET /api/transactions/:accountId - Get transaction history

### Settings & Preferences
- GET/PUT /api/settings/profile/:customerId - Profile management
- PUT /api/settings/security/:customerId - Security settings
- GET/PUT /api/settings/preferences/:customerId - App preferences

### Maintenance (Technician)
- POST /api/maintenance/replenish - Replenish ATM supplies
- POST /api/maintenance/diagnose - Run ATM diagnostics
- POST /api/maintenance/upgrade - Perform ATM upgrades

## How to Run the Project Locally

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- PostgreSQL database server

### Installation Steps

1. Install Dependencies
   ```bash
   # Install all project dependencies at once
   npm run install-all

   # Or install individually:
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd atm-app
   npm install

   # Install backend dependencies
   cd ../atm-backend
   npm install
   ```

2. Set Up Database
   - Create a new PostgreSQL database
   - Run the database schema file: atm-backend/schema-postgres.sql
   - Update environment variables in atm-backend/.env file with your database connection details

3. Start Development Servers
   ```bash
   # Terminal 1: Start the backend server
   npm run start-backend

   # Terminal 2: Start the frontend development server
   cd atm-app
   npm start
   ```

4. Access the Application
   - Frontend application: http://localhost:3000
   - Backend API server: http://localhost:5000

### Test Credentials

Customer Login:
- Card Number: 123456789
- PIN: 1234

Technician Login:
- Technician ID: tech123
- PIN: tech123

### Available Scripts
- npm run dev - Start frontend development server
- npm run start-backend - Start backend server
- npm run install-all - Install all dependencies across the project
- npm run deploy - Deploy to production environment

## Project Architecture

```
atm-system/
├── atm-app/                    # React Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   ├── App.tsx            # Main Application Component
│   │   └── ...
│   └── package.json
├── atm-backend/                # Node.js Backend Server
│   ├── server.js              # Express Server with API Endpoints
│   ├── schema-postgres.sql    # PostgreSQL Database Schema
│   └── package.json
├── api/                       # Vercel Serverless Functions
├── vercel.json               # Deployment Configuration
└── README.md                 # Project Documentation
```

## Security Implementation

- PIN-based authentication with validation
- SQL injection prevention through parameterized queries
- Input sanitization and validation
- Cross-origin resource sharing (CORS) configuration
- Secure session management
- Environment variable protection for sensitive data





