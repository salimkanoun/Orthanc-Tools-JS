const Orthanc = require('../Orthanc')

class CdBurner {
    
    constructor(monitoring, table_burning_history) {
        this.orthanc = new Orthanc()

        this.monitoring = monitoring

        this.epsonDirectory = ""
        this.viewerDirectory = ""
        this.labelFile = ""
        this.dateFormatChoix = ""

        this.levelPatient

        this.table_burning_history = table_burning_history
    }

    //Méthode 1 
    /**
	 * Start Monitoring of Orthanc Change API every 90secs
	 */
    /*
    startCDMonitoring() {
		if ( epsonDirectory==null ||viewerDirectory==null ||labelFile==null || dateFormatChoix==null ){
            throw "need to set output folder"
        }

        //ToDo         
    }
    */

    /**
	 * Stop the monitoring every 90secs
	 */
    /*
    stopCDMonitoring() {
        //ToDo
    } 
    */   

    //Méthode 2
    /**
	 * Methode CallBack à appelé dans Orthanc_Monitoring pour creer un cd quand un evenemnt apparait dans orthanc
	 */
    startCDMonitoring() {
        //Si orthanc_Monitoring n'est pas allumé alors l'allumé
            //ToDo

        if(levelPatient) {
            monitoring.register(STABLE_PATIENT, (orthancID) => {this._makeCDFromPatient(orthancID)})
        } else {
            monitoring.register(STABLE_STUDIES, (orthancID) => {this._makeCD(orthancID)})
        }    
    }

    _makeCDFromPatient(patientID ) {
        //Store the Row number where we are going to display progress
		rownumber = this.table_burning_history.length;
        
        patient = //ToDo
        
        studies = Orthanc.findInOrthanc('Study', '', patientID, '', '', '', '', '');

        if(studies.length === 1) {
            //newStableStudyID = []
            //newStableStudyID.add(studies[0].getOrthancId());
            res = //ToDo : le numero de sutdi d'un patient donnée
            //makeCD(newStableStudyID);
            makeCD(res);
            //continue;
        }

    }

    _makeCD(patientID ) {

    }
    
}    

module.exports = CdBurner