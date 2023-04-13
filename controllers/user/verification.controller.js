const db = require("../../util/db");
const axios = require("axios");

const moment = require("moment-timezone");

const generateRandomString = (length) => {
  // const length = 7;
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

exports.verifyChapa = async (req, res) => {
  const chapaInData = req.body.tx_ref;

  const chapadata = req.body;

  if (chapadata && chapadata.customization) {
    const title = chapadata.customization.title
      ? chapadata.customization.title
      : null;

    if (title == "Room Reservation") {
      const options = {
        method: "GET",
        url: `https://api.chapa.co/v1/transaction/verify/${chapaInData}`,
        headers: {
          Authorization: `Bearer CHASECK_TEST-VM0KvvHoIwBskJef7GRRiyJjO4QfKTiy`,
        },
      };

      try {
        const response = await axios(options);
        const verChapa = response.data;
        console.log("Verification Finished");

        if (verChapa.status === "success") {
          try {
            const [temp_res] = await db.execute(
              "SELECT * FROM temp_res WHERE userGID = ?",
              [chapaInData]
            );
            const temp_row = temp_res[0];
            console.log(temp_row);
            var {
              firstName,
              lastName,
              email,
              resAddress: address,
              city,
              country,
              phoneNum: phonNum,
              zipCode,
              specialRequest: specReq,
              promoCode,
              total,
              cart: cart2,
              created_at,
              paymentMethod: PayMethod,
            } = temp_row;
            var payment_confirmed_at = new Date()
              .toISOString()
              .slice(0, 19)
              .replace("T", " ");

            var room_ids = JSON.parse(temp_row.room_id);
            var guestInfos = JSON.parse(temp_row.guestInfo);
            var room_nums = JSON.parse(temp_row.room_num);
            var room_accs = JSON.parse(temp_row.room_acc);
            var room_locs = JSON.parse(temp_row.room_location);
            var CiCos = JSON.parse(temp_row.CinCoutInfo);
            var board = JSON.parse(temp_row.temp_board);
            var res_confirmID = generateRandomString(5);
          } catch (error) {
            console.log("error Fetching");
            console.log(error);
          }
        }

        var numOfRooms = room_ids.length;
        let i = 0;
        var carts = [];
        var oldCI = "";
        var oldCO = "";

        while (i < numOfRooms) {
          try {
            const response = await db.execute(
              `SELECT room_price from rooms WHERE room_id = ?`,
              [room_ids[i]]
            );
            var row = response[0];

            var oneReservation = {
              Checkin: CiCos[i][0],
              Checkout: CiCos[i][1],
              room_id: room_ids[i],
              adults: guestInfos[i][0],
              teens: guestInfos[i][1],
              kids: guestInfos[i][2],
              room_number: room_nums[i],
              room_acc: room_accs[i],
              room_location: room_locs[i],
              guestnums: [guestInfos[i][0], guestInfos[i][1], guestInfos[i][2]],
              room_price: row.room_price,
              res_board: board[i],
            };

            carts.push(oneReservation);
          } catch (error) {
            console.error(err);
          }
          i++;
        }

        const cartStringify = JSON.stringify(carts);
        console.log(carts);
        for (let value of carts) {
          var guestNums = JSON.stringify(value.guestnums);
          var nowCI = new Date(value.Checkin).getTime();
          var nowCO = new Date(value.Checkout).getTime();

          if (
            nowCI !== oldCI ||
            nowCO !== oldCO ||
            (oldCI === "" && oldCO === "")
          ) {
            try {
              const anotherRespo = await db.execute(
                "INSERT INTO reservations(res_firstname, res_lastname, res_phone, res_email, res_checkin, res_checkout, res_country, res_address, res_city, res_zipcode, res_paymentMethod, res_roomIDs, res_price, res_location, res_confirmID, res_specialRequest, res_guestNo, res_agent, res_cart, res_roomType, res_roomNo, created_at, payment_confirmed_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                  firstName,
                  lastName,
                  phonNum,
                  email,
                  value.Checkin,
                  value.Checkout,
                  country,
                  address,
                  city,
                  zipCode,
                  PayMethod,
                  value.room_id,
                  total.toFixed(2),
                  value.room_location,
                  res_confirmID,
                  specReq,
                  guestNums,
                  "website",
                  cartStringify,
                  value.room_acc,
                  value.room_number,
                  created_at,
                  payment_confirmed_at,
                ]
              );
              console.log(`Reservation added with ID ${anotherRespo.insertId}`);
            } catch (err) {
              console.log(err);
            }

            oldCI = nowCI;
            oldCO = nowCO;
          }

          try {
            var [lastRecordRows] = await db.execute(
              "SELECT * FROM reservations WHERE res_confirmID = ?",
              [res_confirmID]
            );
            var row = lastRecordRows[0];

            var resId = row.res_id;
            console.log("Successfully booked rooms");
          } catch (error) {
            console.error("Error while booking rooms", error);
          }
        }
        for (const value of carts) {
          var [bookedResult] = await db.execute(
            "INSERT INTO booked_rooms(b_res_id, b_roomId, b_roomType, b_roomLocation, b_checkin, b_checkout) VALUES (?, ?, ?, ?, ?, ?)",
            [
              resId,
              value.room_id,
              value.room_acc,
              value.room_location,
              value.Checkin,
              value.Checkout,
            ]
          );
          const [guestInfoResult] = await db.execute(
            "INSERT INTO guest_info(info_res_id, info_adults, info_kids, info_teens, info_room_id, info_room_number, info_room_acc, info_room_location, info_board) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              resId,
              value.adults,
              value.kids,
              value.teens,
              value.room_id,
              value.room_number,
              value.room_acc,
              value.room_location,
              value.res_board,
            ]
          );
          const [statusResult] = await db.execute(
            'UPDATE rooms SET room_status = "booked" WHERE room_id = ?',
            [value.room_id]
          );
        }
        try {
          await db.execute("DELETE FROM temp_res WHERE userGID = ?", [
            chapaInData,
          ]);
          console.log("DELETED");
          res.send(200);
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
