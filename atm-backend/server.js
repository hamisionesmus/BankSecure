const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL');

    // Create database if it doesn't exist
    db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
        if (err) {
            console.error('Error creating database:', err);
            return;
        }
        console.log('Database created or already exists');

        // Switch to the database
        db.changeUser({ database: process.env.DB_NAME }, (err) => {
            if (err) {
                console.error('Error switching database:', err);
                return;
            }
            console.log('Switched to database');

            // Create tables
            const fs = require('fs');
            const path = require('path');
            const schemaPath = path.join(__dirname, 'schema.sql');
            const schema = fs.readFileSync(schemaPath, 'utf8');

            // Remove CREATE DATABASE and USE statements, split by semicolon
            const sqlStatements = schema
                .replace(/CREATE DATABASE.*;/, '')
                .replace(/USE.*;/, '')
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0);

            // Execute each statement sequentially
            let index = 0;
            const executeNext = () => {
                if (index >= sqlStatements.length) {
                    console.log('All tables created successfully');

                    // Update customer name to Hamisi
                    db.query('UPDATE customers SET name = ? WHERE card_number = ?', ['Hamisi', '123456789'], (err, results) => {
                        if (err) {
                            console.error('Error updating customer name:', err);
                        } else {
                            console.log('Customer name updated to Hamisi');
                        }
                    });

                    // Verify sample data was inserted
                    db.query('SELECT COUNT(*) as count FROM customers', (err, results) => {
                        if (err) {
                            console.error('Error checking customers:', err);
                        } else {
                            console.log(`Found ${results[0].count} customers in database`);
                        }
                    });

                    return;
                }

                const statement = sqlStatements[index];
                if (statement && statement.trim()) {
                    console.log(`Executing statement ${index + 1}/${sqlStatements.length}: ${statement.substring(0, 50)}...`);
                    db.query(statement, (err) => {
                        if (err) {
                            console.error('Error executing statement:', statement);
                            console.error('Error:', err.message);
                        } else {
                            console.log(`Successfully executed statement ${index + 1}/${sqlStatements.length}`);
                        }
                        index++;
                        executeNext();
                    });
                } else {
                    index++;
                    executeNext();
                }
            };

            executeNext();
        });
    });
});

// API Endpoints

// Authenticate customer
app.post('/api/authenticate', (req, res) => {
    console.log('🔐 Authentication request received:', req.body);
    const { cardNumber, pin } = req.body;
    const query = 'SELECT * FROM customers WHERE card_number = ? AND pin = ?';
    console.log('🔍 Executing query:', query, 'with params:', [cardNumber, pin]);

    db.query(query, [cardNumber, pin], (err, results) => {
        if (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({ error: err.message });
        }

        console.log('📊 Query results:', results);

        if (results.length > 0) {
            console.log('✅ Authentication successful for customer:', results[0].name);
            res.json({ success: true, customer: results[0] });
        } else {
            console.log('❌ Authentication failed - no matching customer found');
            res.json({ success: false });
        }
    });
});

// Get accounts for customer
app.get('/api/accounts/:customerId', (req, res) => {
    const { customerId } = req.params;
    const query = 'SELECT * FROM accounts WHERE customer_id = ?';
    db.query(query, [customerId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Check balance
app.get('/api/balance/:accountId', (req, res) => {
    const { accountId } = req.params;
    const query = 'SELECT balance FROM accounts WHERE id = ?';
    db.query(query, [accountId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ balance: results[0].balance });
    });
});

// Withdraw
app.post('/api/withdraw', (req, res) => {
    console.log('💰 Withdraw request received:', req.body);
    const { accountId, amount } = req.body;
    const query = 'UPDATE accounts SET balance = balance - ? WHERE id = ? AND balance >= ?';
    db.query(query, [amount, accountId, amount], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows > 0) {
            // Log transaction with error handling
            const transQuery = 'INSERT INTO transactions (type, amount, account_id) VALUES (?, ?, ?)';
            console.log('📝 Logging withdrawal transaction:', { type: 'withdraw', amount, accountId });
            db.query(transQuery, ['withdraw', amount, accountId], (transErr) => {
                if (transErr) {
                    console.error('❌ Error logging withdrawal transaction:', transErr);
                    // Still return success since balance was updated
                } else {
                    console.log('✅ Withdrawal transaction logged successfully');
                }
                res.json({ success: true });
            });
        } else {
            res.json({ success: false, message: 'Insufficient funds' });
        }
    });
});

