var Orthanc = require('../model/Orthanc')

var getResults = async function (req, res) {
  const body = req.body
  var orthancInstance = new Orthanc()
  const jobData = await orthancInstance.getJobData(body.jobUid)
  res.json(jobData)
}

module.exports = { getResults }
