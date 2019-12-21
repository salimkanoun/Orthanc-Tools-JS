var Orthanc = require('../model/Orthanc')

var orthancInstance = new Orthanc()

var getResults = async function (req, res) {
  const aets = await orthancInstance.getAvailableAet()
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(aets))
}

module.exports = { getResults }
