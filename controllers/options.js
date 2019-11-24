let Database = require('../model/Database')
let Options = require('../model/Options')

var getResults = async function (req, res) {
  const body = req.body
  console.log(body)
  let database=await Database.getDatabase()
  let option=new Options(database)

  if('hour' in body){
    await option.setScheduleTime(body.hour, body.minutes)
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify("Done"))

  }else{
    await option.getOptions();
    res.render('options', {hour:option.hour, min:option.min})
  }

}

module.exports = { getResults }