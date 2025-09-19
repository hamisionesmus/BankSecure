-- FREE DATABASE SETUP FOR NEON/SUPABASE (PostgreSQL)
-- Copy and paste this into your PostgreSQL database SQL Editor
-- Works with Neon, Supabase, or any PostgreSQL service

-- Create database tables
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pin VARCHAR(255) NOT NULL,
    card_number VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(255) UNIQUE NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    type VARCHAR(50) DEFAULT 'Savings',
    customer_id INTEGER REFERENCES customers(id)
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50),
    amount DECIMAL(10,2),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    account_id INTEGER REFERENCES accounts(id)
);

CREATE TABLE atms (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255),
    cash_available DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'operational'
);

-- Insert sample data
INSERT INTO customers (name, pin, card_number) VALUES ('Hamisi', '1234', '123456789');
INSERT INTO accounts (account_number, balance, customer_id) VALUES ('ACC001', 1000.00, 1);
INSERT INTO atms (location, cash_available) VALUES ('Main Street', 10000.00);

-- Verify setup
SELECT 'Database setup complete!' as status;
SELECT COUNT(*) as customers FROM customers;
SELECT COUNT(*) as accounts FROM accounts;