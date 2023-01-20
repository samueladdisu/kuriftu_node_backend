const db = require('../../util/db');

/**
 * 
 * @param {string} promo the promo code
 * @param {int} price the price of the room tobe discounted
 * @returns the deducted price
 */

const getPromoCode = async (promo, price) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM promo WHERE promo_code = ? AND promo_active = 'yes' LIMIT 1`,
      [promo]
    );
    if (rows.length > 0) {
      const row = rows[0];

      // Store the id and usage of the promo code
      const PromoId = row['promo_id'];
      const usage = row['promo_usage'];

      // Check if the promo code has no expiration date and usage limit
      if (row['promo_time'] === null && row['promo_usage'] === null) {
        // Calculate the discount and the final price
        const Discount = price * (row['promo_amount'] / 100);
        let amt = price - Discount;
        // Return the final price
        return amt
      } else if (row['promo_time'] === null && row['promo_usage'] !== null) {
        // // Check if the usage limit is reached
        if (row['promo_usage'] === 0) {
          // Return that the promo code is expired
          return price
        } else {
          // Update the usage limit in the database
          const updated_usage = parseInt(usage - 1);
          await db.execute(`UPDATE promo SET promo_usage = ? WHERE promo_id = ?`, [updated_usage, PromoId]);

          // Calculate the discount and the final price
          const Discount = price * (row['promo_amount'] / 100);
          let amt = price - Discount;

          // Return the final price
          return amt
        }
      } else if (row['promo_time'] !== null && row['promo_usage'] === null) {
        const expireDate = new Date(row['promo_time']).getTime();
        const today = new Date().getTime();
        if (today >= expireDate) {
          return price
        } else {
          const Discount = price * (row['promo_amount'] / 100);
          let amt = price - Discount;
          return amt
        }
      } else if (row['promo_time'] !== null && row['promo_usage'] !== null) {
        const expireDate = new Date(row['promo_time']).getTime();
        const today = new Date().getTime();
        if (today < expireDate && usage !== 0) {
          const updated_usage = parseInt(usage - 1);
          await db.execute(`UPDATE promo SET promo_usage = ? WHERE promo_id = ?`, [updated_usage, PromoId]);
          const Discount = price * (row['promo_amount'] / 100);
          let amt = price - Discount;
          return amt
        } else {
          return price
        }
      }
    } else {
      return null;
    }
  } catch (error) {
    return error
  }
}

// getPromoCode("ddd", 1000).then((res) => {
//   console.log(res);
// }).catch((err) => {
//   console.log(err);
// });

module.exports = {
  getPromoCode
}