const Database = require('../model/Database')
const Options = require('../model/Options')

var getResults = async function (req, res) {
  const body = req.body
  console.log(body)
  if ('hour' in body) {
    const database = await Database.getDatabase()
    const option = new Options(database)
    await option.setScheduleTime(body.hour, body.minutes)
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify('Done'))
  } else {
    res.render('options')
  }
}

module.exports = { getResults }
