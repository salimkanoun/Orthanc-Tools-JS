const CdBurner = require('./CdBurner')
const Orthanc_Monitoring = require('../Orthanc_Monitoring')

const CdBurnerFactory =  ( function () {
    var instance;
 
    function createInstance() {
        let instanceBurner = new CdBurner( MonitoringFactory.getInstance())
        return instanceBurner;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
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