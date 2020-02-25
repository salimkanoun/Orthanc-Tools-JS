var Orthanc = require('../model/Orthanc')
var orthancInstance = new Orthanc()

var getAets = async function (req, res) {
    const aets = await orthancInstance.getAvailableAet()
    res.json(aets)
}

var changeAets = async function (req, res) {
  const body = req.body
  await orthancInstance.putAet(body.name, body.aetName, body.ip, parseInt(body.port), body.manufacturer)
  res.json(true)

}

var echoAets = async function (req, res) {
  let answer = await orthancInstance.echoAet(req.params.name)
  res.json(answer) 
}

var deleteAet = async function (req, res) {
  let answer = await orthancInstance.removeAet(req.params.name)
  res.json(answer)
}

module.exports = { getAets, changeAets, echoAets, deleteAet }
