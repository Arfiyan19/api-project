const { getServices } = require('../models/servicesModel');
// Controller untuk mengambil daftar layanan PPOB
exports.getServices = async (req, res) => {
    try {
        // Ambil data layanan dari database
        const services = await getServices();

        // Jika tidak ada layanan, kembalikan response sukses dengan data kosong
        if (services.length === 0) {
            return res.status(200).json({
                status: 0,
                message: 'Tidak ada layanan',
                data: []
            });
        }

        // Kembalikan response sukses dengan data layanan
        return res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: services
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: []
        });
    }
};
