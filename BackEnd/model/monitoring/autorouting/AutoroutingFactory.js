const Autorouting = require('./Autorouting')
const Orthanc_Monitoring = require('../Orthanc_Monitoring')

const AutoroutingFactory = (function (){

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