const { getPromoCode } = require("../../models/user/promoCode.model");
const db = require("../../util/db");

/**
 *
 * @route POST /getPromoCode
 * @param {Request} req req.body.promo & req.body.price
 * @param {Response} res
 * @returns price after discount or price if promo code is expired
 */

exports.getPromoCode = async (req, res) => {
  console.log(!req.body.promo, req.body.price);
  // Check if the request body contains both the promo code and the price
  if (!req.body.promo || !req.body.price)
    return res.status(400).send("Bad Request");

  // Store the price in a variable
  const promo = req.body.promo;
  const price = +req.body.price;

  // console.log(typeof price);r

  try {
    // Get the promo code from the model
    const row = await getPromoCode(promo, price);

    // console.log(row);
    if (row === null)
      return res.status(202).send({ msg: "promo code not found" });
    res.status(200).send({ price: row });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error });
  }
};
