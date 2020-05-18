var Orthanc = require('../model/Orthanc')

var anonymizeStudy = async function (req, res) {
    const body = req.body
    var orthancInstance = new Orthanc()
    let job = await orthancInstance.makeAnon('studies', body.OrthancStudyID, body.Profile, body.AccessionNumber, 
    body.PatientID, body.PatientName, body.StudyDescription, false)
    res.json(job.ID)
}

module.exports = { anonymizeStudy }
