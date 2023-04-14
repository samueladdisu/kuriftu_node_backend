const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const moment = require("moment-timezone");

const config = require("./config");
const router = require("./routes/route");
const helmet = require("helmet");

moment.tz.setDefault("Africa/Addis_Ababa");

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: "https://kurifturesorts.com",
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "http://localhost:8000"],
    },
  })
);

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    console.error(`Error parsing JSON data: ${error.message}`);
    return res.status(400).json({ error: "Invalid JSON data" });
  }
  next();
});

app.use(router);

const port = config.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
