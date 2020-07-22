const Orthanc = require('../Orthanc')
const EventEmitter = require('events').EventEmitter;

class Orthanc_Monitoring extends EventEmitter {
    
    constructor () {
        this.orthanc = new Orthanc()

        this.done = false
        this.last = 0

        //Méthode 1 
        //Arrays of events
        this.newStableStudyID = [];
        this.newStablePatientID = [];
        this.newStableSeriesID = [];
        this.newPatientID = [];
        this.newStudyID = [];
        this.newSerieID = [];

        //Méthode 2 
        //CallBack
        this.callBackArray = []

        //Méthode 3 
        //Event
        this.eventEmitter = new events.EventEmitter();

    }

    //Métode 2
    /*
    register(eventType, func) {
        this.callBackArray[eventType].push(func)
    }
    */

    makeMonitor() {
        do {
            this._parseOutput(this.last);
        }
        while(!this.done);
        
    }

    async getChangeLastLine() {
        let changes = await this.orthanc.getChangesLast();
        this.last = parseInt(changes.Last);
		console.log(this.last);
		
		return this.last;
    }
    
    setChangeLastLine(last) {
        this.last = last
    }
    
    autoSetChangeLastLine() {
        this.last = this.getChangeLastLine();
    }

    async _parseOutput(last) {
        
        let changes
        try {
            changes = await this.orthanc.getChanges(last)
        } catch (err) {
            console.log(err)
        }
        console.log(changes)

        let changesArray=changes.Changes;

        changesArray.forEach(function(changeEvent) {
            ID = changeEvent.ID;
            
            if (changeEvent.get("ChangeType") === "NewPatient") {
                //Méthode 1 
                this.newPatientID.push(ID);
                //Méthode 2
                this.callBackArray[NEW_PATIENT].forEach(function(func) {
                    this.callBackArray[NEW_PATIENT].func(ID)
                })
                //Méthode 3
                this.emit('NewPatient')
			}
			 
			else if (changeEvent.get("ChangeType") === "NewStudy") {
                //Méthode 1 
                this.newStudyID.push(ID);
                //Méthode 2

                //Méthode 3
                this.emit('NewStudy')
			}
			
			else if (changeEvent.get("ChangeType") === "NewSeries") {
                //Méthode 1 
                this.newSerieID.push(ID);
                //Méthode 2 

                //Méthode 3
                this.emit('NewSeries')
			}
			
			else if (changeEvent.get("ChangeType") === "StablePatient") {
                //Méthode 1 
                this.newStablePatientID.push(ID);
                //Méthode 2 

                //Méthode 3
                this.emit('StablePatient')
			}
			
			else if (changeEvent.get("ChangeType") === "StableStudy") {
                //Méthode 1 
                this.newStableStudyID.push(ID);
                //Méthode 2 

                //Méthode 3
                this.emit('StableStudy')
			}

			else if (changeEvent.get("ChangeType") === "StableSeries") {
                //Méthode 1 
                this.newStableSeriesID.push(ID);
                //Méthode 2

                //Méthode 3
                this.emit('StableSeries')
			}
        }) 
        
        this.last = parseInt(changes.Last);
        this.done = changes.Done; 
    }
        
}

const orthanc_Monitoring = new Orthanc_Monitoring();
Object.freeze(orthanc_Monitoring);

exports.orthanc_Monitoring = orthanc_Monitoring
exports.Orthanc_Monitoring = Orthanc_Monitoring