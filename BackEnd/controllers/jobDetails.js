const ReverseProxy = require('../model/ReverseProxy')

var getJobData = async function (req, res) {
  ReverseProxy.streamToRes('/jobs/' + req.params.jobId, 'GET', undefined, res)
}

module.exports = { getJobData }
