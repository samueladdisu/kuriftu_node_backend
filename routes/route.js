const express = require('express');
const { filterRoom, releaseRoom, holdRoom, tempRes } = require('../controllers/user/rooms.controller');
const { getPromoCode } = require('../controllers/user/promo.controller');

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/filterRoom", filterRoom);
router.post("/releaseRoom", releaseRoom);
router.post("/holdRoom", holdRoom)

router.post("/tempRes", tempRes);

router.post("/getPromoCode", getPromoCode);


module.exports = router;