async function applyPromoCode(promo, price) {
  try {
    const [rows] = await connection.execute(
      `SELECT * FROM promo WHERE promo_code = ? AND promo_active = 'yes' LIMIT 1`,
      [promo]
    );
    if (rows.length > 0) {
      const row = rows[0];
      const PromoId = row['promo_id'];
      const usage = row['promo_usage'];

      if (row['promo_time'] === null && row['promo_usage'] === null) {
        const Discount = price * (row['promo_amount'] / 100);
        return price - Discount;
      } else if (row['promo_time'] === null && row['promo_usage'] !== null) {
        if (row['promo_usage'] === 0) {
          return "Expired";
        } else {
          const updated_usage = parseInt(usage - 1);
          await connection.execute(`UPDATE promo SET promo_usage = ? WHERE promo_id = ?`, [updated_usage, PromoId]);
          const Discount = price * (row['promo_amount'] / 100);
          return price - Discount;
        }
      } else if (row['promo_time'] !== null && row['promo_usage'] === null) {
        const expireDate = new Date(row['promo_time']).getTime();
        const today = new Date().getTime();
        if (today >= expireDate) {
          return "Expired";
        } else {
          const Discount = price * (row['promo_amount'] / 100);
          return price - Discount;
        }
      } else if (row['promo_time'] !== null && row['promo_usage'] !== null) {
        const expireDate = new Date(row['promo_time']).getTime();
        const today = new Date().getTime();
        if (today < expireDate && usage !== 0) {
          const updated_usage = parseInt(usage - 1);
          await connection.execute(`UPDATE promo SET promo_usage = ? WHERE promo_id = ?`, [updated_usage, PromoId]);
          const Discount = price * (row['promo_amount'] / 100);
          return price - Discount;
        } else {
          return "Promo code expired";
        }
      }
    } else {
      return "Invalid Promo code";
    }
  } catch (error) {
    console.log(error);
  } finally {
    connection.end();
  }
}