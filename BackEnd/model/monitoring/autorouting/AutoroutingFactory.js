const Autorouting = require('./Autorouting')
const Orthanc_Monitoring = require('../Orthanc_Monitoring')

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
})

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

module.exports= AutoroutingFactory