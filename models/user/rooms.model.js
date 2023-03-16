const db = require("../../util/db");
const moment = require("moment-timezone");

/**
 *
 * @param {date} checkin
 * @param {date} checkout
 * @param {string} location
 * @returns Array of available rooms for website bookings
 */

const getAvailableRooms = async (checkin, checkout, location) => {
  try {
    const rows = await db.query(
      `SELECT rooms.*
    FROM rooms
    LEFT JOIN booked_rooms
    ON rooms.room_id = booked_rooms.b_roomId
    AND ((? >= b_checkin AND ? < b_checkout)
        OR (? > b_checkin AND ? <= b_checkout)
        OR (? <= b_checkin AND ? >= b_checkout))
    WHERE booked_rooms.b_roomId IS NULL
    AND room_location = ? AND room_status NOT IN (?, ?) ORDER BY room_acc;`,
      [
        checkin,
        checkin,
        checkout,
        checkout,
        checkin,
        checkout,
        location,
        "Hold",
        "bishoftu_hold",
      ]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 * @param {int} roomId of the room to be released
 * @returns boolean true if room is released
 */

const releaseRoom = async (roomId) => {
  try {
    const result = await db.execute(
      `UPDATE rooms SET room_status = 'Not_booked' WHERE room_id = ?`,
      [roomId]
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 * @param {int} roomId of the room to be hold
 * @returns boolean [true, true] if room is hold and event is created
 * @description hold room for 30 seconds
 */

const holdRoom = async (roomId) => {
  try {
    const result = await db.execute(
      `UPDATE rooms SET room_status = 'Hold' WHERE room_id = ?`,
      [roomId]
    );

    // let name = `Room_ID_${roomId}_Hold`;

    // const eventSql = `CREATE EVENT IF NOT EXISTS ${name} ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL  30 SECOND DO UPDATE rooms SET room_status = 'Not_booked' WHERE room_id = ${roomId}`;

    // const event = await db.query(eventSql);

    return { msg: "Room holded" };
  } catch (error) {
    console.log(error);
    return error;
  }
};

/**
 *
 * @param {object} data contains all the data to be inserted into temp_res table
 * @returns boolean true if data is inserted
 * @description insert guest data into temp_res table
 */
const tempRes = async (data) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    country,
    address,
    city,
    zip,
    paymentMethod,
    price,
    specialRequest,
    userGID,
    promocode,
    roomId,
    guestInfo,
    roomNo,
    roomAcc,
    roomLocation,
    cincoutInfo,
    tempBoard,
  } = data; // destructure data

  try {
    const createdAt = moment().format("YYYY-MM-DD hh:mm:ss A");
    const result = await db.execute(
      `INSERT INTO temp_res(firstName, lastName, phoneNum, email, country, resAddress, city, zipCode, paymentMethod, total, specialRequest, userGID, promoCode, room_id, guestInfo, room_num, room_acc, room_location, CinCoutInfo, temp_board, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        phoneNumber,
        email,
        country,
        address,
        city,
        zip,
        paymentMethod,
        price,
        specialRequest,
        userGID,
        promocode,
        roomId,
        guestInfo,
        roomNo,
        roomAcc,
        roomLocation,
        cincoutInfo,
        tempBoard,
        createdAt,
      ]
    );

    return true;
  } catch (error) {
    return error;
  }
};

/**
 *
 * @param {string} roomType Bishoftu room type
 * @returns row of the room type
 */

const getBishoftuPrice = async (roomType) => {
  try {
    const result = await db.execute(
      `SELECT * FROM room_type WHERE type_name = ?`,
      [roomType]
    );
    return result[0];
  } catch (error) {
    return error;
  }
};

/**
 *
 * @param {string} roomType Awash room type
 * @returns row of the room type
 */

const getAwashPrice = async (roomType) => {
  try {
    const result = await db.execute(
      `SELECT * FROM awash_price WHERE name = ?`,
      [roomType]
    );
    return result[0];
  } catch (error) {
    return error;
  }
};

/**
 *
 * @param {string} roomType Entoto room type
 * @returns row of the room type
 */

const getEntotoPrice = async (roomType) => {
  try {
    const result = await db.execute(
      `SELECT * FROM entoto_price WHERE name = ?`,
      [roomType]
    );
    return result[0];
  } catch (error) {
    return error;
  }
};

/**
 *
 * @param {string} roomType Tana room type
 * @returns row of the room type
 */

const getTanaPrice = async (roomType) => {
  try {
    const result = await db.execute(`SELECT * FROM tana_price WHERE name = ?`, [
      roomType,
    ]);
    return result[0];
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAvailableRooms,
  getBishoftuPrice,
  getAwashPrice,
  getEntotoPrice,
  getTanaPrice,
  releaseRoom,
  holdRoom,
  tempRes,
};
