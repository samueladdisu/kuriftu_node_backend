const roomsModel = require('../models/rooms.model');

exports.filterRoom = async (req, res) => {
  const rooms = await roomsModel.filterRoom(req.query.checkin, req.query.checkout, req.query.location);

  console.log(req.query);
  res.send(rooms)
};
