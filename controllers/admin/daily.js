const { dailyRes } = require("../../models/admin/daily");

exports.dailyRes = async (req, res) => {
  try {
    const result = await dailyRes()
    const dates = []
    result.forEach(item => {
      dates.push(item.res_checkin)
      
    });

    res.status(200).json(dates)
  } catch (error) {
    console.log(error);
  }
}