const CdBurnerFactory = require('./cdburner/CdBurnerFactory')

async function autoStartMonitoringService(){

    let burnerInstance = await CdBurnerFactory.getInstance()
    burnerInstance.autoStartIfNeeded()

}

module.exports = autoStartMonitoringService