var Orthanc = require('../model/Orthanc')

var orthancInstance = new Orthanc()

var getResults = async function (req, res) {
  if (req.method === 'GET') {
    const aets = await orthancInstance.getAvailableAet()
    res.json(aets)
  } else if (req.method === 'POST') {
    const body = req.body
    //SK FRONT A FAIRE
    await orthancInstance.putAet(body.name, body.aetName, body.ip, body.port)
    res.json(true)
  }
}

module.exports = { getResults }
