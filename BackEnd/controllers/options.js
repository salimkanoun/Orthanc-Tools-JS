const Options = require('../model/Options')

var getResults = async function (req, res) {
  const option = new Options()

  if (req.method === 'PUT') {
    
    await option.setScheduleTime(req.body.hour, req.body.min)
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(true))

  } else if (req.method === 'GET') {

    await option.getOptions()
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ hour: option.hour, min: option.min }))

  }

}

module.exports = { getResults }
