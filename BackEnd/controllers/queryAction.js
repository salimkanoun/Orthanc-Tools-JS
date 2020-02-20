var Orthanc = require('../model/Orthanc')

var postQuery = async function (req, res) {
  const body = req.body
  var orthancInstance = new Orthanc()
  let queryAnswer = null
  
  if (body.level === 'Study') {
    orthancInstance.buildDicomQuery('Study', body.patientName, body.patientID, body.date, body.modality,
      body.studyDescription, body.accessionNumber)
    queryAnswer = await orthancInstance.makeDicomQuery(body.aet)
  } else if (body.level === 'Serie') {
    queryAnswer = await orthancInstance.querySeries(body.aet, body.studyUID)
  }

  res.json(queryAnswer)
}

module.exports = { postQuery }
