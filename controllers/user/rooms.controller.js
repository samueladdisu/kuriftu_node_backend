const { getAvailableRooms, releaseRoom, holdRoom, tempRes } = require('../../models/user/rooms.model');


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns sorted array by room_acc and room_location for website bookings
 */
exports.filterRoom = async (req, res) => {

  if (!req.query.checkin || !req.query.checkout || !req.query.location) return res.status(400).send("Bad Request")

  try {
    const rooms = await getAvailableRooms(req.query.checkin, req.query.checkout, req.query.location);

    let roomAcc_temp = '';
    let roomLocation = '';
    let dataCount = [];

    if (rooms.length > 0) {
      let merged_array = rooms;
      let data = []
      for (let key in merged_array) {
        if (roomAcc_temp === '' || roomLocation === '') {
          roomAcc_temp = merged_array[key]["room_acc"];
          roomLocation = merged_array[key]["room_location"];
          data.push(merged_array[key]);
        } else if (roomAcc_temp === merged_array[key]["room_acc"] && roomLocation === merged_array[key]["room_location"]) {
          data.push(merged_array[key]);
        } else if (roomAcc_temp !== merged_array[key]["room_acc"] || roomLocation !== merged_array[key]["room_location"]) {
          roomAcc_temp = merged_array[key]["room_acc"];
          roomLocation = merged_array[key]["room_location"];
          dataCount.push(data);
          data = [];
          data.push(merged_array[key]);
        }
      }

      if (data.length >= 1) {
        dataCount.push(data);
      }
      res.status(200).send(dataCount)
    } else {
      res.send({ msg: "No room available" });
    }
  } catch (error) {
    console.log(error);
  }

};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns msg if room is released
 */

exports.releaseRoom = async (req, res) => {
  if (!req.body.roomId) return res.status(400).send("Bad Request");

  try {
    const result = await releaseRoom(parseInt(req.body.roomId));
    if (result) {
      res.status(200).send({ msg: "Room released" });
    } else {
      res.status(400).send({ msg: "Room not released" });
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns holds room for 5 minutes
 */
exports.holdRoom = async (req, res) => {
  if (!req.body.roomId) return res.status(400).send("Bad Request");

  try {
    const result = await holdRoom(parseInt(req.body.roomId));
    if (result.msg === "Room holded") {
      res.status(200).send({ msg: "Room holded" });
    } else {
      res.status(400).send({ msg: "Room not holded", error: result });
    }

  } catch (error) {
    console.log(error);
  }

};


exports.tempRes = async (req, res) => {
  if (!req.body.data) return res.status(400).send("Bad Request");

  try {
    const result = await tempRes(req.body.data);
  } catch (error) {

  }
}

