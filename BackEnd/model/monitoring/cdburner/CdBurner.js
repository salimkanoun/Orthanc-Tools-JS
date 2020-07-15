const Orthanc = require('../../Orthanc')

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

    _makeCDFromPatient(newStablePatientID) {
        //Store the Row number where we are going to display progress
		let rownumber = this.table_burning_history.length;
        
        let patient = this.orthanc.findInOrthanc('Patient', '', newStablePatientID, '', '', '', '', '')//Obtenir les infos d un patient depuis son patientID
        
        let studies = this.orthanc.findInOrthanc('Study', '', newStablePatientID, '', '', '', '', '')

        if(studies.length === 1) {
            newStableStudyID = studies[0].MainDicomTags.StudyID //Recuper la studyID à partie de la studies du patientID
            makeCD(newStableStudyID);
        }

        let formattedPatientDOB = "N/A"
        try {
            let PatientDOB = patient.MainDicomTags.PatientBirthDate //date d'anniversaire du patient
            formattedPatientDOB = PatientDOB.toLocaleString() //datte d'anniverssaire formaté du patient
        } catch (err) {
            console.log(err)
        }

        let datInfos = [studies.length]
        let uniqueModalitiesForPrimera = []

        for(i=0; i<studies.length ; i++) {
            let formattedDateExamen = "N/A";
            if(studies[i].MainDicomTags.StudyDate !== null) formattedDateExamen = studies[i].MainDicomTags.StudyDate.toLocaleString();
            let studyDescription = studies[i].MainDicomTags.StudyDescription;	
            let accessionNumber = studies[i].MainDicomTags.AccessionNumber;
            
            let series = studies[i].Series
            
            let modalities = []
            for(u=0; u<series.length ; u++) {
                modality = series[u].MainDicomTags.Modality;
			    if(!modalities.contains(modality)) modalities.push(modality);
            }

            let modalitiesInStudy
            for(u=0; u<modalities.length ; u++) {
                modalitiesInStudy = String.join("//", modalities[u]);
            }

            for(u=0; u<modalities.length ; u++) {
                if(!uniqueModalitiesForPrimera.contains(modalities[u])) {
                    uniqueModalitiesForPrimera.push(modalities[u]);
                }
            }
            datInfos[i] = {
                Name: patient.MainDicomTags.PatientName,
                getPatientId: patient.MainDicomTags.PatientID ,
                formattedDateExamen: formattedDateExamen,
                studyDescription: studyDescription,
                accessionNumber: accessionNumber,
                formattedPatientDOB: formattedPatientDOB,
                modalitiesInStudy: modalitiesInStudy
            } 
        }

        modalitiesInStudyPrimera = String.join("//", uniqueModalitiesForPrimera);

        //Update display status
        //ToDo
        
        //Generate the ZIP with Orthanc IDs dicom
		orthancIds = []
		for(u=0; u<studies.length ; u++) {
			orthancIds.push(studies[u].MainDicomTags.StudyID);
        }
        let zip = _generateZip(orthancIds);



    }

    _makeCD(newStableStudyID) {

    }

    _generateZip(orthancIds) {
		zip=null;
		try {
			datenow = new Date();
			file = Files.createTempFile("CD_"+dateFormat.format(datenow) , ".zip");
			file.toFile().deleteOnExit();			
			zipDownloader = new ExportZip(connexion);
			zipDownloader.setConvertZipAction(file.toString(), orthancIds, true);
			//generate ZIP of DICOMs
			zipDownloader.generateZip(true);
			zip=zipDownloader.getGeneratedZipFile();
		} catch (e) {
			console.log(e)
		}
		return zip;
	}
    
}    

module.exports = CdBurner