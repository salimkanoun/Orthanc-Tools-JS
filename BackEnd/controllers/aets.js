var Orthanc = require('../model/Orthanc')

var orthancInstance = new Orthanc()

var getResults = async function (req, res) {
  if (req.method === 'GET') {
    const aets = await orthancInstance.getAvailableAet()
    res.json(aets)
  } else if (req.method === 'POST') {
    const body = req.body

    await orthancInstance.putAet(body.name, body.aetName, body.ip, parseInt(body.port), body.manufacturer)
    res.json(true)
  }
}

module.exports = { getResults }
