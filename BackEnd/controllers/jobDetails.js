var Orthanc = require('../model/Orthanc')

var getJobData = async function (req, res) {
  var orthancInstance = new Orthanc()
  const jobData = await orthancInstance.getJobData(req.params.id)
  res.json(jobData)
}

module.exports = { getJobData }
