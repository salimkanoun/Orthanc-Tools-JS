const Orthanc = require('../model/Orthanc')

/**
 * Higher level API to simplyfy Orthanc Result retrieve API.
 * From a Query ID, return results in a JSON with results details (series and study levels)
 * @param {*} req
 * @param {*} res
 */
const getParsedAnswer = async function (req, res) {
  const orthanc = new Orthanc()
  const level = await orthanc._getAnswerLevel(req.params.orthancIdQuery)
  const originAET = await orthanc._getAnswerOriginAET(req.params.orthancIdQuery)
  let answerDetails = []
  if (level === 'Study') {
    answerDetails = await orthanc.getStudyAnswerDetails(req.params.orthancIdQuery, originAET)
  } else if (level === 'Series') {
    answerDetails = await orthanc.getSeriesAnswerDetails(req.params.orthancIdQuery, originAET)
  }
  res.json(answerDetails)
}

//SK Peut etre inutile et passer par le reverse proxy
const postRetrieve = async function (req, res) {
  const body = req.body
  var orthancInstance = new Orthanc()
  const orthancAetName = await orthancInstance.getOrthancAetName()

  if( 'SeriesInstanceUID' in body){
    orthancInstance.buildSeriesDicomQuery( body.StudyInstanceUID, '' , '' , '' , '', body.SeriesInstanceUID)
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

module.exports = { getParsedAnswer, postRetrieve }
