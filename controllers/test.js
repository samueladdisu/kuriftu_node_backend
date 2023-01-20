if (receivedData.action == 'calculatePrice') {
  let promo = '';
  let price = 0.00;
  let dbRack = 0.00;
  let dbWeekend = 0.00;
  let dbWeekdays = 0.00;
  let dbMember = 0.00;
  let arrayTemp = [];

  // Single occupancy rate
  let sRack = 0.00;
  let sWeekend = 0.00;
  let sWeekdays = 0.00;
  let sMember = 0.00;
  let cart = receivedData.data;

  cart.forEach(val => {
    let cartRoomType = val.room_acc;
    let ad = parseInt(val.adults);
    let kid = parseInt(val.kids);
    let teen = parseInt(val.teens);
    let location = val.room_location;

    let days = [];
    let start = new Date(val.checkin);
    let end = new Date(val.checkout);

    while (start < end) {
      days.push(start.toLocaleString('en-us', { weekday: 'long' }));
      start.setDate(start.getDate() + 1);
    }

    if (location === "Bishoftu") {
      const queryType = `SELECT * FROM room_type WHERE type_name = ${cartRoomType}`;
      const resultType = await connection.query(queryType);

      for (const rowType of resultType) {
        // double occupancy rate
        let typeLocation = rowType.type_location;
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
              price += calculatePrice(ad, kid, teen, sWeekend, dbWeekend, dbMember, sMember, promo);
              break;
            case "Saturday":
              price += calculatePrice(ad, kid, teen, sRack, dbRack, dbMember, sMember, promo);
              break;
            default:
              price += calculatePrice(ad, kid, teen, sWeekdays, dbWeekdays, dbMember, sMember, promo);
              break;
          }
        }
      }
    } else if (location === 'awash') {
      let Bored = val.reservationBoard;
      let query_type = `SELECT * FROM awash_price WHERE name = '${cartRoomType}'`;
      let result_type = await connection.query(query_type);

      let row_type = result_type[0];
      price = calculatePriceAwash(ad, kid, teen, Bored, days, row_type);
    } else if (location == 'entoto') {
      let query = `SELECT * FROM entoto_price WHERE name = '${cartRoomType}'`;
      let result_type;
      try {
        result_type = await connection.query(query);
      } catch (err) {
        console.log(err);
      }
      let row_type = result_type[0];
      let double = row_type.double_occ;
      let single = row_type.single_occ;

      for (let day of days) {
        if (cartRoomType == "Presidential Family Room") {
          price += calculatePreEntoto(kid, teen, double, promo);
        } else {
          price += calculateEntoto(ad, kid, teen, double, single, promo);
        }
      }
    } else if (location === "Lake tana") {
      const query = `SELECT * FROM tana_price WHERE name = '${cartRoomType}'`;
      const result_type = await connection.query(query);
      if (result_type.error) {
        return res.status(500).json({ error: result_type.error });
      }
      const row_type = result_type[0];
      const double = row_type.double_occ;
      const single = row_type.single_occ;

      days.forEach((day) => {
        price += calculateEntoto(ad, kid, teen, double, single, promo);
      });
    }
    arrayTemp.push(price);
    price = 0.00;


  })

}






