const ReverseProxy = require('../model/ReverseProxy')

const reverseProxyGet = async function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  await ReverseProxy.streamToRes(orthancCalledApi, 'GET', undefined, res)
}

const reverseProxyPost = async function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  await ReverseProxy.streamToRes(orthancCalledApi, 'POST', req.body, res)
}

const reverseProxyPostUploadDicom = function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  ReverseProxy.streamToResUploadDicom(orthancCalledApi, 'POST', req.body, res)
}

const reverseProxyDelete = async function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  await ReverseProxy.streamToRes(orthancCalledApi, 'DELETE', undefined, res)
}

const reverseProxyPut =  async function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  await ReverseProxy.streamToRes(orthancCalledApi, 'PUT', req.body, res)
}

const reverseProxyPutPlainText = async function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  await ReverseProxy.streamToResPlainText(orthancCalledApi, 'PUT', req.body, res)
}

module.exports = { reverseProxyGet, reverseProxyPost, reverseProxyPostUploadDicom, reverseProxyPut, reverseProxyPutPlainText, reverseProxyDelete }
