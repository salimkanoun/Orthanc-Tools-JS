const CdBurner = require('./CdBurner')
const Orthanc_Monitoring = require('../Orthanc_Monitoring')

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


const MonitoringFactory =  (function () {
    var instance;
 
    function createInstance() {
        let orthancMonitoring = new Orthanc_Monitoring()
        return orthancMonitoring;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

module.exports = CdBurnerFactory