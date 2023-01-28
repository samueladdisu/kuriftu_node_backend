const db = require('../../util/db');

exports.dailyRes = async () => {
  let today = new Date().toISOString().slice(0, 10);
  console.log(today); // output: '2022-12-31'

  try {
    const result = await db.execute(`SELECT * FROM reservations WHERE res_checkin = '2023-01-25'`);
    return result[0];
  } catch (error) {
    return error
  }
}