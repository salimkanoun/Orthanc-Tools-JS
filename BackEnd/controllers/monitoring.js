var CdBurnerFactory = require('../model/monitoring/cdburner/CdBurnerFactory')

var startBurner = async function(req, res) {
    let cdBurnerInstance = await CdBurnerFactory.getInstance()
    await cdBurnerInstance.setSettings()
    await cdBurnerInstance.startCDMonitoring()
    res.status(200)
}

var getBurner = async function(req, res) {
    let cdBurnerInstance = await CdBurnerFactory.getInstance()
    res.json(cdBurnerInstance)
}

var stopBurner = async function (req, res){
    let cdBurnerInstance = await CdBurnerFactory.getInstance()
    await cdBurnerInstance.stopCDMonitoring()
    res.status(200)
}

var cancelJobBurner = async function(req, res){
    let cdBurnerInstance = await CdBurnerFactory.getInstance()
    cdBurnerInstance.cancelCdJob(req.params.jobBurnerId)
    res.status(200)
}

module.exports = { startBurner, getBurner, stopBurner, cancelJobBurner }