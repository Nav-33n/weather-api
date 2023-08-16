const PORT = process.env.PORT;
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const axios = require('axios')
const app = express();
const bodyParser = require('body-parser');

app.use(cors())
app.use(bodyParser.json());

app.get('/forecast', async (req, res) => {

    const timeZoneoffset = Intl.DateTimeFormat().resolvedOptions().timeZone;

    function getValueAfterSlash(string) {
        const match = string.match(/\/([^/]+)$/);
        if (match) {
          return match[1];
        } else {
          return null;
        }
      }

      let place = req.query.city;

      if(place == undefined){
        place = getValueAfterSlash(timeZoneoffset);
      }

    try {
        const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${place}&days=3&aqi=no&alerts=no`)
        res.json(response.data);
    } catch (error) {
        res.status(500).json({error: 'An error Occurred'});
    }
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))