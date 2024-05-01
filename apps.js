// Replace the require statement with a dynamic import
import('node-fetch').then(fetch => {
  const express = require('express');
  const Chart = require('chart.js/auto');
  require('dotenv').config(); 
  const app = express();
  const PORT = process.env.PORT || 5000;
  
  app.use(express.static('public'));
  
  app.get('/', (req, res) => {
      res.sendFile(__dirname + '/public/index.html');
  });
  
  app.get('/data', async (req, res) => {
      try {
          const response = await fetch.default(process.env.API_URL);
          if (!response.ok) {
              throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
          }
          let data = await response.json();
          data.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1);
          data = data.slice(0, 30);
          data = data.map(entry => ({
              temperature: entry.temperature,
              humidity: entry.humidity,
              fire_intensity: entry.fire_intensity,
              gasconcentration: entry.gas_concentration,
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
}).catch(error => {
  console.error('Error importing node-fetch:', error);
});
