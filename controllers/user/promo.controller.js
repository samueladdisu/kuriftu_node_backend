const { getPromoCode } = require("../../models/user/promoCode.model");
const db = require("../../util/db");

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @returns price after discount
 */

exports.getPromoCode = async (req, res) => {
  // Check if the request body contains both the promo code and the price
  if (!req.body.promo || !req.body.price) return res.status(400).send("Bad Request");

  // Store the price in a variable
  const price = req.body.price;
  try {

    // Get the promo code from the database
    const row = await getPromoCode(req.body.promo);

    if (row) {

      // Store the id and usage of the promo code
      const PromoId = row['promo_id'];
      const usage = row['promo_usage'];

      // Check if the promo code has no expiration date and usage limit
      if (row['promo_time'] === null && row['promo_usage'] === null) {
        // Calculate the discount and the final price
        const Discount = price * (row['promo_amount'] / 100);
        let amt = price - Discount;
        // Return the final price
        res.status(200).send({ amt: amt });
      } else if (row['promo_time'] === null && row['promo_usage'] !== null) {
        // // Check if the usage limit is reached
        if (row['promo_usage'] === 0) {
          // Return that the promo code is expired
          res.status(200).send({ msg: "promo code expired 0" });
        } else {
          // Update the usage limit in the database
          const updated_usage = parseInt(usage - 1);
          await db.execute(`UPDATE promo SET promo_usage = ? WHERE promo_id = ?`, [updated_usage, PromoId]);

          // Calculate the discount and the final price
          const Discount = price * (row['promo_amount'] / 100);
          let amt = price - Discount;

          // Return the final price
          res.status(200).send({ amt: amt });
        }
      } else if (row['promo_time'] !== null && row['promo_usage'] === null) {
        const expireDate = new Date(row['promo_time']).getTime();
        const today = new Date().getTime();
        if (today >= expireDate) {
          res.status(200).send({ msg: "promo code expired 1" });
        } else {
          const Discount = price * (row['promo_amount'] / 100);
          let amt = price - Discount;
          res.status(200).send({ amt: amt });
        }
      } else if (row['promo_time'] !== null && row['promo_usage'] !== null) {
        const expireDate = new Date(row['promo_time']).getTime();
        const today = new Date().getTime();
        if (today < expireDate && usage !== 0) {
          const updated_usage = parseInt(usage - 1);
          await db.execute(`UPDATE promo SET promo_usage = ? WHERE promo_id = ?`, [updated_usage, PromoId]);
          const Discount = price * (row['promo_amount'] / 100);
          let amt = price - Discount;
          res.status(200).send({ amt: amt });
        } else {
          res.status(200).send({ msg: "promo code expired 2" });
        }
      }

    } else {
      res.status(200).send({ msg: "No promo code found" });
    }
  } catch (error) {
    console.log(error);
  }
}