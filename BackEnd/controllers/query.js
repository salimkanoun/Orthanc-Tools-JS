var Orthanc = require('../model/Orthanc')

/**
 * Higher level API to simplyfy Orthanc Result retrieve API.
 * From a Query ID, return results in a JSON with results details (series and study levels)
 * @param {*} req 
 * @param {*} res 
 */
var getParsedAnswer = async function(req, res){

  let orthanc = new Orthanc()
  let level = await orthanc._getAnswerLevel(req.params.orthancIdQuery)
  let originAET = await orthanc._getAnswerOriginAET(req.params.orthancIdQuery)
  let answerDetails= []
  if(level === "Study"){
    answerDetails = await orthanc.getStudyAnswerDetails(req.params.orthancIdQuery, originAET)
  } else if (level === "Series"){
    answerDetails = await orthanc.getSeriesAnswerDetails(req.params.orthancIdQuery, originAET)
  }

  res.json(answerDetails)

}

module.exports = { getParsedAnswer }
