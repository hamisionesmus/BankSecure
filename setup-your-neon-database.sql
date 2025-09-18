-- 🏦 ATM System Database Setup for Neon PostgreSQL
-- Run this script in your Neon SQL Editor at: https://console.neon.tech

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pin VARCHAR(255) NOT NULL,
    card_number VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(255) UNIQUE NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    type VARCHAR(50) DEFAULT 'Savings',
    customer_id INTEGER REFERENCES customers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    account_id INTEGER REFERENCES accounts(id)
);

-- Create ATMs table (optional)
CREATE TABLE IF NOT EXISTS atms (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255),
    cash_available DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'operational',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample customer data
INSERT INTO customers (name, pin, card_number) VALUES
('Hamisi', '1234', '123456789')
ON CONFLICT (card_number) DO NOTHING;

-- Insert sample account data
INSERT INTO accounts (account_number, balance, customer_id) VALUES
('ACC001', 1000.00, 1)
ON CONFLICT (account_number) DO NOTHING;

-- Insert sample ATM data (optional)
INSERT INTO atms (location, cash_available) VALUES
('Main Street Branch', 10000.00);

-- Verify data insertion
SELECT 'Customers:' as table_name, COUNT(*) as count FROM customers
UNION ALL
SELECT 'Accounts:', COUNT(*) FROM accounts
UNION ALL
SELECT 'Transactions:', COUNT(*) FROM transactions
UNION ALL
SELECT 'ATMs:', COUNT(*) FROM atms;

-- Show sample data
SELECT
    c.name,
    c.card_number,
    a.account_number,
    a.balance,
    a.type
FROM customers c
JOIN accounts a ON c.id = a.customer_id;

-- Test query to verify everything works
SELECT
    '✅ Database setup complete!' as status,
    NOW() as setup_time,
    version() as postgres_version;