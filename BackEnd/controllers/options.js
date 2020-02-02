const Options = require('../model/Options')

var getResults = async function (req, res) {
  const option = new Options()

  if (req.method === 'PUT') {
    await option.setScheduleTime(req.body.hour, req.body.min)
    res.json(true)
  } else if (req.method === 'GET') {
    const optionsValues = await option.getOptions()
    res.json(optionsValues)
  }
}

module.exports = { getResults }
