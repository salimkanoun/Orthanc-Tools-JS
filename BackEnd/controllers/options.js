const Database = require('../model/Database')
const Options = require('../model/Options')

var getResults = async function (req, res) {
  const body = req.body
  console.log(body)
  const database = await Database.getDatabase()
  const option = new Options(database)

  if ('hour' in body) {
    await option.setScheduleTime(body.hour, body.minutes)
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify('Done'))
  } else {
    await option.getOptions()
    res.render('options', { hour: option.hour, min: option.min })
  }
}

module.exports = { getResults }
