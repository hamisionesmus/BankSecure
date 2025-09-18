-- Supabase Database Setup for ATM System
-- Run this in Supabase SQL Editor

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pin VARCHAR(255) NOT NULL,
    card_number VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(255) UNIQUE NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    type VARCHAR(50) DEFAULT 'Savings',
    customer_id INTEGER REFERENCES customers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50),
    amount DECIMAL(10,2),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    account_id INTEGER REFERENCES accounts(id)
);

-- Create atms table (optional)
CREATE TABLE IF NOT EXISTS atms (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255),
    cash_available DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'operational',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO customers (name, pin, card_number) VALUES
('Hamisi', '1234', '123456789')
ON CONFLICT (card_number) DO NOTHING;

INSERT INTO accounts (account_number, balance, customer_id) VALUES
('ACC001', 1000.00, 1)
ON CONFLICT (account_number) DO NOTHING;

-- Enable Row Level Security (RLS) for security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
-- Note: Adjust these policies based on your authentication setup

-- Allow read access to customers (you might want to restrict this)
CREATE POLICY "Allow read access to customers" ON customers
FOR SELECT USING (true);

-- Allow read access to accounts for authenticated users
CREATE POLICY "Allow read access to accounts" ON accounts
FOR SELECT USING (true);

-- Allow insert/update on accounts for balance changes
CREATE POLICY "Allow balance updates on accounts" ON accounts
FOR UPDATE USING (true);

-- Allow read access to transactions
CREATE POLICY "Allow read access to transactions" ON transactions
FOR SELECT USING (true);

-- Allow insert on transactions for logging
CREATE POLICY "Allow insert on transactions" ON transactions
FOR INSERT WITH CHECK (true);

-- Verify setup
SELECT 'Database setup complete!' as status;
SELECT COUNT(*) as customers_count FROM customers;
SELECT COUNT(*) as accounts_count FROM accounts;