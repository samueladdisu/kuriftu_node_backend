const express = require('express');
const { filterRoom } = require('../controllers/rooms.controller');

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/filterRoom", filterRoom);


module.exports = router;