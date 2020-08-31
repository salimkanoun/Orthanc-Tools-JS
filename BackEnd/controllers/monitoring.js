var CdBurnerFactory = require('../model/monitoring/cdburner/CdBurnerFactory')

var startBurner = async function(req, res) {
    cdBurnerInstance = CdBurnerFactory.getInstance()
    cdBurnerInstance.startCDMonitoring()
    res.json(true)
}

var getBurner = async function(req, res) {
    cdBurnerInstance = CdBurnerFactory.getInstance()
    res.json(cdBurnerInstance)
}

var stopBurner = async function (req, res){
    cdBurnerInstance = CdBurnerFactory.getInstance()
    cdBurnerInstance.stopCDMonitoring()
    res.json(true)

}

var cancelJobBurner = async function(req, res){
    cdBurnerInstance = CdBurnerFactory.getInstance()
    cdBurnerInstance.cancelCdJob(req.params.jobBurnerId)
    res.json(true)

}

module.exports = { startBurner, getBurner, stopBurner, cancelJobBurner }