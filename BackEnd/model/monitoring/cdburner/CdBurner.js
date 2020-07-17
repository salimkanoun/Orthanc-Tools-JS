const Orthanc = require('../../Orthanc')
var fs = require("fs");
var JSZip = require("jszip");
const tmp = require('tmp');


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

        this.burnerManifacturer

        this.DateOptions = {month: 'numeric', day: 'numeric'}
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

    async _makeCDFromPatient(newStablePatientID) {
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
            formattedPatientDOB = PatientDOB.toLocaleDateString(undefined, this.DateOptions) //datte d'anniverssaire formaté du patient
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
                            discType = _determineDiscType();
                            dat = _printDat(datInfos);
                            //Generation du Dat
                            //dat = _printDat(nom, id, formattedDateExamen, studyDescription, accessionNumber, formattedPatientDOB );
                            requestFileAndID = _createCdBurnerEpson(dat, discType, patient.getName(), "Mutiples");
                            
                        } else if(this.burnerManifacturer ==="Primera") {
                            requestFileAndID = _createCdBurnerPrimera(patient.getName(), patient.getPatientId(), "Mutiples", studies.size()+" studies", "Mutiples", formattedPatientDOB ,studies.size(), modalitiesInStudyPrimera);
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
			
			study = ortancQuery.getStudyDetails(studyID, true);
			patient = ortancQuery.getPatient(study.getParentPatientId());
			//Store the Row number where we are going to display progress
			rownumber = table_burning_history.getRowCount();
			
			//Get value of interest : Patient Name / ID / DOB / study date and description
			nom = patient.getName();
			id = patient.getPatientId();
			studyDescription = study.getStudyDescription();
			accessionNumber = study.getAccession();
		
			formattedDateExamen = "N/A";
			if(study.getDate()!=null) {
				formattedDateExamen = formatter.format(study.getDate());
			}
			
			formattedPatientDOB="N/A";
			try {
				patientDOBDate = parserDate.parse(patient.getPatientBirthDate());
				formattedPatientDOB = formatter.format(patientDOBDate);
			}catch (e) { }
			
			modalitiesInStudy = String.join("//", study.getModalitiesInStudy());
			
			//Update display status
			//ToDo
			
			//Generate the ZIP with Orthanc IDs dicom
			orthancIds= []
			orthancIds.add(studyID);
			zip = generateZip(orthancIds);
			
			// Unzip du fichier ZIP recupere
			table_burning_history.setValueAt("Unzipping", rownumber, 5);
			unzip(zip);

			requestFileAndID = null;
			// Creation du Cd
			if (burnerManifacturer.equals("Epson")) {
				discType = determineDiscType();
				//Generation du Dat
				dat = printDat(nom, id, formattedDateExamen, studyDescription, accessionNumber, formattedPatientDOB, modalitiesInStudy );
				requestFileAndID = createCdBurnerEpson(dat, discType, nom, formattedDateExamen);
				
			} else if(burnerManifacturer.equals("Primera")) {
				requestFileAndID = createCdBurnerPrimera(nom, id, formattedDateExamen, studyDescription, accessionNumber, formattedPatientDOB, 1, modalitiesInStudy);
			}
			
			//On efface tout a la sortie JVM
			recursiveDeleteOnExit(folder);
			//Efface le zip dezipe
			zip.delete();
			
			//On efface la study de Orthanc
			if (deleteStudies) connexion.makeDeleteConnection("/studies/"+studyID);
				
		}
    }
    
    _determineDiscType() {
		let discType
		if ( !suportType === "Auto") {
			discType=suportType;
		} else {
			//Get size of viewer and images to determine if CD or DVD to Burn
			imageSize = fs.statSync('ToDo').size;
			ViewerSize = fs.statSync('ToDo').size;
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
        nom = infos[0].nom;
        separationNomPrenom = nom.indexOf("^", 0);
        if (separationNomPrenom!=-1) {
            nom=nom.substring(0, separationNomPrenom+2)+nom.substring(separationNomPrenom+2).toLowerCase();
        }
        
         datFile = "patientName="+nom.replaceAll("\\^", " ")+"\n"
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

         dat = fs.appendFile(folder + File.separator + "CD"+dateFormat.format(datenow)+".dat", datFile, function (err) {
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
        
        f = fs.appendFile(epsonDirectory + File.separator + "CD_" + dateFormat.format(datenow) + ".JDF", txtRobot, function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
        
        answer = {f, jobId};
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
		lastName = null;
		firstName= "";
		//prepare JOB_ID string.
		if(name.contains("^")) {
			names = name.split(Pattern.quote("^"));
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

module.exports = CdBurner