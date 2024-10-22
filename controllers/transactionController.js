const { getBalanceByEmail, topUpBalanceWithTransaction, createTransaction, getTransactionHistory } = require('../models/transactionModel');
const { findUserByEmail } = require('../models/userModel');
const { getServiceByCode } = require('../models/servicesModel');

// Controller untuk mendapatkan saldo
exports.getBalance = async (req, res) => {
    try {
        const email = req.user.email; 
        const userBalance = await getBalanceByEmail(email); 
        
        if (!userBalance) {
            return res.status(404).json({
                status: 109,
                message: 'User tidak ditemukan',
                data: null
            });
        }

        return res.status(200).json({
            status: 0,
            message: 'Get Balance Berhasil',
            data: { balance: userBalance.balance }
        });
    } catch (error) {
        console.error('Error fetching balance:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null
        });
    }
};
// Controller untuk melakukan top-up
exports.topUp = async (req, res) => {
    const { top_up_amount } = req.body;

    if (typeof top_up_amount !== 'number' || top_up_amount <= 0) {
        return res.status(400).json({
            status: 102,
            message: 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
            data: null
        });
    }

    try {
        const email = req.user.email;
        const result = await topUpBalanceWithTransaction(email, top_up_amount);

        if (!result.success) {
            return res.status(500).json({
                status: 500,
                message: 'Gagal melakukan top-up',
                data: null
            });
        }

        return res.status(200).json({
            status: 0,
            message: 'Top Up Balance berhasil',
            data: { balance: result.newBalance }
        });
    } catch (error) {
        console.error('Error during top-up:', error);
        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null
        });
    }
};

exports.makeTransaction = async (req, res) => {
    const { service_code } = req.body;

    if (!service_code) {
        return res.status(400).json({ status: 102, message: 'Service code harus diisi', data: null });
    }

    try {
        const email = req.user.email;
        const user = await findUserByEmail(email);
        console.log("User Data:", user);

        const service = await getServiceByCode(service_code);
        console.log("Service Data:", service);

        if (!service) {
            return res.status(400).json({ status: 102, message: 'Service tidak ditemukan', data: null });
        }
        const userBalance = await getBalanceByEmail(email);
        console.log("User Balance:", userBalance);

        const userBalanceAmount = parseFloat(userBalance.balance);
        const serviceTariff = parseFloat(service.service_tariff);

        console.log("User Balance (Numeric): ", userBalanceAmount);
        console.log("Service Tariff (Numeric): ", serviceTariff);
      
        if (userBalanceAmount < serviceTariff) {
            return res.status(400).json({ status: 102, message: 'Saldo tidak mencukupi', data: null });
        }

        const invoiceNumber = `INV${Date.now()}`;
        await createTransaction(user.id, invoiceNumber, service_code, 'PAYMENT', serviceTariff, service.service_name);

        await topUpBalanceWithTransaction(email, -serviceTariff);

        return res.status(200).json({
            status: 0,
            message: 'Transaksi berhasil',
            data: {
                invoice_number: invoiceNumber,
                service_code: service_code,
                service_name: service.service_name,
                transaction_type: 'PAYMENT',
                total_amount: serviceTariff,
                saldo_akhir: userBalanceAmount - serviceTariff, 
                created_on: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error during transaction:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error', data: null });
    }
};


exports.getTransactionHistory = async (req, res) => {
    const limit = parseInt(req.query.limit) || null;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const email = req.user.email;
        const user = await findUserByEmail(email);

        const transactions = await getTransactionHistory(user.id, limit, offset);

        return res.status(200).json({
            status: 0,
            message: 'Get History Berhasil',
            data: {
                offset: offset,
                limit: limit,
                records: transactions
            }
        });
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error', data: null });
    }
};
