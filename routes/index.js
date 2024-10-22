const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const bannerController = require('../controllers/bannerController');
const servicesController = require('../controllers/servicesController');
const transactionController = require('../controllers/transactionController');
const verifyToken = require('../middleware/auth'); // Import middleware verifikasi token


router.post('/registration', userController.register);
router.post('/login', userController.login);

router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile/update', verifyToken, userController.updateProfile);
router.put('/profile/image', verifyToken, userController.uploadProfileImage);

router.get('/banner', verifyToken, bannerController.getBanners);
router.get('/services', verifyToken, servicesController.getServices);
router.get('/balance', verifyToken, transactionController.getBalance);
router.post('/topup', verifyToken, transactionController.topUp);
router.post('/transaction', verifyToken, transactionController.makeTransaction);
router.get('/transaction/history', verifyToken, transactionController.getTransactionHistory);

module.exports = router;
