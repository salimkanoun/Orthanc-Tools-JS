const Options = require('../model/Options')

var changeSchedule = async function (req, res) {
    await Options.setScheduleTime(req.body.hour, req.body.min)
    res.json(true)
  }
  
var getSchedule = async function (req, res) {
    const optionsValues = await Options.getOptions()
    res.json(optionsValues)
  }

module.exports = { changeSchedule, getSchedule }