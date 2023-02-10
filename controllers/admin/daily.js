const { dailyRes } = require("../../models/admin/daily");
const moment = require('moment-timezone');

exports.dailyRes =  (req, res) => {

  dailyRes()
    .then(result => {
      const dates = []
      result[0].forEach(item => {
        if (item.res_checkin !== null) {
          const checkin = moment.tz(item.res_checkin, "Africa/Addis_Ababa")
          const formattedDate = checkin.format('YYYY-MM-DD')
          
          dates.push(formattedDate)
        }
      });
      res.status(200).json(dates)
    })
    .catch(err => {
      console.log(err);
    })
}