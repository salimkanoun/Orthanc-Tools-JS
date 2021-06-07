const CdBurnerFactory = require('./cdburner/CdBurnerFactory')
const AutoroutingFactory = require('./autorouting/AutoroutingFactory')

async function autoStartMonitoringService(){

    let burnerInstance = await CdBurnerFactory.getInstance()
    burnerInstance.autoStartIfNeeded()
    let autorouterInstance = await AutoroutingFactory.getInstance()
    autorouterInstance.autoStartIfNeeded()

}

module.exports = autoStartMonitoringService