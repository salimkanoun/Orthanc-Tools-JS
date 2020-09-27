var ReverseProxy = require('../model/ReverseProxy')

var reverseProxyGet = async function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToRes(orthancCalledApi, 'GET', undefined, res)
}

var reverseProxyPost = function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToRes(orthancCalledApi, 'POST', req.body, res)
}

var reverseProxyPostUploadDicom = function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToResUploadDicom(orthancCalledApi, 'POST', req.body, res)
}

var reverseProxyDelete = function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToRes(orthancCalledApi, 'DELETE', undefined, res)
}

var reverseProxyPut = function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToRes(orthancCalledApi, 'PUT', req.body, res)
}

var reverseProxyPutPlainText = function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToResPlainText(orthancCalledApi, 'PUT', req.body, res)
}

module.exports = { reverseProxyGet, reverseProxyPost, reverseProxyPostUploadDicom, reverseProxyPut, reverseProxyPutPlainText, reverseProxyDelete }
