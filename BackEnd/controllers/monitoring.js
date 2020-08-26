var {cdBurner} = require('../model/monitoring/cdburner/CdBurner')

var startBurner = async function(req, res) {
    cdBurner.startCDMonitoring()
    res.end()
}

module.exports = { startBurner }