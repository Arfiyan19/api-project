const { getBanners } = require('../models/bannerModel'); // Mengimpor model banner


// Controller untuk mendapatkan daftar banner
exports.getBanners = async (req, res) => {
    try {
        // Ambil data banner dari database
        const banners = await getBanners();

        // Jika tidak ada banner, kembalikan respons sukses dengan data kosong
        if (banners.length === 0) {
            return res.status(200).json({
                status: 0,
                message: 'Tidak ada banner',
                data: []
            });
        }
        // Kembalikan respons sukses dengan data banner
        return res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: banners
        });
    } catch (error) {
        console.error('Error fetching banners:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: []
        });
    }
};
