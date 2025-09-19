# ATM Banking System

A complete full-stack banking application featuring secure authentication, real-time transactions, and responsive design across all devices.

## Project Structure

```
atm-system/
├── atm-app/                    # React Frontend Application
│   ├── public/                 # Static assets and build files
│   ├── src/                    # React source code
│   │   ├── components/         # Reusable UI components
│   │   ├── App.tsx            # Main application component
│   │   ├── index.tsx          # Application entry point
│   │   └── ...                 # Additional React files
│   ├── package.json           # Frontend dependencies
│   ├── tsconfig.json          # TypeScript configuration
│   └── vercel.json            # Vercel deployment configuration
│
├── atm-backend/                # Node.js Backend Server
│   ├── server.js              # Express server with API endpoints
│   ├── schema-postgres.sql    # PostgreSQL database schema
│   ├── package.json           # Backend dependencies
│   ├── .env.example          # Environment variables template
│   └── .env                  # Environment variables (gitignored)
│
├── vercel.json               # Root Vercel configuration
├── package.json              # Root package configuration
└── README.md                 # Project documentation
```

## Technologies Used

### Frontend Technologies
- **React 19** - Modern JavaScript library for building user interfaces
- **TypeScript** - Typed superset of JavaScript for enhanced development
- **Material-UI (MUI)** - React component library implementing Material Design
- **Framer Motion** - Animation library for React applications
- **Axios** - HTTP client for making API requests
- **Recharts** - Chart library for data visualization
- **SweetAlert2** - Modern alert and modal library

### Backend Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework for Node.js
- **PostgreSQL** - Advanced open-source relational database
- **pg (node-postgres)** - PostgreSQL client for Node.js
- **CORS** - Cross-origin resource sharing middleware
- **dotenv** - Environment variable management

### Deployment Technologies
- **Vercel** - Frontend hosting and serverless functions platform
- **Render** - Backend hosting and database services
- **Neon** - Serverless PostgreSQL database service
- **Git** - Version control system

### Development Tools
- **npm** - Package manager for JavaScript
- **ESLint** - JavaScript linting utility
- **TypeScript Compiler** - TypeScript compilation
- **Git** - Distributed version control system

## Application Features

### Authentication System
- PIN-based user authentication
- Secure session management
- Input validation and sanitization
- Card number verification

### Banking Operations
- **Account Balance Inquiry** - Real-time balance checking
- **Cash Deposit** - Add funds to accounts with transaction logging
- **Cash Withdrawal** - Remove funds with balance validation
- **Fund Transfer** - Transfer money between accounts with atomic transactions
- **Transaction History** - Complete audit trail of all account activities

### User Interface
- **Responsive Design** - Optimized for mobile, tablet, and desktop devices
- **Material Design** - Modern and consistent visual design language
- **Smooth Animations** - Enhanced user experience with motion effects
- **Dark/Light Themes** - Customizable appearance options
- **Touch-Friendly** - Optimized for touch interactions on mobile devices

### Dashboard Features
- **Account Overview** - Summary of account balances and status
- **Quick Actions** - Fast access to common banking operations
- **Recent Transactions** - Display of latest account activities
- **Spending Analytics** - Charts and graphs for transaction analysis
- **Account Management** - Profile and security settings

## Database Schema

### Tables Structure

**customers**
- `id` - Primary key (SERIAL)
- `name` - Customer full name (VARCHAR)
- `pin` - Authentication PIN (VARCHAR)
- `card_number` - Unique card identifier (VARCHAR)

**accounts**
- `id` - Primary key (SERIAL)
- `account_number` - Unique account identifier (VARCHAR)
- `balance` - Current account balance (DECIMAL)
- `type` - Account type (VARCHAR)
- `customer_id` - Foreign key to customers table (INTEGER)

**transactions**
- `id` - Primary key (SERIAL)
- `type` - Transaction type (VARCHAR)
- `amount` - Transaction amount (DECIMAL)
- `date` - Transaction timestamp (TIMESTAMP)
- `account_id` - Foreign key to accounts table (INTEGER)

