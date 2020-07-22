const Orthanc = require('../../Orthanc')
var fs = require("fs");
var JSZip = require("jszip");
const tmp = require('tmp');
const orthanc_Monitoring = require('../Orthanc_Monitoring')



class CdBurner {
    
    constructor(monitoring) {
        this.orthanc = new Orthanc()

        this.monitoring = monitoring

        this.epsonDirectory 
        this.viewerDirectory 
        this.labelFile 
        this.dateFormatChoix 

        this.levelPatient

        this.burnerManifacturer

        this.DateOptions
        this.format
        if(this._dateFormat()) {
            this.DateOptions = {month: 'numeric', day: 'numeric'}
            this.format = "fr-FR"
        } else {
            this.DateOptions = {month: 'numeric', day: 'numeric' }
            this.format = "uk-UA"
        }
        
    }

    _dateFormat() {
        //ToDo
        //récuperer dans la bd le format et les options de date
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
    /*
    startCDMonitoring() {
        //Si orthanc_Monitoring n'est pas allumé alors l'allumé
            //ToDo

        if(levelPatient) {
            monitoring.register(STABLE_PATIENT, (orthancID) => {this._makeCDFromPatient(orthancID)})
        } else {
            monitoring.register(STABLE_STUDIES, (orthancID) => {this._makeCD(orthancID)})
        }    
    }

    stopCDMonitoring() {
        //ToDo
    }*/

    //Méthode 3
    startCDMonitoring() {
        //Si orthanc_Monitoring n'est pas allumé alors l'allumé
            //ToDo

        orthanc_Monitoring.eventEmitteraddListener('StablePatient', (orthancID) => {this._makeCDFromPatient(orthancID)})
        orthanc_Monitoring.eventEmitteraddListener('StableStudy', (orthancID) => {this._makeCD(orthancID)})
    }

    stopCDMonitoring() {
        orthanc_Monitoring.removeListener('StablePatient', (orthancID) => {this._makeCDFromPatient(orthancID)})
        orthanc_Monitoring.removeListener('StableStudy', (orthancID) => {this._makeCD(orthancID)})
    } 

    async _makeCDFromPatient(newStablePatientID) {
        let patient = this.orthanc.findInOrthanc('Patient', '', newStablePatientID, '', '', '', '', '')//Obtenir les infos d un patient depuis son patientID
        
        let studies = this.orthanc.findInOrthanc('Study', '', newStablePatientID, '', '', '', '', '')

        if(studies.length === 1) {
            let newStableStudyID = studies[0].MainDicomTags.StudyID //Recuper la studyID à partie de la studies du patientID
            this.makeCD(newStableStudyID);
        }

        let formattedPatientDOB = "N/A"
        try {
            let patientDOB = patient.MainDicomTags.PatientBirthDate //date d'anniversaire du patient
            formattedPatientDOB = patientDOB.toLocaleDateString(this.format, this.DateOptions) //datte d'anniverssaire formaté du patient
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
                let modality = series[u].MainDicomTags.Modality;
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

        let modalitiesInStudyPrimera = String.join("//", uniqueModalitiesForPrimera);
        
        //Generate the ZIP with Orthanc IDs dicom
		for(u=0; u<studies.length ; u++) {
            Orthanc.exportArchiveDicom(studies[u].MainDicomTags.StudyID, Orthanc.exportArchiveDicom(studies[u].MainDicomTags.StudyID))
        }

        // Unzip du fichier ZIP recupere
        for(u=0; u<studies.length ; u++) {
		    fs.readFile('./data/export_dicom/' + Orthanc.exportArchiveDicom(studies[u].MainDicomTags.StudyID + '.zip', function(err, data) {
            if (err) throw err;
                JSZip.loadAsync(data).then(function (zip) {
                    
                    tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
                        if (err) throw err;
                            fs.writeFile(path, zip, function(err) {
                                if(err) {
                                    return console.log(err);
                                }
                            }); 
                        
                        // Creation du Cd
                        if (this.burnerManifacturer === "Epson") {
                            let discType = _determineDiscType();
                            let dat = _printDat(datInfos);
                            //Generation du Dat
                            //dat = _printDat(nom, id, formattedDateExamen, studyDescription, accessionNumber, formattedPatientDOB );
                            let requestFileAndID = _createCdBurnerEpson(dat, discType, patient.getName(), "Mutiples");
                            
                        } else if(this.burnerManifacturer ==="Primera") {
                            let requestFileAndID = _createCdBurnerPrimera(patient.getName(), patient.getPatientId(), "Mutiples", studies.size()+" studies", "Mutiples", formattedPatientDOB ,studies.size(), modalitiesInStudyPrimera);
                        }    

                        //On efface la study de Orthanc
			            if (deleteStudies) {
				            //ToDo //connexion.makeDeleteConnection("/patients/"+patientID);
			            }

                        cleanupCallback();
                      });

                });
            }));
        }


    }

