var Orthanc = require('../model/Orthanc')

var orthancInstance = new Orthanc()

var getResults = async function (req, res) {
  await orthancInstance.putAet('self', 'Orthanc', 'localhost', '8042', 'Generic')
  const aets = await orthancInstance.getAvailableAet()
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(aets))
}

module.exports = { getResults }