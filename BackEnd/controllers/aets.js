var Orthanc = require('../model/Orthanc')
var reverseProxy  = require('../model/ReverseProxy')
var orthancInstance = new Orthanc()

var getAets = async function (req, res) {
  reverseProxy.getOrthancApis('/modalities?expand', res)
}

var changeAets = async function (req, res) {
  const body = req.body
  await orthancInstance.putAet(body.name, body.aetName, body.ip, parseInt(body.port), body.manufacturer)
  res.json(true)
}

var echoAets = async function (req, res) {
  const answer = await orthancInstance.echoAet(req.params.name)
  res.json(answer)
}

var deleteAet = async function (req, res) {
  reverseProxy.deleteOrthancApis('/modalities/' + req.params.name, res)
}

module.exports = { getAets, changeAets, echoAets, deleteAet }
