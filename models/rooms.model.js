const db = require('../util/db');

const filterRoom = async (checkin, checkout, location) => {
  try {
    const result = await db.query(`SELECT rooms.*
    FROM rooms
    LEFT JOIN booked_rooms
    ON rooms.room_id = booked_rooms.b_roomId
    AND ((? >= b_checkin AND ? < b_checkout)
        OR (? > b_checkin AND ? <= b_checkout)
        OR (? <= b_checkin AND ? >= b_checkout))
    WHERE booked_rooms.b_roomId IS NULL
    AND room_location = ? AND room_status NOT IN (?, ?) ORDER BY room_acc;`, [checkin, checkin, checkout, checkout, checkin, checkout, location, 'Hold', 'bishoftu_hold']);
    return result[0];
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  filterRoom
}