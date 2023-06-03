const db = require("../../util/db");
const axios = require("axios");
const config = require("../../config");
var request = require("request");

const changetoETB = async (price) => {
  var newPrice = 0;
  try {
    const [rows] = await db.execute(
      `SELECT * FROM convertusd WHERE dateUpdated = CURDATE()`
    );
    if (rows.length > 0) {
      console.log(rows);
      newPrice = rows[0].rate * price;
      return newPrice;
    } else {
      const headers = {
        "Content-Type": "text/plain",
        apikey: "m8pYh6zWnmUXPvxwRTVbrtqNtOqvR2xD",
      };

      const url =
        "https://api.apilayer.com/currency_data/convert?to=ETB&from=USD&amount=1";

      axios
        .get(url, { headers })
        .then((response) => response.data.result)
        .then(async (result) => {
          ETBPrice = result;
          newPrice = price * ETBPrice;
          const update = await db.execute(
            `UPDATE convertusd SET dateUpdated = CURDATE(), rate = ? WHERE rate_id = 1`,
            [ETBPrice]
          );
          return newPrice;
        })
        .catch((error) => error);
    }
  } catch (error) {
    
    return error;
  }
};

const chapaPayment = async (guestCur, guestInfo, price) => {
  const config = {
    headers: {
      Authorization: "Bearer CHASECK_TEST-VM0KvvHoIwBskJef7GRRiyJjO4QfKTiy",
      "Content-Type": "application/json",
    },
  };

  const data = {
    amount: price,
    currency: guestCur,
    email: guestInfo.email,
    first_name: guestInfo.firstName,
    last_name: guestInfo.lastName,
    phone_number: guestInfo.phoneNumber,
    tx_ref: guestInfo.userGID,
    // callback_url: "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
    return_url: "https://kurifturesorts.com/",
    "customization[title]": "Room Reservation",
    "customization[description]": "I love online payments",
  };

  try {
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      data,
      config
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("error here ...");
    console.log(error);
    return error;
  }
};

module.exports = {
  chapaPayment,
  changetoETB,
};
