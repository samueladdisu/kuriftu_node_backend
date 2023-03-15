const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment-timezone');

const config = require('./config');
const router = require('./routes/route');

moment.tz.setDefault('Africa/Addis_Ababa')

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    console.error(`Error parsing JSON data: ${error.message}`);
    return res.status(400).json({ error: 'Invalid JSON data' });
  }
  next();
});


app.use(router)

const port = config.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});