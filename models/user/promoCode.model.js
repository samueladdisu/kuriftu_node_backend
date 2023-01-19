const db = require('../../util/db');

/**
 * 
 * @param {string} promo 
 * @returns promo code single row
 */

const getPromoCode = async (promo) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM promo WHERE promo_code = ? AND promo_active = 'yes' LIMIT 1`,
      [promo]
    );
    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getPromoCode
}