// Deposit
app.post('/api/deposit', (req, res) => {
    console.log('💰 Deposit request received:', req.body);
    const { accountId, amount } = req.body;
    const query = 'UPDATE accounts SET balance = balance + ? WHERE id = ?';
    db.query(query, [amount, accountId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        // Log transaction with error handling
        console.log('📝 Logging deposit transaction:', { type: 'deposit', amount, accountId });
        const transQuery = 'INSERT INTO transactions (type, amount, account_id) VALUES (?, ?, ?)';
        db.query(transQuery, ['deposit', amount, accountId], (transErr) => {
            if (transErr) {
                console.error('❌ Error logging deposit transaction:', transErr);
                // Still return success since balance was updated
            } else {
                console.log('✅ Deposit transaction logged successfully');
            }
            res.json({ success: true });
        });
    });
});

// Transfer
app.post('/api/transfer', (req, res) => {
    console.log('💰 Transfer request received:', req.body);
    const { fromAccountId, toAccountNumber, amount } = req.body;
    // Check balance
    const checkQuery = 'SELECT balance FROM accounts WHERE id = ?';
    db.query(checkQuery, [fromAccountId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results[0].balance < amount) {
            return res.json({ success: false, message: 'Insufficient funds' });
        }
        // Get to account id
        const toQuery = 'SELECT id FROM accounts WHERE account_number = ?';
        db.query(toQuery, [toAccountNumber], (err, toResults) => {
            if (err) return res.status(500).json({ error: err.message });
            if (toResults.length === 0) {
                return res.json({ success: false, message: 'Invalid recipient account' });
            }
            const toAccountId = toResults[0].id;
            // Perform transfer
            db.beginTransaction((err) => {
                if (err) return res.status(500).json({ error: err.message });
                db.query('UPDATE accounts SET balance = balance - ? WHERE id = ?', [amount, fromAccountId], (err) => {
                    if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
                    db.query('UPDATE accounts SET balance = balance + ? WHERE id = ?', [amount, toAccountId], (err) => {
                        if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
                        // Log transaction
                        console.log('📝 Logging transfer transaction:', { type: 'transfer', amount, accountId: fromAccountId });
                        db.query('INSERT INTO transactions (type, amount, account_id) VALUES (?, ?, ?)', ['transfer', amount, fromAccountId], (err) => {
                            if (err) {
                                console.error('❌ Error logging transfer transaction:', err);
                                return db.rollback(() => res.status(500).json({ error: err.message }));
                            }
                            console.log('✅ Transfer transaction logged successfully');
                            db.commit((err) => {
                                if (err) {
                                    console.error('❌ Error committing transfer transaction:', err);
                                    return db.rollback(() => res.status(500).json({ error: err.message }));
                                }
                                console.log('✅ Transfer transaction committed successfully');
                                res.json({ success: true });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Get transaction history for account
app.get('/api/transactions/:accountId', (req, res) => {
    const { accountId } = req.params;
    console.log('📊 Transaction history request for account:', accountId);

    // Ensure accountId is a valid number
    const accountIdNum = parseInt(accountId);
    if (isNaN(accountIdNum)) {
        console.error('❌ Invalid account ID:', accountId);
        return res.status(400).json({ error: 'Invalid account ID' });
    }

    const query = 'SELECT id, type, amount, date, account_id FROM transactions WHERE account_id = ? ORDER BY date DESC LIMIT 10';
    console.log('🔍 Executing transaction history query:', query, 'with accountId:', accountIdNum);

    db.query(query, [accountIdNum], (err, results) => {
        if (err) {
            console.error('❌ Error fetching transaction history:', err);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }

        console.log('✅ Transaction history retrieved:', results.length, 'transactions');
        console.log('📋 Transaction data:', JSON.stringify(results, null, 2));

        // Ensure we return an array even if empty
        res.setHeader('Content-Type', 'application/json');
        res.json(results || []);
    });
});

// Test endpoint to verify database data
app.get('/api/test', (req, res) => {
    db.query('SELECT * FROM customers', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ customers: results });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});