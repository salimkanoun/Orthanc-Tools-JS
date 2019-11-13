var Orthanc = require('../model/Orthanc')

var getResults = async function (req, res) {
  const body = req.body
  var orthancInstance = new Orthanc()

  console.log(body)
  const jobData = await orthancInstance.getJobData(body.jobUid)

  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(jobData))
}

module.exports = { getResults }
