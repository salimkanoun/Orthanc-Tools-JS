var Orthanc = require('../model/Orthanc')

var orthancInstance = new Orthanc()

var getResults = async function (req, res) {
  if(req.method ==="GET"){
    const aets = await orthancInstance.getAvailableAet()
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(aets))
  }else if(req.method==="POST"){

  }
  
}

module.exports = { getResults }
