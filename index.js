const express = require('express');
const fetch = require('node-fetch');
const Chart = require('chart.js/auto');
require('dotenv').config(); // Mengimpor dan mengonfigurasi dotenv
const app = express();
const PORT = process.env.PORT || 5000; // Menggunakan nilai PORT dari variabel lingkungan atau default 3000

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/data', async (req, res) => {
    try {
        const response = await fetch(process.env.API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        let data = await response.json();
        // Urutkan data berdasarkan timestamp secara menurun
        data.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1);
        // Batasi jumlah data yang ditampilkan menjadi 20
        data = data.slice(0, 20);
        // Pilih hanya nilai yang diperlukan
        data = data.map(entry => ({
            temperature: entry.temperature,
            humidity: entry.humidity,
            fire_intensity: entry.fire_intensity,
            gasconcentration: entry.gasconcentration,
            timestamp: entry.timestamp
        }));
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data', message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
