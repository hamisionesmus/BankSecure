-- FREE DATABASE SETUP FOR NEON/SUPABASE (PostgreSQL)
-- Copy and paste this into your PostgreSQL database SQL Editor
-- Works with Neon, Supabase, or any PostgreSQL service

-- OPTION 1: If tables don't exist, create them
-- OPTION 2: If tables exist and you want to reset, run the DROP commands below first

-- DROP TABLES IF THEY EXIST (UNCOMMENT IF YOU WANT TO RESET)
-- DROP TABLE IF EXISTS maintenance;
-- DROP TABLE IF EXISTS technicians;
-- DROP TABLE IF EXISTS atms;
-- DROP TABLE IF EXISTS banks;
-- DROP TABLE IF EXISTS transactions;
-- DROP TABLE IF EXISTS accounts;
-- DROP TABLE IF EXISTS customers;

-- Create database tables
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pin VARCHAR(255) NOT NULL,
    card_number VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(255) UNIQUE NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    type VARCHAR(50) DEFAULT 'Savings',
    customer_id INTEGER REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50),
    amount DECIMAL(10,2),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    account_id INTEGER REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS atms (
    id SERIAL PRIMARY KEY,
    atm_id VARCHAR(50) UNIQUE, -- Unique ATM identifier
    location VARCHAR(255),
    cash_available DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'operational',
    supplies_status VARCHAR(255) DEFAULT 'OK', -- Cash, ink, paper status
    is_operational BOOLEAN DEFAULT true,
    last_maintenance TIMESTAMP,
    bank_id INTEGER -- Reference to bank
);

CREATE TABLE IF NOT EXISTS technicians (
    id SERIAL PRIMARY KEY,
    technician_id VARCHAR(50) UNIQUE, -- Unique technician identifier
    name VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255),
    assigned_bank INTEGER -- Reference to bank
);

CREATE TABLE IF NOT EXISTS banks (
    id SERIAL PRIMARY KEY,
    bank_name VARCHAR(255) NOT NULL,
    branch_code VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS maintenance (
    id SERIAL PRIMARY KEY,
    maintenance_type VARCHAR(100), -- replenish, upgrade, diagnose
    description TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    technician_id INTEGER REFERENCES technicians(id),
    atm_id INTEGER REFERENCES atms(id),
    status VARCHAR(50) DEFAULT 'completed',
    notes TEXT
);

-- Insert sample data (only if not exists)
INSERT INTO customers (name, pin, card_number)
VALUES ('Manasha', '1234', '123456789')
ON CONFLICT (card_number) DO NOTHING;

INSERT INTO accounts (account_number, balance, customer_id)
VALUES ('ACC001', 1000.00, 1)
ON CONFLICT (account_number) DO NOTHING;

-- Insert sample bank
INSERT INTO banks (bank_name, branch_code)
VALUES ('SecureBank', 'SB001')
ON CONFLICT (branch_code) DO NOTHING;

-- Insert sample ATM with extended fields
INSERT INTO atms (atm_id, location, cash_available, supplies_status, is_operational, bank_id)
VALUES ('ATM001', 'Main Street Branch', 10000.00, 'OK', true, 1)
ON CONFLICT (atm_id) DO NOTHING;

-- Insert sample technician
INSERT INTO technicians (technician_id, name, contact_info, assigned_bank)
VALUES ('TECH001', 'ATM Technician', '+1234567890', 1)
ON CONFLICT (technician_id) DO NOTHING;

-- Insert sample maintenance record (only if ATM and technician exist)
INSERT INTO maintenance (maintenance_type, description, technician_id, atm_id, notes)
SELECT 'initial_setup', 'ATM initial setup and testing', 1, 1, 'All systems operational'
WHERE EXISTS (SELECT 1 FROM technicians WHERE id = 1)
  AND EXISTS (SELECT 1 FROM atms WHERE id = 1)
  AND NOT EXISTS (SELECT 1 FROM maintenance WHERE maintenance_type = 'initial_setup' AND atm_id = 1);

-- Verify setup
SELECT 'Database setup complete!' as status;
SELECT COUNT(*) as customers FROM customers;
SELECT COUNT(*) as accounts FROM accounts;
SELECT COUNT(*) as atms FROM atms;
SELECT COUNT(*) as technicians FROM technicians;
SELECT COUNT(*) as banks FROM banks;
SELECT COUNT(*) as maintenance_records FROM maintenance;