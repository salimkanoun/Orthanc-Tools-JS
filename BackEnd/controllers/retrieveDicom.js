var Orthanc = require('../model/Orthanc')

var getResults = async function (req, res) {
  const body = req.body
  var orthancInstance = new Orthanc()
  const systemInfo = await orthancInstance.getSystem()
  const jobID = await orthancInstance.makeRetrieve(body.queryID, body.answerNumber, systemInfo.DicomAet)
  res.json(jobID)
}

module.exports = { getResults }
