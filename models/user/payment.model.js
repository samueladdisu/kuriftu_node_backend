const db = require("../../util/db");
const axios = require("axios");
const config = require("../../config");

exports.chapaPayment = async (guestCur, guestInfo, price) => {
  const configs = {
    headers: {
      Authorization: "Bearer ".config.ChapaSEC,
      "Content-Type": "application/json",
    },
  };

  const data = {
    amount: guestInfo.price,
    currency: guestCur,
    email: guestInfo.email,
    first_name: guestInfo.firstName,
    last_name: guestInfo.lastName,
    phone_number: guestInfo.phoneNumber,
    tx_ref: guestInfo.userGID,
    callback_url: "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
    return_url: "https://www.google.com/",
    "customization[title]": "Payment for my favourite merchant",
    "customization[description]": "I love online payments",
  };

  await axios
    .post("https://api.chapa.co/v1/transaction/initialize", data, configs)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};
