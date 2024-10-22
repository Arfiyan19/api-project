const mysql = require('mysql2');
// Konfigurasi koneksi ke database
const pool = mysql.createPool({
    host: 'localhost',    
    user: 'root',      
    password: '',
    database: 'db_api',   
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise(); 

module.exports = pool;
