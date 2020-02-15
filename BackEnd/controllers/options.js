const Options = require('../model/Options')

var getResults = async function (req, res) {
  if (req.method === 'PUT') {
    await Options.setScheduleTime(req.body.hour, req.body.min)
    res.json(true)
  } else if (req.method === 'GET') {
    const optionsValues = await Options.getOptions()
    res.json(optionsValues)
  }
}

module.exports = { getResults }
