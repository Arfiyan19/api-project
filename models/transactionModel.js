const pool = require('./db');

// Fungsi untuk mengambil saldo user berdasarkan email
const getBalanceByEmail = async (email) => {
    const sql = 'SELECT balance FROM users WHERE email = ?';
    const [rows] = await pool.query(sql, [email]);
    return rows[0]; 
};

// Fungsi untuk memperbarui saldo user
const updateUserBalance = async (email, newBalance) => {
    const sql = 'UPDATE users SET balance = ? WHERE email = ?';
    const [result] = await pool.query(sql, [newBalance, email]);
    return result.affectedRows > 0; 
};

// Fungsi untuk melakukan top up dengan transaksi
const topUpBalanceWithTransaction = async (email, amount) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const sqlUpdateBalance = 'UPDATE users SET balance = balance + ? WHERE email = ?';
        await connection.query(sqlUpdateBalance, [amount, email]);

        const sqlGetUserId = 'SELECT id FROM users WHERE email = ?';
        const [userRows] = await connection.query(sqlGetUserId, [email]);
        const userId = userRows[0].id;

        const invoiceNumber = `INV${Date.now()}`;
        const sqlInsertTransaction = `INSERT INTO transactions (user_id, invoice_number, transaction_type, total_amount, description)
                                       VALUES (?, ?, ?, ?, ?, ?)`;
        await connection.query(sqlInsertTransaction, [userId, invoiceNumber, 'TOPUP', amount, 'Top Up Balance']);

        const [updatedBalanceRows] = await connection.query('SELECT balance FROM users WHERE email = ?', [email]);
        await connection.commit();
        
        return { success: true, newBalance: updatedBalanceRows[0].balance };
    } catch (error) {
        await connection.rollback(); 
        console.error('Error during top-up transaction:', error);
        return { success: false };
    } finally {
        connection.release();
    }
};

// Fungsi untuk menyimpan transaksi
const createTransaction = async (userId, invoiceNumber, serviceCode, transactionType, totalAmount, description) => {
    const sql = `INSERT INTO transactions (user_id, invoice_number, service_code, transaction_type, total_amount, description)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.query(sql, [userId, invoiceNumber, serviceCode, transactionType, totalAmount, description]);
    return result.insertId;
};

// Fungsi untuk mendapatkan riwayat transaksi berdasarkan user
const getTransactionHistory = async (userId, limit = null, offset = 0) => {
    let sql = 'SELECT invoice_number, transaction_type, description, total_amount, created_on FROM transactions WHERE user_id = ? ORDER BY created_on DESC';
    const params = [userId];
    
    if (limit) {
        sql += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);
    }

    const [rows] = await pool.query(sql, params);
    return rows;
};

module.exports = { getBalanceByEmail, updateUserBalance, topUpBalanceWithTransaction, createTransaction, getTransactionHistory };
