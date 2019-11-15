var getResults = async function (req, res) {
    let Retrieve_Robot = require('../model/Retrieve_Robot')
    let Orthanc = require('../model/Orthanc')
    const body = req.body
    let orthanc = new Orthanc()
    const orthancSystem = await orthancInstance.getSystem()
    let retriveRobot=new Retrieve_Robot(orthanc, body.studyArray, orthancSystem.DicomAet);
    retriveRobot.scheduleRetrieve();

    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify('Done'))
}

module.exports = { getResults }