const OrthancReverseProxyService = require('../model/OrthancReverseProxyService')

const reverseProxyGet = async function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  await OrthancReverseProxyService.reverseProxyStreamToRes(orthancCalledApi, 'get', null, req.headers, res)
}

const reverseProxyPost = async function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  await OrthancReverseProxyService.reverseProxyStreamToRes(orthancCalledApi, 'post', req.body, req.headers, res)
}

const reverseProxyDelete = async function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  await OrthancReverseProxyService.reverseProxyStreamToRes(orthancCalledApi, 'delete', undefined, req.headers, res)
}

const reverseProxyPut = async function (req, res) {
  const apiAdress = req.originalUrl
  const orthancCalledApi = apiAdress.replace('/api', '')
  await OrthancReverseProxyService.reverseProxyStreamToRes(orthancCalledApi, 'put', req.body, req.headers, res)
}

module.exports = { reverseProxyGet, reverseProxyPost, reverseProxyPut, reverseProxyDelete }
