const {
  getAvailableRooms,
  releaseRoom,
  holdRoom,
  tempRes,
  getBishoftuPrice,
  getAwashPrice,
  getEntotoPrice,
  getTanaPrice,
} = require("../../models/user/rooms.model");

const {
  calculatePrice,
  calculateLoft,
  calculatePre,
  calculatePriceAwash,
  calculatePreEntoto,
  calculateEntoto,
} = require("../../util/helperFunctions");

// form validation library

const Joi = require("joi");

const schema = Joi.object().keys({
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  phoneNumber: Joi.string()
    .regex(/^\+\d{10,}$/)
    .required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  country: Joi.string().required(),
  address: Joi.string().min(10).max(100).required(),
  promocode: Joi.string().min(0).max(6).optional(),
  city: Joi.string().required(),
  specialRequest: Joi.string().min(0).max(200).optional(),
  zip: Joi.string()
    .regex(/^\d{5}$/)
    .required(),
  paymentMethod: Joi.string().max(30).required(),
  price: Joi.number().required(),
  userGID: Joi.string().max(8).required(),
  roomId: Joi.string().required(),
  guestInfo: Joi.string().required(),
  roomAcc: Joi.string().required(),
  roomLocation: Joi.string().required(),
  cincoutInfo: Joi.string().required(),
  tempBoard: Joi.string().required(),
  roomNo: Joi.string().required(),
});

/**
 *
 * @route GET /filterRoom?checkin={}&checkout={}&location={}
 * @param {*} req
 * @param {*} res
 * @returns sorted array by room_acc and room_location for website bookings
 */
