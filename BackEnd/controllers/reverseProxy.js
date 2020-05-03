var ReverseProxy = require('../model/ReverseProxy')

var reverseProxyGet = async function (req, res) {
  const apiAdress = req.originalUrl
  const ortahncCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToRes(ortahncCalledApi, 'GET', undefined, res)
}

var reverseProxyPost = function (req, res) {
  const apiAdress = req.originalUrl
  const ortahncCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToRes(ortahncCalledApi, 'POST', req.body, res)
}

var reverseProxyPostUploadDicom = function (req, res) {
  const apiAdress = req.originalUrl
  const ortahncCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToResUploadDicom(ortahncCalledApi, 'POST', req.body, res)
}

var reverseProxyDelete = function (req, res) {
  const apiAdress = req.originalUrl
  const ortahncCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToRes(ortahncCalledApi, 'DELETE', undefined, res)
}

var reverseProxyPut = function (req, res) {
  const apiAdress = req.originalUrl
  const ortahncCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToRes(ortahncCalledApi, 'PUT', req.body, res)
}

var reverseProxyPutPlainText = function (req, res) {
  const apiAdress = req.originalUrl
  const ortahncCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToResPlainText(ortahncCalledApi, 'PUT', req.body, res)
}

module.exports = { reverseProxyGet, reverseProxyPost, reverseProxyPostUploadDicom, reverseProxyPut, reverseProxyPutPlainText, reverseProxyDelete }
