const pool = require('./db');

const getServices = async () => {
    const sql = 'SELECT service_code, service_name, service_icon, service_tariff FROM services';
    const [rows] = await pool.query(sql);
    return rows; 
};

const getServiceByCode = async (service_code) => {
    const sql = 'SELECT * FROM services WHERE service_code = ?';
    const [rows] = await pool.query(sql, [service_code]);
    return rows[0]; 
};
module.exports = { getServices , getServiceByCode };
