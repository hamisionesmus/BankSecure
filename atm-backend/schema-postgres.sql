-- PostgreSQL schema for ATM banking system

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

CREATE TABLE IF NOT EXISTS technicians (
    id SERIAL PRIMARY KEY,
    technician_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255),
    assigned_bank INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS atms (
    id SERIAL PRIMARY KEY,
    atm_id VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(255) NOT NULL,
    cash_available DECIMAL(10,2) DEFAULT 10000.00,
    supplies_status VARCHAR(50) DEFAULT 'OK',
    is_operational BOOLEAN DEFAULT true,
    last_maintenance TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance (
    id SERIAL PRIMARY KEY,
    maintenance_type VARCHAR(50) NOT NULL,
    description TEXT,
    technician_id INTEGER REFERENCES technicians(id),
    atm_id INTEGER REFERENCES atms(id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'completed',
    notes TEXT
);

-- Technicians table
CREATE TABLE IF NOT EXISTS technicians (
    id SERIAL PRIMARY KEY,
    technician_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255),
    assigned_bank INTEGER
);

-- ATMs table
CREATE TABLE IF NOT EXISTS atms (
    id SERIAL PRIMARY KEY,
    atm_id VARCHAR(50) UNIQUE NOT NULL,
    location VARCHAR(255) NOT NULL,
    cash_available DECIMAL(10,2) DEFAULT 0,
    supplies_status VARCHAR(100) DEFAULT 'OK',
    is_operational BOOLEAN DEFAULT true,
    last_maintenance TIMESTAMP
);

-- Maintenance table
CREATE TABLE IF NOT EXISTS maintenance (
    id SERIAL PRIMARY KEY,
    maintenance_type VARCHAR(50) NOT NULL,
    description TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    technician_id INTEGER REFERENCES technicians(id),
    atm_id INTEGER REFERENCES atms(id),
    status VARCHAR(50) DEFAULT 'completed',
    notes TEXT
);

-- Insert sample data
INSERT INTO customers (name, pin, card_number) VALUES ('Manasha', '1234', '123456789') ON CONFLICT (card_number) DO NOTHING;
INSERT INTO accounts (account_number, balance, customer_id) VALUES ('ACC001', 1000.00, 1) ON CONFLICT (account_number) DO NOTHING;

-- Insert sample technician
INSERT INTO technicians (technician_id, name, contact_info, assigned_bank) VALUES ('TECH001', 'John Smith', 'john@bank.com', 1) ON CONFLICT (technician_id) DO NOTHING;

-- Insert sample ATMs
INSERT INTO atms (atm_id, location, cash_available, supplies_status, is_operational) VALUES
('ATM001', 'Main Street Branch', 10000.00, 'OK', true),
('ATM002', 'Downtown Plaza', 8500.00, 'OK', true),
('ATM003', 'Airport Terminal', 12000.00, 'Low Paper', true)
ON CONFLICT (atm_id) DO NOTHING;

-- Insert sample technician data
INSERT INTO technicians (technician_id, name, contact_info, assigned_bank) VALUES ('TECH001', 'ATM Technician', '+1234567890', 1) ON CONFLICT (technician_id) DO NOTHING;

-- Insert sample ATM data
INSERT INTO atms (atm_id, location, cash_available, supplies_status, is_operational) VALUES ('ATM001', 'Main Street Branch', 10000.00, 'OK', true) ON CONFLICT (atm_id) DO NOTHING;