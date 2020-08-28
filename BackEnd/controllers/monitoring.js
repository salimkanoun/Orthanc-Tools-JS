var CdBurnerFactory = require('../model/monitoring/cdburner/CdBurnerFactory')

var startBurner = async function(req, res) {
    cdBurnerInstance = CdBurnerFactory.getInstance()
    cdBurnerInstance.startCDMonitoring()
    res.end()
}

var getBurner = async function(req, res) {
    cdBurnerInstance = CdBurnerFactory.getInstance()
    res.json(cdBurnerInstance)
}

module.exports = { startBurner, getBurner }