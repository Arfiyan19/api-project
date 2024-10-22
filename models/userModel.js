const pool = require('./db');

// Fungsi untuk menambahkan user baru ke database
const createUser = async (email, first_name, last_name, password) => {
    const sql = 'INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(sql, [email, first_name, last_name, password]);
    return result.insertId; 
};

// Fungsi untuk mengecek apakah email sudah ada
const checkEmailExists = async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(sql, [email]);
    return rows.length > 0; 
};

const findUserByEmail = async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(sql, [email]);
    return rows[0]; 
};
// Fungsi untuk memperbarui data profil user di database
const updateUserProfile = async (email, first_name, last_name) => {
    const sql = 'UPDATE users SET first_name = ?, last_name = ? WHERE email = ?';
    const [result] = await pool.query(sql, [first_name, last_name, email]);

    // Jika tidak ada baris yang ter-update, berarti user tidak ditemukan
    if (result.affectedRows === 0) {
        return null;
    }

    // Setelah update berhasil, kembalikan data user yang sudah diperbarui
    const user = await findUserByEmail(email);
    return user;
};
const updateUserProfileImage = async (email, profile_image) => {
    const sql = 'UPDATE users SET profile_image = ? WHERE email = ?';
    const [result] = await pool.query(sql, [profile_image, email]);

    // Jika tidak ada baris yang ter-update, berarti user tidak ditemukan
    if (result.affectedRows === 0) {
        return null;
    }

    // Setelah update berhasil, ambil data user yang baru diupdate
    const user = await findUserByEmail(email);
    return user;
};

// Fungsi untuk mendapatkan balance dari user berdasarkan email
const getUserBalanceByEmail = async (email) => {
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

module.exports = { createUser, checkEmailExists, findUserByEmail, updateUserProfile , updateUserProfileImage , getUserBalanceByEmail, updateUserBalance };