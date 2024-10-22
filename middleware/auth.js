const jwt = require('jsonwebtoken');
// Middleware untuk memverifikasi token JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        return res.status(401).json({
            status: 108,
            message: 'Token tidak ditemukan',
            data: null
        });
    }

    // Verifikasi token
    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(401).json({
                status: 108,
                message: 'Token tidak valid atau kadaluwarsa',
                data: null
            });
        }

        req.user = user; // Simpan payload user dari token
        next(); // Lanjut ke controller berikutnya
    });
};

module.exports = verifyToken;
