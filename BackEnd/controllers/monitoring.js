var CdBurnerFactory = require('../model/monitoring/cdburner/CdBurnerFactory')

var startBurner = async function(req, res) {
    try {
        let cdBurnerInstance = await CdBurnerFactory.getInstance()
        await cdBurnerInstance.setSettings()
        await cdBurnerInstance.startCDMonitoring()
        res.json(true)
    } catch (err) {
        res.status(500).send(err)
    }

}

var getBurner = async function(req, res) {
    let cdBurnerInstance = await CdBurnerFactory.getInstance()
    res.json(cdBurnerInstance)
}

var stopBurner = async function (req, res){
    let cdBurnerInstance = await CdBurnerFactory.getInstance()
    cdBurnerInstance.stopCDMonitoring()
    res.json(true)

}

var cancelJobBurner = async function(req, res){
    let cdBurnerInstance = await CdBurnerFactory.getInstance()
    cdBurnerInstance.cancelCdJob(req.params.jobBurnerId)
    res.json(true)

}

module.exports = { startBurner, getBurner, stopBurner, cancelJobBurner }