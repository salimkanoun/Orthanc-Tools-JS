var Orthanc = require('../model/Orthanc')

var postRetrieve = async function (req, res) {
  const body = req.body
  var orthancInstance = new Orthanc()
  const orthancAetName = await orthancInstance.getOrthancAetName()

  if( 'SeriesInstanceUID' in body){
    orthancInstance.buildSeriesDicomQuery( '' , '' , '' , '' , '', body.SeriesInstanceUID )
  }else if( 'StudyInstanceUID' in body){
    orthancInstance.buildStudyDicomQuery( '' , '' , '' , '' , '', '', body.StudyInstanceUID )
  }else{
    throw 'Not rekognized level query'
  }

  let queryAnswer  = await orthancInstance.makeDicomQuery(body.Aet)
  queryAnswer = queryAnswer[0]
  const jobInfo = await orthancInstance.makeRetrieve(queryAnswer.AnswerId, queryAnswer.AnswerNumber, orthancAetName, false)
  res.json(jobInfo.ID)
}


module.exports = { postRetrieve }
