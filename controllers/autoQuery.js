var Orthanc = require('../model/Orthanc')

var orthancInstance = new Orthanc()

var getResults = async function (req, res) {
  await orthancInstance.putAet('self', 'KANOUNIX', 'localhost', 4242, 'Generic')
  const aets = await orthancInstance.getAvailableAet()
  const orthancSystem = await orthancInstance.getSystem()

  res.render('autoQuery', { title: 'Image Fetcher', availableAets: aets, orthancInfo: orthancSystem })
}

module.exports = { getResults }
