const db = require("../../util/db");
const axios = require("axios");
const {
  chapaPayment,
  changetoETB,
} = require("../../models/user/payment.model");

/**
 *
 * @route POST /getPromoCode
 * @param {Request} req req.body.form, req.body.cart & req.body.total
 * @param {Response} res
 * @returns url for the payment method selected
 */

const generateRandomString = (length) => {
  // const length = 7;
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
exports.registerCustomer = async (req, res) => {
  if (!req.body.form || !req.body.cart || !req.body.total)
    return res.status(400).send("Bad Request");
  var priceContainer = [];
  var totalPrice = 0.0;
  // step 1 calculate price
  try {
    const response = await axios.post("http://localhost:4000/calculatePrice", {
      cart: req.body.cart,
    });
    priceContainer = response.data;
    console.log(priceContainer);

    totalPrice = priceContainer.price.reduce(function (a, b) {
      return a + b;
    }, 0);
    console.log("Sum is " + totalPrice); // printing the sum
    // console.log(req.body.form);
    // step 2 use promo if there is one and update price
    if (req.body.form.guestPromo !== "") {
      try {
        const responsepromo = await axios.post(
          "http://localhost:4000/getPromoCode",
          {
            promo: req.body.form.guestPromoCode,
            price: totalPrice,
          }
        );
        totalPrice = responsepromo.data;
        console.log("price updated", responsepromo.data);
      } catch (error) {
        console.error("promo error");
        res.status(500).send("Promo Error");
      }
    }

    let id = [];
    let guestInfoAll = [];
    let roomNum = [];
    let roomAcc = [];
    let roomLoca = [];
    let CinCoutInfo = [];
    let CICOAll = [];
    let boardeArr = [];

    req.body.cart.forEach((val) => {
      id.push(val.room_id);
      let guestInfo = [val.adults, val.teens, val.kids];
      guestInfoAll.push(guestInfo);
      roomNum.push(val.room_number);
      roomAcc.push(val.room_acc);
      roomLoca.push(val.room_location);
      CinCoutInfo = [val.checkin, val.checkout];
      CICOAll.push(CinCoutInfo);
      boardeArr.push(val.reservationBoard);
    });

    const timezone = "Africa/Addis_Ababa";
    const date = new Date().toLocaleString("en-US", { timeZone: timezone });
    const roomID = JSON.stringify(id);
    const guestInfoAlls = JSON.stringify(guestInfoAll);
    const roomNums = JSON.stringify(roomNum);
    const roomAccs = JSON.stringify(roomAcc);
    const roomLocas = JSON.stringify(roomLoca);
    const CICOAlls = JSON.stringify(CICOAll);
    const boardeArrs = JSON.stringify(boardeArr);

    const created_at = new Date().toISOString();

    const obj = req.body.form;
    const updatedObj = {};

    updatedObj["firstName"] = obj["guestFirstName"];
    updatedObj["lastName"] = obj["guestLastName"];
    updatedObj["phoneNumber"] = obj["guestPhoneNum"];
    updatedObj["email"] = obj["guestEmail"];
    updatedObj["country"] = obj["guestCountry"];
    updatedObj["address"] = obj["guestAddress"];
    updatedObj["city"] = obj["guestCity"];
    updatedObj["zip"] = obj["guestZip"];
    updatedObj["paymentMethod"] = obj["guestPaymentMethod"];
    updatedObj["specialRequest"] = obj["guestSpecialRequest"];
    updatedObj["promocode"] = obj["guestPromo"];
    updatedObj["price"] = totalPrice;
    updatedObj["userGID"] = generateRandomString(7);
    updatedObj["roomId"] = roomID;
    updatedObj["guestInfo"] = guestInfoAlls;
    updatedObj["roomAcc"] = roomAccs;
    updatedObj["roomLocation"] = roomLocas;
    updatedObj["cincoutInfo"] = CICOAlls;
    updatedObj["tempBoard"] = boardeArrs;
    updatedObj["roomNo"] = roomNums;

    try {
      const responseRegister = await axios.post(
        "http://localhost:4000/tempRes",
        {
          regesterObject: updatedObj,
        }
      );

      console.log("Registerd Response ", responseRegister.data);

      if (
        req.body.form.guestPaymentMethod == "helloCash" ||
        req.body.form.guestPaymentMethod == "amole" ||
        req.body.form.guestPaymentMethod == "telebirr" ||
        req.body.form.guestPaymentMethod == "Abisinya"
      ) {
        try {
          const answer = await changetoETB(totalPrice);
          console.log("NEW Price", answer);
          totalPrice = answer.toFixed(2);
        } catch (error) {
          res.status(500).send("Convertion To ETB Error Please Try again");
        }
      }

      if (req.body.form.guestPaymentMethod == "credit") {
        try {
          const respo = await chapaPayment("USD", updatedObj, totalPrice);
          res.status(200).send(respo);
        } catch (error) {
          res.status(500).send("Payment Error");
        }
      } else if (req.body.form.guestPaymentMethod == "amole") {
        try {
          const respo = await chapaPayment("ETB", updatedObj, totalPrice);
          res.status(200).send(respo);
        } catch (error) {
          res.status(500).send("Payment Error");
        }
      } else if (req.body.form.guestPaymentMethod == "helloCash") {
        try {
          const respo = await chapaPayment("ETB", updatedObj, totalPrice);
          res.status(200).send(respo);
        } catch (error) {
          res.status(500).send("Payment Error");
        }
      } else if (req.body.form.guestPaymentMethod == "telebirr") {
      } else if (req.body.form.guestPaymentMethod == "paypal") {
        try {
          const respo = await chapaPayment("USD", updatedObj, totalPrice);
          res.status(200).send(respo);
        } catch (error) {
          res.status(500).send("Payment Error");
        }
      } else if (req.body.form.guestPaymentMethod == "Abisinya") {
        try {
          const respo = await chapaPayment("ETB", updatedObj, totalPrice);
          res.status(200).send(respo);
        } catch (error) {
          res.status(500).send("Payment Error");
        }
      } else {
        console.log("here not payed");
        res.status(400).send("payment selected error");
      }
    } catch (error) {
      console.error("Validation Error");
      res.status(500).send("Validation Error");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Invalid Cart");
  }


};

// module.exports = {
//   generateRandomString,
// };
