const express = require('express');
const { filterRoom, releaseRoom, holdRoom, tempRes, calculateRoomPrice, calculateBishoftu } = require('../controllers/user/rooms.controller');
const { getPromoCode } = require('../controllers/user/promo.controller');
const { dailyRes } = require('../controllers/admin/daily');

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

// frontend routes
router.get("/filterRoom", filterRoom);
router.post("/releaseRoom", releaseRoom);
router.post("/holdRoom", holdRoom)

router.post("/tempRes", tempRes);
router.post("/calculatePrice", calculateRoomPrice)
router.post("/getPromoCode", getPromoCode);


// admin routes
router.get("/dailyRes", dailyRes)

module.exports = router;