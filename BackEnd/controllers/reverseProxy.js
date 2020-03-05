var ReverseProxy = require('../model/ReverseProxy')

var reverseProxyGet = async function (req, res) {
    let apiAdress = req.originalUrl
    let ortahncCalledApi = apiAdress.replace('/api', '');
    ReverseProxy.streamToRes(ortahncCalledApi, 'GET', undefined ,res)
}

module.exports = { reverseProxyGet }