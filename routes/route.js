const express = require("express");
const {
  filterRoom,
  releaseRoom,
  holdRoom,
  tempRes,
  calculateRoomPrice,
  calculateBishoftu,
} = require("../controllers/user/rooms.controller");
const { getPromoCode } = require("../controllers/user/promo.controller");
const { registerCustomer } = require("../controllers/user/register.controller");
const {
  signupCustomers,
  loginCustomers,
} = require("../controllers/user/signup.controller");
const { verifyChapa } = require("../controllers/user/verification.controller");
const { dailyRes } = require("../controllers/admin/daily");

const router = express.Router();

// Use the Helmet middleware to set the Content-Security-Policy header

router.get("/", (req, res) => {
  res.send("Hello World!");
});
// frontend routes
router.get("/filterRoom", filterRoom);

router.post("/releaseRoom", releaseRoom);

router.post("/holdRoom", holdRoom);

router.post("/tempRes", tempRes);

router.post("/calculatePrice", calculateRoomPrice);
router.post("/getPromoCode", getPromoCode);
router.post("/registerCustomer", registerCustomer);
router.post("/signupMembers", signupCustomers);
router.post("/loginMembers", loginCustomers);

// verify payment

router.post("/verifyChapaReservation", verifyChapa);

// admin routes
router.get("/dailyRes", dailyRes);

module.exports = router;
