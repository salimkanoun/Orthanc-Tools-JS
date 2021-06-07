const CdBurner = require('./CdBurner')
const MonitoringFactory = require('../MonitoringFactory')

const CdBurnerFactory =  ( function () {
    var instance;
 
    async function createInstance() {
        let monitoring =  MonitoringFactory.getInstance();
        await monitoring.setSettings()
        let instanceBurner = new CdBurner( monitoring )
        return instanceBurner;
    }
 
    return {
        getInstance: async function () {
            if (!instance) {
                instance = await createInstance();
            }
            return instance;
        }
    };
}) ();
module.exports = CdBurnerFactory