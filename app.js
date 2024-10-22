const express = require('express');
const app = express();
const pool = require('./models/db'); // Koneksi ke MySQL
const userRoutes = require('./routes/index'); // Mengimpor routes

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.use('/api', userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
