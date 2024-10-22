const pool = require('./db'); // Mengimpor koneksi database
const getBanners = async () => {
    const sql = 'SELECT banner_name, banner_image, description FROM banners';
    const [rows] = await pool.query(sql);
    return rows; 
};

module.exports = { getBanners };
