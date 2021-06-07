const Orthanc_Monitoring = require('./Orthanc_Monitoring')

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

module.exports = MonitoringFactory