var CdBurnerFactory = require('../model/monitoring/cdburner/CdBurnerFactory')

var startBurner = async function(req, res) {
    console.log(CdBurnerFactory)
    cdBurnerInstance = CdBurnerFactory.getInstance()
    cdBurnerInstance.startCDMonitoring()
    res.end()
}

module.exports = { startBurner }