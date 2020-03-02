var Orthanc = require('../model/Orthanc')

var postQuery = async function (req, res) {
  const body = req.body
  var orthancInstance = new Orthanc()
  let queryAnswer = null

  if (body.level === 'Study') {

    orthancInstance.buildStudyDicomQuery(body.patientName, body.patientID, body.date, body.modality,
      body.studyDescription, body.accessionNumber)

  } else if (body.level === 'Serie') {

    orthancInstance.buildSerieDicomQuery(body.studyUID,'','','','','')
    
  }

  queryAnswer = await orthancInstance.makeDicomQuery(body.aet)

  res.json(queryAnswer)
}

module.exports = { postQuery }
