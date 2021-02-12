const ReverseProxy = require('../model/ReverseProxy')

const reverseProxyGet = async function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToRes(orthancCalledApi, 'GET', undefined, res)
}

const reverseProxyPost = function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToRes(orthancCalledApi, 'POST', req.body, res)
}

const reverseProxyPostUploadDicom = function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToResUploadDicom(orthancCalledApi, 'POST', req.body, res)
}

const reverseProxyDelete = function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToRes(orthancCalledApi, 'DELETE', undefined, res)
}

const reverseProxyPut = function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToRes(orthancCalledApi, 'PUT', req.body, res)
}

const reverseProxyPutPlainText = function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToResPlainText(orthancCalledApi, 'PUT', req.body, res)
}

module.exports = { reverseProxyGet, reverseProxyPost, reverseProxyPostUploadDicom, reverseProxyPut, reverseProxyPutPlainText, reverseProxyDelete }
