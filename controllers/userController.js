const { createUser, checkEmailExists , findUserByEmail, updateUserProfile , updateUserProfileImage } = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool  = require('../models/db');
const multer = require('multer');
const path = require('path');
// Fungsi untuk validasi email
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

// Controller untuk registrasi user baru
exports.register = async (req, res) => {
    const { email, first_name, last_name, password } = req.body;
    // Inisialisasi array untuk menyimpan field yang kosong
    let missingFields = [];
    if (!email) missingFields.push('email');
    if (!first_name) missingFields.push('first_name');
    if (!last_name) missingFields.push('last_name');
    if (!password) missingFields.push('password');

    // Jika ada field yang kosong, kembalikan respons error
    if (missingFields.length > 0) {
        return res.status(400).json({
            status: 102,
            message: `Field berikut harus diisi: ${missingFields.join(', ')}`,
            data: []
        });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({
            status: 102,
            message: 'Parameter email tidak sesuai format',
            data: []
        });
    }
    if (password.length < 8) {
        return res.status(400).json({
            status: 102,
            message: 'Password harus memiliki minimal 8 karakter',
            data: []
        });
    }

    try {
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            return res.status(400).json({
                status: 103,
                message: 'Email sudah digunakan',
                data: []
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await createUser(email, first_name, last_name, hashedPassword);

        return res.status(200).json({
            status: 0,
            message: 'Registrasi berhasil silahkan login',
            data: { userId }
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: []
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    // Validasi email dan password
    if (!email || !password) {
        return res.status(400).json({
            status: 102,
            message: 'Email dan password harus diisi',
            data: null
        });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({
            status: 102,
            message: 'Paramter email tidak sesuai format',
            data: null
        });
    }
    if (password.length < 8) {
        return res.status(400).json({
            status: 102,
            message: 'Password harus memiliki minimal 8 karakter',
            data: null
        });
    }
    try {
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                status: 103,
                message: 'Username atau password salah',
                data: null
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                status: 103,
                message: 'Username atau password salah',
                data: null
            });
        }
        // Buat JWT dengan payload email, dan set masa berlaku 12 jam
        const token = jwt.sign(
            { email: user.email },
            'your-secret-key', 
            { expiresIn: '12h' }
        );

        // Kirim token di respons
        return res.status(200).json({
            status: 0,
            message: 'Login Sukses',
            data: { token }
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null
        });
    }
};


// Controller untuk mendapatkan data profile user
exports.getProfile = async (req, res) => {
    try {
        const email = req.user.email; 

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                status: 109,
                message: 'User tidak ditemukan',
                data: null
            });
        }

        // Kembalikan data profile
        return res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_image: user.profile_image
            }
        });
    } catch (error) {
        console.error('Error during fetching profile:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null
        });
    }
};


// Controller untuk update data profile user
exports.updateProfile = async (req, res) => {
    try {
        const email = req.user.email; 
        const { first_name, last_name } = req.body; 

        if (!first_name || !last_name) {
            return res.status(400).json({
                status: 102,
                message: 'Field first_name dan last_name harus diisi',
                data: null
            });
        }

        // Update profile user berdasarkan email
        const user = await updateUserProfile(email, first_name, last_name);

        if (!user) {
            return res.status(404).json({
                status: 109,
                message: 'User tidak ditemukan',
                data: null
            });
        }

        // Kembalikan respons sukses dengan data yang diupdate
        return res.status(200).json({
            status: 0,
            message: 'Update Profile berhasil',
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_image: user.profile_image
            }
        });
    } catch (error) {
        console.error('Error during profile update:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null
        });
    }
};





// Konfigurasi multer untuk menyimpan file gambar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile_images'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); 
    }
});

// Filter untuk hanya menerima file gambar dengan format jpeg atau png
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        return cb(new Error('Format Image tidak sesuai. Hanya jpeg dan png diperbolehkan.'));
    }
};
// Membuat instance multer dengan konfigurasi di atas
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
}).single('file'); 
// Controller untuk upload gambar profil
exports.uploadProfileImage = (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                status: 102,
                message: 'File terlalu besar, maksimal 5MB',
                data: null
            });
        } else if (err) {
            return res.status(400).json({
                status: 102,
                message: err.message,
                data: null
            });
        }

        if (!req.file) {
            return res.status(400).json({
                status: 102,
                message: 'Tidak ada file yang diupload',
                data: null
            });
        }

        try {
            const email = req.user.email;
            const profileImageUrl = `/uploads/profile_images/${req.file.filename}`; 

            const user = await updateUserProfileImage(email, profileImageUrl);

            if (!user) {
                return res.status(404).json({
                    status: 109,
                    message: 'User tidak ditemukan',
                    data: null
                });
            }
            return res.status(200).json({
                status: 0,
                message: 'Update Profile Image berhasil',
                data: {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    profile_image: profileImageUrl
                }
            });
        } catch (error) {
            console.error('Error during profile image upload:', error);
            return res.status(500).json({
                status: 500,
                message: 'Internal server error',
                data: null
            });
        }
    });
};


