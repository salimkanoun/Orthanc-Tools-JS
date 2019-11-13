var Orthanc = require('../model/Orthanc')

var getResults = async function (req, res) {
  const body = req.body
  var orthancInstance = new Orthanc()
  const systemInfo = await orthancInstance.getSystem()
  console.log(body)
  const jobID = await orthancInstance.makeRetrieve(body.queryID, body.answerNumber, systemInfo.DicomAet)

  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(jobID))
}

module.exports = { getResults }
