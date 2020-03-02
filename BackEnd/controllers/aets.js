var Orthanc = require('../model/Orthanc')
var reverseProxy  = require('../model/ReverseProxy')
var orthancInstance = new Orthanc()

var getAets = async function (req, res) {
  reverseProxy.streamToRes('/modalities?expand', 'GET', undefined, res)
}

var changeAets = async function (req, res) {
  const body = req.body
  await orthancInstance.putAet(body.name, body.aetName, body.ip, parseInt(body.port), body.manufacturer)
  res.json(true)
}

var echoAets = async function (req, res) {
  reverseProxy.streamToRes('/modalities/' + req.params.name + '/echo', 'GET', undefined, res )
}

var deleteAet = async function (req, res) {
  reverseProxy.streamToRes('/modalities/' + req.params.name, 'DELETE', undefined, res)
}

module.exports = { getAets, changeAets, echoAets, deleteAet }
