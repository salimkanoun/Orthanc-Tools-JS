var Orthanc = require('../model/Orthanc')

var postRetrieve = async function (req, res) {
  const body = req.body
  var orthancInstance = new Orthanc()
  const orthancAetName = await orthancInstance.getOrthancAetName()
  console.log(body)
  if( 'seriesInstanceUID' in body){
    console.log('series Query')
    orthancInstance.buildSerieDicomQuery( '' , '' , '' , '' , '', body.seriesInstanceUID )
  }else if( 'studyInstanceUID' in body){
    console.log('study Query')
    orthancInstance.buildStudyDicomQuery( '' , '' , '' , '' , '', '', body.studyInstanceUID )
  }

  let serieQueryAnswer  = await orthancInstance.makeDicomQuery(body.aet) [0]
  const jobInfo = await orthancInstance.makeRetrieve(serieQueryAnswer.answerId, serieQueryAnswer.answerNumber, orthancAetName, false)
  res.json(jobInfo.ID)
}


module.exports = { postRetrieve }
