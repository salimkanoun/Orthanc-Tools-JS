const Orthanc = require('./Orthanc')

class Orthanc_Monitoring {
    
    constructor () {
        this.done = false
        this.last = 0

        //newStableStudyID = [];
        //newStablePatientID = [];
        //newStableSeriesID = [];
        //newPatientID = [];
        //newStudyID = [];
        //newSerieID = [];
    }

    makeMonitor() {
        do {
            this._parseOutput(this.last);
        }
        while(!done);
        
    }

    getChangeLastLine() {
		changes = Orthanc.getChangesLast();
		last = parseInt(changes.get("Last"));
		console.log(last);
		
		return last;
    }
    
    setChangeLastLine(last) {
        this.last = last
    }
    
    autoSetChangeLastLine() {
        last = this.getChangeLastLine();
		this.last=last;
    }

    async _parseOutput(last) {
        let changes = await Orthanc.getChanges(last)
        console.log(changes)

        let changesArray=changes.get("Changes");

        changesArray.forEach (function(changeEvent) {
            ID = changeEvent.get("ID").getAsString();
            
            if (changeEvent.get("ChangeType") === "NewPatient") {
				//newPatientID.push(ID);
			}
			 
			else if (changeEvent.get("ChangeType") === "NewStudy") {
				//newStudyID.push(ID);

			}
			
			else if (changeEvent.get("ChangeType") === "NewSeries") {
				//newSerieID.push(ID);
			}
			
			else if (changeEvent.get("ChangeType") === "StablePatient") {
				//newStablePatientID.push(ID);
			}
			
			else if (changeEvent.get("ChangeType") === "StableStudy") {
				//newStableStudyID.push(ID);
			}

			else if (changeEvent.get("ChangeType") === "StableSeries") {
				//newStableSeriesID.push(ID);
			}
        })   
        last = parseInt(changes.get("Last"));
        done = parseBoolean(changes.get("Done")); 
    }
        
}