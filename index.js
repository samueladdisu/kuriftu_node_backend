const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config');
const router = require('./routes/route');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(router)

const port = config.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});