    _makeCD(newStableStudyID) {
        for (i=0; i<newStableStudyID.length ; i++) {
			
            //study = ortancQuery.getStudyDetails(studyID, true);
            let study = this.orthanc.findInOrthanc('Study', '', newStablePatientID, '', '', '', '', '')
            
            //patient = ortancQuery.getPatient(study.getParentPatientId());
            //let patient = this.orthanc.findInOrthanc('Patient', '', sutdy.MainDicomTags.PatientID, '', '', '', '', '')
            let patient = this.orthanc.findInOrthanc('Patient', '', sutdy.ID, '', '', '', '', '')
            
			//Get value of interest : Patient Name / ID / DOB / study date and description
			let nom = patient.MainDicomTags.PatientName;
			let id = patient.ID;
			let studyDescription = study.MainDicomTags.StudyDescription;
			let accessionNumber = study.MainDicomTags.AccessionNumber;
		
			formattedDateExamen = "N/A";
			if(study.MainDicomTags.StudyDate !== null) {
                formattedDateExamen = study.MainDicomTags.StudyDate.toLocaleDateString(undefined, this.DateOptions)
			}
			
			formattedPatientDOB = "N/A";
			try {
				let patientDOBDate = patient.MainDicomTags.PatientBirthDate;
				formattedPatientDOB = patientDOBDate.toLocaleDateString(this.format, this.DateOptions);
			}catch (e) { }
			
			let modalitiesInStudy = String.join("//", study.getModalitiesInStudy());
			
			//Generate the ZIP with Orthanc IDs dicom
			let orthancIds = []
			orthancIds.push(studyID);

            Orthanc.exportArchiveDicom(study.MainDicomTags.StudyID, Orthanc.exportArchiveDicom(study.MainDicomTags.StudyID))

            let datInfos = {
                nom: patient.MainDicomTags.PatientName,
                id: patient.MainDicomTags.PatientID ,
                formattedDateExamen: formattedDateExamen,
                studyDescription: studyDescription,
                accessionNumber: accessionNumber,
                formattedPatientDOB: formattedPatientDOB,
                modalitiesInStudy: modalitiesInStudy
            } 

            // Unzip du fichier ZIP recupere
            for(u=0; u<studies.length ; u++) {
                fs.readFile('./data/export_dicom/' + Orthanc.exportArchiveDicom(studies[u].MainDicomTags.StudyID + '.zip', function(err, data) {
                if (err) throw err;
                    JSZip.loadAsync(data).then(function (zip) {
                        
                        tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
                            if (err) throw err;
                                fs.writeFile(path, zip, function(err) {
                                    if(err) {
                                        return console.log(err);
                                    }
                                }); 
                            
                            // Creation du Cd
                            if (this.burnerManifacturer === "Epson") {
                                let discType = _determineDiscType();
                                let dat = _printDat(datInfos);
                                //Generation du Dat
                                //dat = _printDat(nom, id, formattedDateExamen, studyDescription, accessionNumber, formattedPatientDOB );
                                let requestFileAndID = _createCdBurnerEpson(dat, discType, patient.getName(), "Mutiples");
                                
                            } else if(this.burnerManifacturer ==="Primera") {
                                let requestFileAndID = _createCdBurnerPrimera(patient.getName(), patient.getPatientId(), "Mutiples", studies.size()+" studies", "Mutiples", formattedPatientDOB ,studies.size(), modalitiesInStudyPrimera);
                            }    

                            //On efface la study de Orthanc
                            if (deleteStudies) {
                                //ToDo //connexion.makeDeleteConnection("/patients/"+patientID);
                            }

                            cleanupCallback();
                        });

                    });
                }));
            }
		}
    }
    
    _determineDiscType() {
		let discType
		if ( !suportType === "Auto") {
			discType=suportType;
		} else {
			//Get size of viewer and images to determine if CD or DVD to Burn
			let imageSize = fs.statSync('ToDo').size;
			let ViewerSize = fs.statSync('ToDo').size;
			//If size over 630 Mo
			if(imageSize + ViewerSize > 630000000) {
				discType="DVD";
			} else {
				discType="CD";
			}
		}
		
		return discType;
    }
    
    _printDat(infos) {

        //On parse le nom pour enlever les ^ et passer le prenom en minuscule
        let nom = infos[0].nom;
        let separationNomPrenom = nom.indexOf("^", 0);
        if (separationNomPrenom!=-1) {
            nom = nom.substring(0, separationNomPrenom+2)+nom.substring(separationNomPrenom+2).toLowerCase();
        }
        
         let datFile = "patientName="+nom.replaceAll("\\^", " ")+"\n"
                     + "patientId=" + infos[0].id +"\n"
                     + "studyDate="+ infos[0].date + "\n"
                     + "modalities="+infos[0].modalities+"\n"
                     //patient date is a duplicate of studydate (depreciated)
                     + "patientDate="+ infos[0].patientDOB + "\n"
                     + "studyDescription="+ infos[0].studyDescription+"\n"
                     + "accessionNumber="+ infos[0].accessionNumber+"\n"
                     + "patientDOB="+infos[0].patientDOB+"\n"
                     + "numberOfStudies="+infos.length+"\n";
         
         for(i=1; i<infos.length ; i++) {
             datFile+= "studyDate"+(i+1)+"="+ infos[i].date + "\n"
                     + "studyDescription"+(i+1)+"="+ infos[i].studyDescription+"\n"
                     + "accessionNumber"+(i+1)+"="+ infos[i].accessionNumber+"\n"
                     + "modalities"+(i+1)+"="+infos[i].modalities+"\n";
         }

         let dat = fs.appendFile(folder + File.separator + "CD"+dateFormat.format(datenow)+".dat", datFile, function (err) {
            if (err) throw err;
            console.log('Saved!');
          });

         return dat;
    }

    _createCdBurnerEpson(dat, discType, name, formattedStudyDate){
        //REalisation du texte pour le Robot
        let txtRobot= "# Making data CD\n";
        let jobId = _createJobID(name, formattedStudyDate);
        //Peut definir le Job ID et le mettre le compteur dans registery si besoin de tracer les operation avec fichier STF
        if(jobId!=null) txtRobot += "JOB_ID="+jobId+"\n";
        
        txtRobot += "#nombre de copies\n"
        + "COPIES=1\n"
        + "#CD ou DVD\n"
        + "DISC_TYPE="+discType+"\n"
        + "FORMAT=UDF102\n"
        + "DATA="+viewerDirectory+"\n"
        + "DATA="+folder+ File.separator+ "DICOM" +File.separator+"\n"
        + "#Instruction d'impression\n"
        + "LABEL="+labelFile+"\n"
        + "REPLACE_FIELD="+dat.getAbsolutePath().toString();

        // On ecrit le fichier JDF
        
        let f = fs.appendFile(epsonDirectory + File.separator + "CD_" + dateFormat.format(datenow) + ".JDF", txtRobot, function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
        
        let answer = {f, jobId};
        return answer;                
    }

    _createCdBurnerPrimera(nom, id, date, studyDescription, accessionNumber, patientDOB, nbStudies, modalities){
		//Command Keys/Values for Primera Robot
		 let txtRobot
		 let jobId = _createJobID(nom, date);
		
		if(jobId != null) txtRobot +="JobID="+jobId+"\n";
			
		txtRobot += "ClientID = Orthanc-Tools"
				+"Copies = 1\n"
				+ "DataImageType = UDF\n"
				+ "Data="+viewerDirectory+"\n"
				+ "Data="+folder+ File.separator+ "DICOM\n"
				+ "RejectIfNotBlank=YES\n"
				+ "CloseDisc=YES\n"
				+ "VerifyDisc=YES\n"
				/* PrintQuality - This key specifies the print quality. Key is optional.
				The possible values : Low = 0, Medium =1, Better =2 High =3 Best =4*/
				+ "PrintQuality=1\n"
				/*PrintLabel - This specifies path and filename of the label to print on disc.
                The possible file types are .STD (SureThingTM), .jpg (JPEG), .bmp (Windows Bitmap), or .PRN (printed to file through any application). 
                If this key is not given then no printing will be performed. 
                */
				+ "PrintLabel="+labelFile+"\n"
				/* MergeField - This key specifies a merge field for SureThing printing.
				The print file specified within the JRQ must be a SureThing file, 
				and it must have been designed with a Merge File specified.
				Fields should be specified in the correct order to match the SureThing design.
				*/
				+ "MergeField="+nom+"\n"
				+ "MergeField="+id+"\n"
				+ "MergeField="+date+"\n"
				+ "MergeField="+studyDescription+"\n"
				+ "MargeField="+patientDOB+"\n"
				+ "MergeField="+accessionNumber+"\n"
				+ "MergeField="+nbStudies+"\n"
				+ "MergeField="+modalities+"\n";
		
		// Making a .JRQ file in the watched folder
        let f = fs.appendFile(epsonDirectory + File.separator + "CD_"+dateFormat.format(datenow)+".JRQ", txtRobot, function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
        
		
		let answer = {f, jobId};
		return answer;		
	}

     _createJobID(name, formattedStudyDate) {
        let results = "";

        let lastName = null;
		let firstName= "";
		//prepare JOB_ID string.
		if(name.contains("^")) {
			let names = name.split(Pattern.quote("^"));
			//Get 10 first character of lastname and first name if input over 10 characters
			if(names[0].length()>5) lastName=names[0].substring(0, 5); else lastName=names[0];
			if(names[1].length()>5) firstName=names[1].substring(0, 5); else firstName=names[1];
			
		}else {
			if(name.length !== 0) {
				if(name.length>10) lastName = name.substring(0, 10); else lastName = name;
			//No name information return null
			}else {
				return null;
			}
			
		}
		
		results = lastName+"_"+firstName+"_"+formattedStudyDate+"_"+ Math.round(Math.random()*1000);
		//Remove Accent and space to match requirement of burners
		results = results.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); //stripAccents
		results = results.trim();
		//Remove non alpha numeric character (except let _)
		results = results.replaceAll("[^a-zA-Z0-9_]", ""); 
		
		return results;
	}
}    

const cdBurner = new CdBurner();
Object.freeze(cdBurner);

exports.cdBurner = cdBurner
exports.CdBurner = CdBurner