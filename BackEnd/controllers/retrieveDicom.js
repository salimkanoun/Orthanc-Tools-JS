var Orthanc = require('../model/Orthanc')

var postRetrieve = async function (req, res) {
  const body = req.body
  var orthancInstance = new Orthanc()
  const orthancAetName = await orthancInstance.getOrthancAetName()

  if( 'seriesInstanceUID' in body){
    orthancInstance.buildSerieDicomQuery( '' , '' , '' , '' , '', body.seriesInstanceUID )
  }else if( 'studyInstanceUID' in body){
    orthancInstance.buildStudyDicomQuery( '' , '' , '' , '' , '', '', body.studyInstanceUID )
  }

  let queryAnswer  = await orthancInstance.makeDicomQuery(body.aet)
  queryAnswer = queryAnswer[0]
  const jobInfo = await orthancInstance.makeRetrieve(queryAnswer.answerId, queryAnswer.answerNumber, orthancAetName, false)
  res.json(jobInfo.ID)
}


module.exports = { postRetrieve }
