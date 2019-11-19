let Database = require('../model/Database')
let Options = require('../model/Options')

var getResults = async function (req, res) {
  const body = req.body
  console.log(body)
  if('hour' in body){
    let database=Database.getDatabase()
    let option=new Options(database)
    await option.setScheduleTime(body.hour, body.minutes)
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify("Done"))

  }else{
    res.render('options')
  }

}

module.exports = { getResults }