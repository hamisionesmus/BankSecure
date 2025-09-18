CREATE DATABASE IF NOT EXISTS securebank_db;

USE securebank_db;

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pin VARCHAR(255) NOT NULL,
    card_number VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(255) UNIQUE NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    type VARCHAR(50) DEFAULT 'Savings',
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE atms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255),
    cash_available DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'operational'
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50),
    amount DECIMAL(10,2),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    account_id INT,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE TABLE technicians (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE maintenance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    technician_id INT,
    atm_id INT,
    FOREIGN KEY (technician_id) REFERENCES technicians(id),
    FOREIGN KEY (atm_id) REFERENCES atms(id)
);

-- Insert sample data
INSERT INTO customers (name, pin, card_number) VALUES ('Hamisi', '1234', '123456789');
INSERT INTO accounts (account_number, balance, customer_id) VALUES ('ACC001', 1000.00, 1);
INSERT INTO atms (location, cash_available) VALUES ('Main Street', 10000.00);