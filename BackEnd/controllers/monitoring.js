var Orthanc_Monitoring = require('../model/monitoring/Orthanc_Monitoring')
var CdBurner = require('../model/monitoring/cdburner/CdBurner')

var test = function() {
    console.log("TEST0")
    orthanc_Monitoring = new Orthanc_Monitoring()
    //console.log("TEST1")
    //orthanc_Monitoring.makeMonitor()
    console.log("TEST2")
    orthanc_Monitoring.getChangeLastLine()
    console.log("TEST3")
    orthanc_Monitoring.setChangeLastLine()
    console.log("TEST4")
    orthanc_Monitoring.autoSetChangeLastLine()
    console.log("TEST5")
    orthanc_Monitoring._parseOutput()
}

var test2 = function() {
    console.log("TEST0")
    cdBurner = new CdBurner()
}    

module.exports = { test,test2 }