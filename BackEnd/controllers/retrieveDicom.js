var Orthanc = require('../model/Orthanc')

var postRetrieve = async function (req, res) {
  const body = req.body
  var orthancInstance = new Orthanc()
  const systemInfo = await orthancInstance.getSystem()
  const jobInfo = await orthancInstance.makeRetrieve(body.queryID, body.answerNumber, systemInfo.DicomAet)
  res.json(jobInfo.ID)
}

module.exports = { postRetrieve }
