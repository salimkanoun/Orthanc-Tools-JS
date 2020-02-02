var Orthanc = require('../model/Orthanc')

var getResults = async function (req, res) {
  const body = req.body
  var orthancInstance = new Orthanc()
  orthancInstance.buildDicomQuery('Study', body.patientName, body.patientID, body.date, body.modality,
    body.studyDescription, body.accessionNumber)
  const queryAnswer = await orthancInstance.makeDicomQuery(body.aet)
  res.json(queryAnswer)
}

module.exports = { getResults }
