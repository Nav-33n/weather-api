
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5670;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper function
const getValueAfterSlash = (string) => {
  const match = string.match(/\/([^/]+)$/);
  return match ? match[1] : null;
};

// Forecast Route
app.get('/forecast', async (req, res) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const place = req.query.city || getValueAfterSlash(timeZone);

  if (!place) {
    return res.status(400).json({ error: 'City not provided or could not determine from timezone' });
  }

  try {
    const url = `https://api.weatherapi.com/v1/forecast.json`;
    const params = {
      key: process.env.REACT_APP_WEATHER_API_KEY,
      q: place,
      days: 3,
      aqi: 'no',
      alerts: 'no',
    };

    const { data } = await axios.get(url, { params });
    res.json(data);
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
