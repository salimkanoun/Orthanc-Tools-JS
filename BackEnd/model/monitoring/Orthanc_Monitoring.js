const Orthanc = require('../Orthanc')
const EventEmitter = require('events').EventEmitter;

class Orthanc_Monitoring extends EventEmitter {
    
    constructor () {
        super()
        this.orthanc = new Orthanc()
        this.done = false
        this.last = 0
    }

    monitoringService = {
        cdBurner: false
    }

    async startMonitoringifNeeded () {
        //If already started skip
        if(this.monitoringRunning) return

        let startedServiceArray = Object.keys(this.monitoringService).filter(service=> (service ===true) )

        if(startedServiceArray.length >0 ){
            this.monitoringRunning = true
            //Get last change number at monitoring startup (monitoring will start at this index)
            let changes = await this.orthanc.getChangesLast()
            this.last = changes.Last
            this.monitoringInterval = setInterval(this.makeMonitor, 2000)

        }
        
    }

    startMonitoringService(serviceName){
        this.monitoringService[serviceName] = true
        this.startMonitoringifNeeded()
    }

    stopMonitoringService(serviceName){
        this.monitoringService[serviceName] = false
        this.stopMonitoringIfNeeded()
    }

    stopMonitoringIfNeeded (){
        if(!this.monitoringRunning) return

        let startedServiceArray = Object.keys(this.monitoringService).filter(service=> (service ===true) )
        if(startedServiceArray.length === 0 ){
            this.monitoringRunning = false
            clearInterval(this.monitoringInterval)
        }

    }

    makeMonitor() {
        do {
            this._parseOutput(this.last);
        }
        while(!this.done);
        
    }

    async _parseOutput(last) {
        
        let changes
        try {
            changes = await this.orthanc.getChanges(last)
        } catch (err) {
            console.log(err)
        }

        let changesArray=changes.Changes;

        changesArray.forEach(function(changeEvent) {
            ID = changeEvent.ID;
            
            if (changeEvent.get("ChangeType") === "NewPatient") {
                this.emit('NewPatient')
			}
			 
			else if (changeEvent.get("ChangeType") === "NewStudy") {
                this.emit('NewStudy')
			}
			
			else if (changeEvent.get("ChangeType") === "NewSeries") {
                this.emit('NewSeries')
			}
			
			else if (changeEvent.get("ChangeType") === "StablePatient") {
                this.emit('StablePatient')
			}
			
			else if (changeEvent.get("ChangeType") === "StableStudy") {
                this.emit('StableStudy')
			}

			else if (changeEvent.get("ChangeType") === "StableSeries") {
                this.emit('StableSeries')
			}
        }) 
        
        this.last = changes.Last
        this.done = changes.Done
    }
        
}

const orthanc_Monitoring = new Orthanc_Monitoring();
Object.freeze(orthanc_Monitoring);

const MONITORING_SERVICE_CDBURNER = "CdBurner"

exports.orthanc_Monitoring = orthanc_Monitoring
exports.Orthanc_Monitoring = Orthanc_Monitoring