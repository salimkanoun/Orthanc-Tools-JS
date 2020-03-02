var reverseProxy  = require('../model/ReverseProxy')

var getAets = async function (req, res) {
  reverseProxy.streamToRes('/modalities?expand', 'GET', undefined, res)
}

var changeAets = async function (req, res) {
  let data = req.body
  reverseProxy.streamToRes('/modalities/' + data.name, 'PUT', JSON.stringify([data.aetName, data.ip, parseInt(data.port), data.manufacturer]), res)
}

var echoAets = async function (req, res) {
  reverseProxy.streamToRes('/modalities/' + req.params.name + '/echo', 'GET', undefined, res )
}

var deleteAet = async function (req, res) {
  reverseProxy.streamToRes('/modalities/' + req.params.name, 'DELETE', undefined, res)
}

module.exports = { getAets, changeAets, echoAets, deleteAet }
