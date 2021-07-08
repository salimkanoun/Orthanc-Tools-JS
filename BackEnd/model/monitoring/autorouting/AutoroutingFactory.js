const Autorouting = require('./Autorouting')
const MonitoringFactory = require('../MonitoringFactory')

/**
 * Create an instance of autorouting
 * @returns instance of Autourouting
 */
const AutoroutingFactory = (function (){
    var instance;
 
    async function createInstance() {
        let monitoring =  MonitoringFactory.getInstance();
        await monitoring.setSettings()
        let instanceAutorouting = new Autorouting( monitoring )
        return instanceAutorouting;
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

module.exports= AutoroutingFactory