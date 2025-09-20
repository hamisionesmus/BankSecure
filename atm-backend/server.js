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

            // Update customer name to Manasha
            db.query('UPDATE customers SET name = $1 WHERE card_number = $2', ['Manasha', '123456789'], (err, results) => {
                if (err) {
                    console.error('Error updating customer name:', err);
                } else {
                    console.log('Customer name updated to Manasha');
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

// NEW: Technician Authentication
app.post('/api/technician-auth', (req, res) => {
    console.log('🔧 Technician authentication request received:', req.body);
    const { technicianId, pin } = req.body;

    const query = 'SELECT id, technician_id, name, contact_info, assigned_bank FROM technicians WHERE technician_id = $1';
    db.query(query, [technicianId], (err, results) => {
        if (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({ error: err.message });
        }

        if (results.rows.length > 0) {
            // Simple PIN validation - in production use proper authentication
            if (pin === 'tech123') { // Default technician PIN
                console.log('✅ Technician authentication successful for:', results.rows[0].name);
                return res.json({
                    success: true,
                    technician: results.rows[0]
                });
            } else {
                console.log('❌ Invalid PIN for technician');
                return res.json({
                    success: false,
                    message: 'Invalid PIN'
                });
            }
        } else {
            console.log('❌ Technician not found');
            return res.json({
                success: false,
                message: 'Technician not found'
            });
        }
    });
});

// NEW: ATM Replenishment
app.post('/api/maintenance/replenish', (req, res) => {
    console.log('🔄 ATM replenishment request received:', req.body);
    const { atmId, technicianId, supplies } = req.body;

    // Update ATM supplies status
    const suppliesStatus = supplies.cash ? 'Cash replenished' :
                          supplies.ink ? 'Ink replenished' :
                          supplies.paper ? 'Paper replenished' : 'Supplies OK';

    const updateQuery = 'UPDATE atms SET supplies_status = $1, cash_available = $2, last_maintenance = CURRENT_TIMESTAMP WHERE id = $3';
    const cashAmount = supplies.cash || null;

    db.query(updateQuery, [suppliesStatus, cashAmount, atmId], (err, results) => {
        if (err) {
            console.error('❌ ATM update failed:', err);
            return res.status(500).json({ error: 'Failed to update ATM supplies' });
        }

        // Log maintenance activity
        const logQuery = 'INSERT INTO maintenance (maintenance_type, description, technician_id, atm_id, notes) VALUES ($1, $2, $3, $4, $5)';
        const description = `ATM replenished: ${suppliesStatus}`;
        const notes = `Supplies: ${JSON.stringify(supplies)}`;

        db.query(logQuery, ['replenish', description, technicianId, atmId, notes], (logErr) => {
            if (logErr) {
                console.log('⚠️ Maintenance logging failed:', logErr);
                // Don't fail the request if logging fails
            }

            console.log('✅ ATM replenishment completed successfully');
            res.json({
                success: true,
                message: 'ATM replenished successfully',
                suppliesStatus
            });
        });
    });
});

// NEW: ATM Diagnostics
app.post('/api/maintenance/diagnose', (req, res) => {
    console.log('🔍 ATM diagnostics request received:', req.body);
    const { atmId, technicianId } = req.body;

    // Get ATM current status
    const atmQuery = 'SELECT * FROM atms WHERE id = $1';
    db.query(atmQuery, [atmId], (err, results) => {
        if (err || !results.rows.length) {
            console.log('❌ ATM not found:', err);
            return res.json({ success: false, message: 'ATM not found' });
        }

        const atm = results.rows[0];

        // Perform diagnostic checks
        const diagnostics = {
            atmId: atm.atm_id,
            location: atm.location,
            operational: atm.is_operational,
            suppliesStatus: atm.supplies_status,
            cashAvailable: atm.cash_available,
            lastMaintenance: atm.last_maintenance,
            issues: []
        };

        // Check for issues
        if (atm.cash_available < 1000) {
            diagnostics.issues.push('Low cash reserves');
        }
        if (!atm.is_operational) {
            diagnostics.issues.push('ATM marked as non-operational');
        }
        if (atm.supplies_status !== 'OK') {
            diagnostics.issues.push(`Supplies issue: ${atm.supplies_status}`);
        }

        // Calculate health score
        let healthScore = 100;
        if (diagnostics.issues.length > 0) {
            healthScore -= diagnostics.issues.length * 20;
        }
        diagnostics.healthScore = Math.max(0, healthScore);

        // Log diagnostic activity
        const logQuery = 'INSERT INTO maintenance (maintenance_type, description, technician_id, atm_id, notes, status) VALUES ($1, $2, $3, $4, $5, $6)';
        const description = `ATM diagnostics performed - Health: ${healthScore}%`;
        const notes = `Issues found: ${diagnostics.issues.join(', ') || 'None'}`;
        const status = diagnostics.issues.length > 0 ? 'issues_found' : 'healthy';

        db.query(logQuery, ['diagnose', description, technicianId, atmId, notes, status], (logErr) => {
            if (logErr) {
                console.log('⚠️ Diagnostic logging failed:', logErr);
            }

            console.log('✅ ATM diagnostics completed:', diagnostics);
            res.json({
                success: true,
                diagnostics,
                message: diagnostics.issues.length > 0 ?
                    `Diagnostics completed. ${diagnostics.issues.length} issues found.` :
                    'ATM diagnostics completed. All systems healthy.'
            });
        });
    });
});

// NEW: ATM Upgrade
app.post('/api/maintenance/upgrade', (req, res) => {
    console.log('⬆️ ATM upgrade request received:', req.body);
    const { atmId, technicianId, upgradeType, version } = req.body;

    // Validate upgrade type
    const validTypes = ['hardware', 'software', 'firmware'];
    if (!validTypes.includes(upgradeType)) {
        return res.json({
            success: false,
            message: 'Invalid upgrade type. Must be: hardware, software, or firmware'
        });
    }

    // Update ATM with upgrade info
    const upgradeNotes = `${upgradeType} upgraded to ${version || 'latest'}`;
    const updateQuery = 'UPDATE atms SET supplies_status = $1, last_maintenance = CURRENT_TIMESTAMP WHERE id = $2';

    db.query(updateQuery, [upgradeNotes, atmId], (err, results) => {
        if (err) {
            console.error('❌ ATM upgrade update failed:', err);
            return res.status(500).json({ error: 'Failed to update ATM upgrade status' });
        }

        // Log upgrade activity
        const logQuery = 'INSERT INTO maintenance (maintenance_type, description, technician_id, atm_id, notes, status) VALUES ($1, $2, $3, $4, $5, $6)';
        const description = `ATM ${upgradeType} upgrade performed`;

        db.query(logQuery, ['upgrade', description, technicianId, atmId, upgradeNotes, 'completed'], (logErr) => {
            if (logErr) {
                console.log('⚠️ Upgrade logging failed:', logErr);
            }

            console.log('✅ ATM upgrade completed successfully');
            res.json({
                success: true,
                message: `ATM ${upgradeType} upgrade completed successfully`,
                upgradeDetails: {
                    type: upgradeType,
                    version: version || 'latest',
                    timestamp: new Date().toISOString()
                }
            });
        });
    });
});

// NEW: Bank Transaction Authorization
app.post('/api/bank/authorize', (req, res) => {
    console.log('🏦 Bank transaction authorization request received:', req.body);
    const { transactionType, accountId, amount, cardNumber } = req.body;

    // Validate transaction type
    const validTypes = ['withdraw', 'deposit', 'transfer'];
    if (!validTypes.includes(transactionType)) {
        return res.json({
            success: false,
            message: 'Invalid transaction type'
        });
    }

    // Check if account exists and belongs to the card
    const accountQuery = 'SELECT id, balance, customer_id FROM accounts WHERE id = $1';
    db.query(accountQuery, [accountId], (err, accountResults) => {
        if (err || !accountResults.rows.length) {
            console.log('❌ Account not found:', err);
            return res.json({
                success: false,
                message: 'Account not found'
            });
        }

        const account = accountResults.rows[0];

        // Verify card belongs to account owner
        const customerQuery = 'SELECT id, card_number FROM customers WHERE id = $1';
        db.query(customerQuery, [account.customer_id], (err, customerResults) => {
            if (err || !customerResults.rows.length || customerResults.rows[0].card_number !== cardNumber) {
                console.log('❌ Card verification failed');
                return res.json({
                    success: false,
                    message: 'Card verification failed'
                });
            }

            // Authorization logic based on transaction type
            let authorized = false;
            let message = '';

            switch (transactionType) {
                case 'withdraw':
                    if (account.balance >= amount) {
                        authorized = true;
                        message = 'Withdrawal authorized';
                    } else {
                        authorized = false;
                        message = 'Insufficient funds';
                    }
                    break;

                case 'deposit':
                    authorized = true;
                    message = 'Deposit authorized';
                    break;

                case 'transfer':
                    if (account.balance >= amount) {
                        authorized = true;
                        message = 'Transfer authorized';
                    } else {
                        authorized = false;
                        message = 'Insufficient funds for transfer';
                    }
                    break;
            }

            console.log(`✅ Bank authorization ${authorized ? 'approved' : 'denied'}: ${message}`);

            res.json({
                success: true,
                authorized,
                message,
                account: {
                    id: account.id,
                    balance: account.balance
                }
            });
        });
    });
});

// NEW: Bank Account Linking
app.post('/api/bank/link-account', (req, res) => {
    console.log('🔗 Bank account linking request received:', req.body);
    const { cardNumber } = req.body;

    if (!cardNumber) {
        return res.json({
            success: false,
            message: 'Card number is required'
        });
    }

    // Find customer by card number
    const customerQuery = 'SELECT id, name, card_number FROM customers WHERE card_number = $1';
    db.query(customerQuery, [cardNumber], (err, customerResults) => {
        if (err || !customerResults.rows.length) {
            console.log('❌ Customer not found for card:', cardNumber);
            return res.json({
                success: false,
                message: 'Card not found in system'
            });
        }

        const customer = customerResults.rows[0];

        // Get all accounts for this customer
        const accountsQuery = 'SELECT * FROM accounts WHERE customer_id = $1';
        db.query(accountsQuery, [customer.id], (err, accountsResults) => {
            if (err) {
                console.log('❌ Error fetching accounts:', err);
                return res.status(500).json({ error: 'Failed to fetch accounts' });
            }

            if (!accountsResults.rows.length) {
                console.log('❌ No accounts found for customer');
                return res.json({
                    success: false,
                    message: 'No accounts found for this card'
                });
            }

            console.log(`✅ Account linking successful for ${customer.name}: ${accountsResults.rows.length} accounts found`);

            res.json({
                success: true,
                customer: {
                    id: customer.id,
                    name: customer.name,
                    cardNumber: customer.card_number
                },
                accounts: accountsResults.rows.map(account => ({
                    id: account.id,
                    accountNumber: account.account_number,
                    balance: parseFloat(account.balance),
                    type: account.type
                })),
                message: `Found ${accountsResults.rows.length} account(s) linked to card ${cardNumber}`
            });
        });
    });
});

// NEW: Get Maintenance Records for Technician
app.get('/api/maintenance/:technicianId', (req, res) => {
    const { technicianId } = req.params;
    console.log('📋 Maintenance records request for technician:', technicianId);

    const query = `
        SELECT m.id, m.maintenance_type, m.description, m.date, m.status, m.notes,
               t.technician_id, t.name as technician_name,
               a.atm_id, a.location as atm_location
        FROM maintenance m
        JOIN technicians t ON m.technician_id = t.id
        JOIN atms a ON m.atm_id = a.id
        WHERE m.technician_id = $1
        ORDER BY m.date DESC
        LIMIT 50
    `;

    db.query(query, [technicianId], (err, results) => {
        if (err) {
            console.error('❌ Error fetching maintenance records:', err);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }

        console.log('✅ Maintenance records retrieved:', results.rows.length, 'records');

        // Format the results for the frontend
        const formattedRecords = results.rows.map(record => ({
            id: record.id,
            maintenance_type: record.maintenance_type,
            description: record.description,
            date: record.date,
            technician_id: record.technician_id,
            atm_id: record.atm_id,
            status: record.status,
            notes: record.notes
        }));

        res.json(formattedRecords || []);
    });
});

// NEW: Get ATMs for Technician
app.get('/api/atms/:technicianId', (req, res) => {
    const { technicianId } = req.params;
    console.log('🏧 Fetching ATMs for technician:', technicianId);

    // For now, return all ATMs. In production, filter by technician's assigned bank
    const query = 'SELECT * FROM atms ORDER BY atm_id';
    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error fetching ATMs:', err);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }

        console.log('✅ ATMs retrieved:', results.rows.length, 'ATMs');
        res.json(results.rows || []);
    });
});

// NEW: Get user settings
app.get('/api/settings/:customerId', (req, res) => {
    const { customerId } = req.params;
    console.log('⚙️ Fetching settings for customer:', customerId);

    // Get all settings in parallel
    const profileQuery = 'SELECT * FROM user_profiles WHERE customer_id = $1';
    const preferencesQuery = 'SELECT * FROM user_preferences WHERE customer_id = $1';
    const notificationsQuery = 'SELECT * FROM notification_preferences WHERE customer_id = $1';

    Promise.all([
        db.query(profileQuery, [customerId]),
        db.query(preferencesQuery, [customerId]),
        db.query(notificationsQuery, [customerId])
    ]).then(([profileResult, preferencesResult, notificationsResult]) => {
        const settings = {
            profile: profileResult.rows[0] || null,
            preferences: preferencesResult.rows[0] || null,
            notifications: notificationsResult.rows[0] || null
        };

        console.log('✅ Settings retrieved for customer:', customerId);
        res.json(settings);
    }).catch(err => {
        console.error('❌ Error fetching settings:', err);
        res.status(500).json({ error: 'Failed to fetch settings' });
    });
});

// NEW: Update user profile
app.put('/api/settings/profile/:customerId', (req, res) => {
    const { customerId } = req.params;
    const { name, email, phone } = req.body;
    console.log('📝 Updating profile for customer:', customerId, { name, email, phone });

    // Update customer name
    const customerQuery = 'UPDATE customers SET name = $1 WHERE id = $2';
    // Upsert user profile
    const profileQuery = `
        INSERT INTO user_profiles (customer_id, email, phone, updated_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        ON CONFLICT (customer_id)
        DO UPDATE SET email = EXCLUDED.email, phone = EXCLUDED.phone, updated_at = CURRENT_TIMESTAMP
    `;

    Promise.all([
        db.query(customerQuery, [name, customerId]),
        db.query(profileQuery, [customerId, email, phone])
    ]).then(() => {
        console.log('✅ Profile updated successfully');
        res.json({ success: true, message: 'Profile updated successfully' });
    }).catch(err => {
        console.error('❌ Error updating profile:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    });
});

// NEW: Update user PIN
app.put('/api/settings/security/:customerId', (req, res) => {
    const { customerId } = req.params;
    const { currentPin, newPin } = req.body;
    console.log('🔐 Updating PIN for customer:', customerId);

    // First verify current PIN
    const verifyQuery = 'SELECT pin FROM customers WHERE id = $1';
    db.query(verifyQuery, [customerId], (err, result) => {
        if (err || !result.rows.length) {
            return res.status(500).json({ error: 'Customer not found' });
        }

        if (result.rows[0].pin !== currentPin) {
            return res.json({ success: false, message: 'Current PIN is incorrect' });
        }

        // Update PIN
        const updateQuery = 'UPDATE customers SET pin = $1 WHERE id = $2';
        db.query(updateQuery, [newPin, customerId], (updateErr) => {
            if (updateErr) {
                console.error('❌ Error updating PIN:', updateErr);
                return res.status(500).json({ error: 'Failed to update PIN' });
            }

            console.log('✅ PIN updated successfully');
            res.json({ success: true, message: 'PIN updated successfully' });
        });
    });
});

// NEW: Update user preferences
app.put('/api/settings/preferences/:customerId', (req, res) => {
    const { customerId } = req.params;
    const { theme, biometric_enabled, auto_logout } = req.body;
    console.log('🎨 Updating preferences for customer:', customerId, { theme, biometric_enabled, auto_logout });

    const query = `
        INSERT INTO user_preferences (customer_id, theme, biometric_enabled, auto_logout, updated_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        ON CONFLICT (customer_id)
        DO UPDATE SET theme = EXCLUDED.theme, biometric_enabled = EXCLUDED.biometric_enabled,
                      auto_logout = EXCLUDED.auto_logout, updated_at = CURRENT_TIMESTAMP
    `;

    db.query(query, [customerId, theme, biometric_enabled, auto_logout], (err) => {
        if (err) {
            console.error('❌ Error updating preferences:', err);
            return res.status(500).json({ error: 'Failed to update preferences' });
        }

        console.log('✅ Preferences updated successfully');
        res.json({ success: true, message: 'Preferences updated successfully' });
    });
});

// NEW: Update notification preferences
app.put('/api/settings/notifications/:customerId', (req, res) => {
    const { customerId } = req.params;
    const { transaction_alerts, low_balance_warnings, monthly_statements, security_alerts } = req.body;
    console.log('🔔 Updating notification preferences for customer:', customerId, {
        transaction_alerts, low_balance_warnings, monthly_statements, security_alerts
    });

    const query = `
        INSERT INTO notification_preferences (customer_id, transaction_alerts, low_balance_warnings, monthly_statements, security_alerts, updated_at)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        ON CONFLICT (customer_id)
        DO UPDATE SET transaction_alerts = EXCLUDED.transaction_alerts,
                      low_balance_warnings = EXCLUDED.low_balance_warnings,
                      monthly_statements = EXCLUDED.monthly_statements,
                      security_alerts = EXCLUDED.security_alerts,
                      updated_at = CURRENT_TIMESTAMP
    `;

    db.query(query, [customerId, transaction_alerts, low_balance_warnings, monthly_statements, security_alerts], (err) => {
        if (err) {
            console.error('❌ Error updating notification preferences:', err);
            return res.status(500).json({ error: 'Failed to update notification preferences' });
        }

        console.log('✅ Notification preferences updated successfully');
        res.json({ success: true, message: 'Notification preferences updated successfully' });
    });
});

const PORT =                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});