exports.filterRoom = async (req, res) => {
  if (!req.query.checkin || !req.query.checkout || !req.query.location)
    return res.status(400).send("Bad Request");

  try {
    const rooms = await getAvailableRooms(
      req.query.checkin,
      req.query.checkout,
      req.query.location
    );

    var roomAcc_temp = "";
    var roomLocation = "";
    var dataCount = [];

    if (rooms.length > 0) {
      var merged_array = rooms;
      var data = [];
      for (var key in merged_array) {
        if (roomAcc_temp === "" || roomLocation === "") {
          roomAcc_temp = merged_array[key]["room_acc"];
          roomLocation = merged_array[key]["room_location"];
          data.push(merged_array[key]);
        } else if (
          roomAcc_temp === merged_array[key]["room_acc"] &&
          roomLocation === merged_array[key]["room_location"]
        ) {
          data.push(merged_array[key]);
        } else if (
          roomAcc_temp !== merged_array[key]["room_acc"] ||
          roomLocation !== merged_array[key]["room_location"]
        ) {
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
      res.status(200).send(dataCount);
    } else {
      res.send({ msg: "No room available" });
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 * @route POST /releaseRoom
 * @param {*} req req.body.roomId
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
 * @route POST /holdRoom
 * @param {*} req req.body.roomId
 * @param {*} res
 * @returns holds room for 5 minutes
 */
exports.holdRoom = async (req, res) => {
  console.log(req.body.roomId);
  if (!req.body.roomId) return res.status(400).send("Hold Bad Request");

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

/**
 *
 * @route POST /tempRes
 * @param {Reques} req req.body.data
 * @param {Response} res
 * @returns
 * @description temporary reservation until payment is confirmed
 * @todo add payment confirmation
 * @todo add email confirmation
 */

exports.tempRes = async (req, res) => {
  if (!req.body.regesterObject) return res.status(400).send("Bad Request");

  const { error } = schema.validate(req.body.regesterObject);
  console.log("here in oiu");
  console.log(req.body.regesterObject);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    try {
      const result = await tempRes(req.body.regesterObject);
      return res.status(200).send("success Regesterd");
    } catch (error) {
      return res.status(500).send(error);
    }
  }
};

exports.calculateRoomPrice = async (req, res) => {
  console.log(req.body.cart);
  if (!req.body.cart) return res.status(400).send("Bad Request");
  const cart = req.body.cart;

  try {
    var promo = "";
    var price = 0.0;
    var dbRack = 0.0;
    var dbWeekend = 0.0;
    var dbWeekdays = 0.0;
    var dbMember = 0.0;
    var arrayTemp = [];

    // Single occupancy rate
    var sRack = 0.0;
    var sWeekend = 0.0;
    var sWeekdays = 0.0;
    var sMember = 0.0;

    for (const val of cart) {
      var cartRoomType = val.room_acc;
      var ad = parseInt(val.adults);
      var kid = parseInt(val.kids);
      var teen = parseInt(val.teens);
      var location = val.room_location;

      var days = [];
      var start = new Date(val.checkin);
      var end = new Date(val.checkout);

      while (start < end) {
        days.push(start.toLocaleString("en-us", { weekday: "long" }));
        start.setDate(start.getDate() + 1);
      }

      if (location === "Bishoftu") {
        const resultType = await getBishoftuPrice(cartRoomType);

        for (const rowType of resultType) {
          // double occupancy rate
          var typeLocation = rowType.type_location;
          dbRack = parseFloat(rowType.d_rack_rate);
          dbWeekend = parseFloat(rowType.d_weekend_rate);
          dbWeekdays = parseFloat(rowType.d_weekday_rate);
          dbMember = parseFloat(rowType.d_member_rate);

          // Single occupancy rate
          sRack = parseFloat(rowType.s_rack_rate);
          sWeekend = parseFloat(rowType.s_weekend_rate);
          sWeekdays = parseFloat(rowType.s_weekday_rate);
          sMember = parseFloat(rowType.s_member_rate);
        }

        for (const day of days) {
          if (cartRoomType === "Loft Family Room") {
            price += calculateLoft(kid, teen, dbRack, dbMember, promo);
          } else if (cartRoomType === "Presidential Suite Family Room") {
            switch (day) {
              case "Friday":
                price += calculatePre(kid, teen, dbWeekend, dbMember, promo);
                break;
              case "Saturday":
                price += calculatePre(kid, teen, dbRack, dbMember, promo);
                break;
              default:
                price += calculatePre(kid, teen, dbWeekdays, dbMember, promo);
                break;
            }
          } else {
            switch (day) {
              case "Friday":
                price += calculatePrice(
                  ad,
                  kid,
                  teen,
                  sWeekend,
                  dbWeekend,
                  dbMember,
                  sMember,
                  promo
                );
                break;
              case "Saturday":
                price += calculatePrice(
                  ad,
                  kid,
                  teen,
                  sRack,
                  dbRack,
                  dbMember,
                  sMember,
                  promo
                );
                break;
              default:
                price += calculatePrice(
                  ad,
                  kid,
                  teen,
                  sWeekdays,
                  dbWeekdays,
                  dbMember,
                  sMember,
                  promo
                );
                break;
            }
          }
        }
      } else if (location === "awash") {
        var Bored = val.reservationBoard;
        var result_type = await getAwashPrice(cartRoomType);

        var row_type = result_type[0];
        price = calculatePriceAwash(ad, kid, teen, Bored, days, row_type);
      } else if (location == "entoto") {
        var result_type = await getEntotoPrice(cartRoomType);

        var row_type = result_type[0];
        var double = row_type.double_occ;
        var single = row_type.single_occ;

        for (var day of days) {
          if (cartRoomType == "Presidential Family Room") {
            price += calculatePreEntoto(kid, teen, double, promo);
          } else {
            price += calculateEntoto(ad, kid, teen, double, single, promo);
          }
        }
      } else if (location === "Lake tana") {
        const result_type = await getTanaPrice(cartRoomType);
        const row_type = result_type[0];
        const double = row_type.double_occ;
        const single = row_type.single_occ;

        days.forEach((day) => {
          price += calculateEntoto(ad, kid, teen, double, single, promo);
        });
      }
      arrayTemp.push(price);
      price = 0.0;
    }
    res.status(200).send({ price: arrayTemp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
