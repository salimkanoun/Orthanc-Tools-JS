var Orthanc = require('../model/Orthanc')

var postRetrieve = async function (req, res) {
  const body = req.body
  var orthancInstance = new Orthanc()
  const orthancAetName = await orthancInstance.getOrthancAetName()
  const jobInfo = await orthancInstance.makeRetrieve(body.queryID, body.answerNumber, orthancAetName)
  res.json(jobInfo.ID)
}

module.exports = { postRetrieve }
