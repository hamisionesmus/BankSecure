const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Handle database connection errors
db.on('error', (err) => {
    console.error('Unexpected database error:', err);
    // Don't exit the process, just log the error
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to PostgreSQL');

    // Create tables if they don't exist
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, 'schema-postgres.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolon and filter out empty statements
    const sqlStatements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

    // Execute each statement sequentially
    let index = 0;
    const executeNext = () => {
        if (index >= sqlStatements.length) {
            console.log('All tables created successfully');

            // Update customer name to Hamisi
            db.query('UPDATE customers SET name = $1 WHERE card_number = $2', ['Hamisi', '123456789'], (err, results) => {
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
                    console.log(`Found ${results.rows[0].count} customers in database`);
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

// API Endpoints

// Authenticate customer
app.post('/api/authenticate', (req, res) => {
    console.log('🔐 Authentication request received:', req.body);
    const { cardNumber, pin } = req.body;
    const query = 'SELECT * FROM customers WHERE card_number = $1 AND pin = $2';
    console.log('🔍 Executing query:', query, 'with params:', [cardNumber, pin]);

    db.query(query, [cardNumber, pin], (err, results) => {
        if (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({ error: err.message });
        }

        console.log('📊 Query results:', results);

        if (results.rows.length > 0) {
            console.log('✅ Authentication successful for customer:', results.rows[0].name);
            res.json({ success: true, customer: results.rows[0] });
        } else {
            console.log('❌ Authentication failed - no matching customer found');
            res.json({ success: false });
        }
    });
});

// Get accounts for customer
app.get('/api/accounts/:customerId', (req, res) => {
    const { customerId } = req.params;
    const query = 'SELECT * FROM accounts WHERE customer_id = $1';
    db.query(query, [customerId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results.rows);
    });
});

// Check balance
app.get('/api/balance/:accountId', (req, res) => {
    const { accountId } = req.params;
    const query = 'SELECT balance FROM accounts WHERE id = $1';
    db.query(query, [accountId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ balance: results.rows[0].balance });
    });
});

// Withdraw
app.post('/api/withdraw', (req, res) => {
    console.log('💰 Withdraw request received:', req.body);
    const { accountId, amount } = req.body;
    const query = 'UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND balance >= $3';
    db.query(query, [amount, accountId, amount], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.rowCount > 0) {
            // Log transaction with error handling
            const transQuery = 'INSERT INTO transactions (type, amount, account_id) VALUES ($1, $2, $3)';
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
    const query = 'UPDATE accounts SET balance = balance + $1 WHERE id = $2';
    db.query(query, [amount, accountId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        // Log transaction with error handling
        console.log('📝 Logging deposit transaction:', { type: 'deposit', amount, accountId });
        const transQuery = 'INSERT INTO transactions (type, amount, account_id) VALUES ($1, $2, $3)';
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
app.post('/api/transfer', async (req, res) => {
    console.log('💰 Transfer request received:', req.body);
    const { fromAccountId, toAccountNumber, amount } = req.body;

    try {
        // Check balance
        const checkQuery = 'SELECT balance FROM accounts WHERE id = $1';
        const balanceResult = await db.query(checkQuery, [fromAccountId]);
        if (balanceResult.rows[0].balance < amount) {
            return res.json({ success: false, message: 'Insufficient funds' });
        }

        // Get to account id
        const toQuery = 'SELECT id FROM accounts WHERE account_number = $1';
        const toResult = await db.query(toQuery, [toAccountNumber]);
        if (toResult.rows.length === 0) {
            return res.json({ success: false, message: 'Invalid recipient account' });
        }
        const toAccountId = toResult.rows[0].id;

        // Prevent self-transfer
        if (fromAccountId === toAccountId) {
            return res.json({ success: false, message: 'Cannot transfer to the same account' });
        }

        // Perform transfer with transaction
        await db.query('BEGIN');
        await db.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromAccountId]);
        await db.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toAccountId]);

        // Log transaction
        console.log('📝 Logging transfer transaction:', { type: 'transfer', amount, accountId: fromAccountId });
        await db.query('INSERT INTO transactions (type, amount, account_id) VALUES ($1, $2, $3)', ['transfer', amount, fromAccountId]);

        await db.query('COMMIT');
        console.log('✅ Transfer transaction committed successfully');
        res.json({ success: true });

    } catch (err) {
        await db.query('ROLLBACK');
        console.error('❌ Transfer error:', err);
        res.status(500).json({ error: err.message });
    }
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

    const query = 'SELECT id, type, amount, date, account_id FROM transactions WHERE account_id = $1 ORDER BY date DESC LIMIT 10';
    console.log('🔍 Executing transaction history query:', query, 'with accountId:', accountIdNum);

    db.query(query, [accountIdNum], (err, results) => {
        if (err) {
            console.error('❌ Error fetching transaction history:', err);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }

        console.log('✅ Transaction history retrieved:', results.rows.length, 'transactions');
        console.log('📋 Transaction data:', JSON.stringify(results.rows, null, 2));

        // Ensure we return an array even if empty
        res.setHeader('Content-Type', 'application/json');
        res.json(results.rows || []);
    });
});

// Test endpoint to verify database data
app.get('/api/test', (req, res) => {
    db.query('SELECT * FROM customers', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ customers: results.rows });
    });
});

const PORT =                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});