### Sample Data
- Customer: Hamisi (Card: 123456789, PIN: 1234)
- Account: ACC001 with initial balance of $1000.00

## API Endpoints

### Authentication
- `POST /api/authenticate` - User login with card number and PIN

### Account Management
- `GET /api/accounts/:customerId` - Retrieve customer accounts
- `GET /api/balance/:accountId` - Get account balance

### Transaction Operations
- `POST /api/deposit` - Deposit funds into account
- `POST /api/withdraw` - Withdraw funds from account
- `POST /api/transfer` - Transfer funds between accounts
- `GET /api/transactions/:accountId` - Get transaction history

## Security Features

### Authentication Security
- PIN-based authentication system
- Secure password hashing
- Session management
- Input validation and sanitization

### Data Protection
- SQL injection prevention through parameterized queries
- Cross-site scripting (XSS) protection
- Cross-origin resource sharing (CORS) configuration
- Environment variable protection for sensitive data

### Network Security
- HTTPS encryption for all communications
- Secure API endpoints with proper error handling
- Database connection pooling for performance
- Connection timeout management

## Deployment Architecture

### Development Environment
- Local PostgreSQL database
- Node.js backend server on port 5000
- React frontend on port 3000
- Environment variables for configuration

### Production Environment
- **Frontend**: Hosted on Vercel with global CDN
- **Backend**: Hosted on Render with automatic scaling
- **Database**: Neon serverless PostgreSQL
- **Domain**: Custom domain with SSL certificate

### Infrastructure Components
- **Load Balancing**: Automatic distribution of traffic
- **Auto Scaling**: Dynamic resource allocation
- **Monitoring**: Performance and error tracking
- **Backup**: Automated database backups

## Development Workflow

### Local Development Setup
2. Install dependencies for frontend and backend
3. Set up PostgreSQL database locally
4. Configure environment variables
5. Start development servers
6. Access application at localhost:3000

### Production Deployment
1. Push code changes to GitHub repository
2. Automatic deployment triggers on Vercel
3. Backend deployment on Render
4. Database schema updates on Neon
5. Environment variables configuration
6. SSL certificate provisioning

### Testing Strategy
- Unit tests for individual components
- Integration tests for API endpoints
- End-to-end tests for user workflows
- Performance testing for scalability
- Security testing for vulnerabilities

## Performance Optimizations

### Frontend Optimizations
- Code splitting for reduced bundle size
- Lazy loading for improved initial load time
- Image optimization and compression
- Caching strategies for static assets
- Progressive web app capabilities

### Backend Optimizations
- Database connection pooling
- Query optimization and indexing
- Caching layer for frequently accessed data
- Asynchronous processing for heavy operations
- Rate limiting for API protection

### Database Optimizations
- Proper indexing on frequently queried columns
- Connection pooling for efficient resource usage
- Query optimization and execution planning
- Data partitioning for large datasets
- Backup and recovery procedures

## Monitoring and Maintenance

### Database Maintenance
- Regular backup scheduling
- Performance monitoring and tuning
- Data integrity checks
- Index maintenance and optimization
- Storage capacity planning

### Security Updates
- Regular dependency updates
- Security vulnerability scanning
- Access control reviews
- Audit logging and monitoring
- Incident response procedures

## Cost Optimization

### Hosting Costs
- Vercel free tier for frontend hosting
- Render free tier for backend services
- Neon free tier for database hosting
- Automatic scaling based on usage

### Performance Costs
- Optimized bundle sizes for faster loading
- Efficient database queries
- Caching strategies for reduced server load
- CDN usage for global content delivery

## Future Enhancements

### Planned Features
- Multi-currency support
- Mobile application development
- Advanced analytics dashboard
- Biometric authentication
- QR code payment integration
- International money transfers

### Technical Improvements
- GraphQL API implementation
- Microservices architecture
- Advanced caching strategies
- Machine learning for fraud detection
- Real-time notifications system

