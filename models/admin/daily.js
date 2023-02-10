const db = require("../../util/db")

exports.dailyRes = () => {
  let today = new Date().toISOString().slice(0, 10)
  console.log(today) // output: '2022-12-31'

  return db.execute(
    `SELECT * FROM reservations WHERE res_checkin = ?`, [today]
  )
}
