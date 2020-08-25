var fs = require("fs");
var fsPromises = require('fs')
var JSZip = require("jszip");
const tmp = require('tmp');
const tmpPromise = require('tmp-promise');
const orthanc_Monitoring = require('../Orthanc_Monitoring')
const db = require('../../../database/models')


class CdBurner {

    constructor(monitoring) {
        this.orthanc = monitoring.orthanc
        this.monitoring = monitoring
    }

    async setSettings() {

        //Date format
        this.dateOptions = { month: 'numeric', day: 'numeric' } //precision of the date

        const options = await db.Option.findOne({
            attributes: ['dateFormat'],
        });

        //format of date (using contry convention)
        if (options.dateFormat === "fr") {
            this.format = "fr-FR"
        } else if (format === "uk") {
            this.format = "uk-UA"
        } else {
            this.format = "uk-UA"
        }

        //SK A FILL A PARTIR DE LA DB
        this.labelFile = ''
        this.monitoringLevel = ''
        this.burnerManifacturer = '' //Epson or Primera
        this.monitoredFolder = ''
        this.viewerPath = options.CDBurnerViewerPath;
    }

    async startCDMonitoring() {
        if (this.monitoringStarted) return

        this.monitoringStarted = true
        //Fill options value from DB
        await this.setSettings()
        //Create listener
        this.__makeListener()
        //Start monitoring service
        this.monitoring.startMonitoring()

    }

    /**
     * Set Event listener according to monitoring level
     */
    __makeListener() {
        if (this.monitoringLevel === CdBurner.MONITOR_PATIENT) {
            this.monitoring.on('StablePatient', (orthancID) => { this._makeCDFromPatient(orthancID) })
        } else if (this.monitoringLevel === CdBurner.MONITOR_STUDY) {
            this.monitoring.on('StableStudy', (orthancID) => { this._makeCD(orthancID) })
        }
    }

    /**
     * Destroy event listener according to monitoring level
     */
    __removeListener() {
        if (this.monitoringLevel === CdBurner.MONITOR_PATIENT) {
            this.monitoring.removeListener('StablePatient', (orthancID) => { this._makeCDFromPatient(orthancID) })
        } else if (this.monitoringLevel === CdBurner.MONITOR_STUDY) {
            this.monitoring.removeListener('StableStudy', (orthancID) => { this._makeCD(orthancID) })
        }
    }

    stopCDMonitoring() {
        this.monitoringStarted = false
        //In Future version, centralize monitoring status of service and shutdown monitoring if all are stopped
        this.monitoring.stopMonitoring()
        this.__removeListener()

    }

    async _makeCDFromPatient(newStablePatientID) {
        //SK A REFACTORISER POUR AVOIR LES STUDIES DU PATIENT
        //SK A VERIFIER SI PLUSIEURS EVENT EN MEME TEMPS EN ASYNC LA CHARGE SERVEUR
        let patient = this.orthanc.findInOrthanc('Patient', '', newStablePatientID, '', '', '', '', '')//Obtenir les infos d un patient depuis son patientID
        let studies = this.orthanc.findInOrthanc('Study', '', newStablePatientID, '', '', '', '', '')

        if (studies.length === 1) {
            let newStableStudyID = studies[0].MainDicomTags.StudyID //Recuper la studyID à partie de la studies du patientID
            this.makeCD(newStableStudyID)
            return
        }

        let formattedPatientDOB = "N/A"
        try {
            let patientDOB = patient.MainDicomTags.PatientBirthDate //date d'anniversaire du patient
            formattedPatientDOB = patientDOB.toLocaleDateString(this.format, this.dateOptions) //date d'anniverssaire formaté du patient
        } catch (err) {
            console.log(err)
        }

        let datInfos = [studies.length]
        let uniqueModalitiesForPrimera = []

        for (i = 0; i < studies.length; i++) {
            let formattedDateExamen = "N/A";
            if (studies[i].MainDicomTags.StudyDate !== null) formattedDateExamen = studies[i].MainDicomTags.StudyDate.toLocaleString();
            let studyDescription = studies[i].MainDicomTags.StudyDescription;
            let accessionNumber = studies[i].MainDicomTags.AccessionNumber;

            let series = studies[i].Series

            let modalities = []
            for (u = 0; u < series.length; u++) {
                let modality = series[u].MainDicomTags.Modality;
                if (!modalities.contains(modality)) modalities.push(modality);
            }

            let modalitiesInStudy
            for (u = 0; u < modalities.length; u++) {
                modalitiesInStudy = String.join("//", modalities[u]);
            }

            for (u = 0; u < modalities.length; u++) {
                if (!uniqueModalitiesForPrimera.contains(modalities[u])) {
                    uniqueModalitiesForPrimera.push(modalities[u]);
                }
            }

            datInfos[i] = {
                Name: patient.MainDicomTags.PatientName,
                getPatientId: patient.MainDicomTags.PatientID,
                formattedDateExamen: formattedDateExamen,
                studyDescription: studyDescription,
                accessionNumber: accessionNumber,
                formattedPatientDOB: formattedPatientDOB,
                modalitiesInStudy: modalitiesInStudy
            }
        }

        let modalitiesInStudyPrimera = String.join("//", uniqueModalitiesForPrimera);

        //Generate the ZIP with Orthanc IDs dicom
        for (u = 0; u < studies.length; u++) {
            Orthanc.exportArchiveDicom(studies[u].MainDicomTags.StudyID, Orthanc.exportArchiveDicom(studies[u].MainDicomTags.StudyID))
        }

        // Unzip du fichier ZIP recupere
        for (u = 0; u < studies.length; u++) {
            
            let data = await fs.promises.readFile('./data/export_dicom/' + Orthanc.exportArchiveDicom(studies[u].MainDicomTags.StudyID + '.zip'))
            
            tmpPromise.dir({ unsafeCleanup : true }).then( async (directory)=>{

                var jsZip = new JSZip();
                let writeFileUnzipedPromises = []
                jsZip.loadAsync(data, {createFolders: true}).then ((contents)=>{
                    Object.keys(contents.files).forEach( (filename) => {
                        let writePromise = jsZip.file(filename).async('nodebuffer').then((content)=>{
                            var dest = directory + filename;
                            fs.writeFileSync(dest, content);
                        })

                        writeFileUnzipedPromises.push(writePromise)
                    })
                })

                Promise.all(writeFileUnzipedPromises).then(async ()=>{

                    let requestFileAndID

                    if (this.burnerManifacturer === MONITOR_CD_EPSON) {
                        let discType = await _determineDiscType()
                        let dat = await _printDat(datInfos);
                        //Generation du Dat
                        requestFileAndID = await _createCdBurnerEpson(dat, discType, patient.getName(), "Mutiples")
    
                    } else if (this.burnerManifacturer === MONITOR_CD_PRIMERA) {
                        requestFileAndID = await _createCdBurnerPrimera(patient.getName(), patient.getPatientId(), "Mutiples", studies.size() + " studies", "Mutiples", formattedPatientDOB, studies.size(), modalitiesInStudyPrimera)
                    }
    
                    //On efface la study de Orthanc
                    if (deleteStudies) {
                        //await this.orthanc.deleteFromOrthanc('studies')
                    }

                    // Creation du Cd
                    // Manual cleanup
                    directory.cleanup();

                })
               
            })

        }


    }

    _makeCD(newStableStudyID) {
        for (i = 0; i < newStableStudyID.length; i++) {

            //study = ortancQuery.getStudyDetails(studyID, true);
            let study = this.orthanc.findInOrthanc('Study', '', newStablePatientID, '', '', '', '', '')

            let patient = this.orthanc.findInOrthanc('Patient', '', sutdy.ID, '', '', '', '', '')

            //Get value of interest : Patient Name / ID / DOB / study date and description
            let nom = patient.MainDicomTags.PatientName;
            let id = patient.ID;
            let studyDescription = study.MainDicomTags.StudyDescription;
            let accessionNumber = study.MainDicomTags.AccessionNumber;

            formattedDateExamen = "N/A";
            if (study.MainDicomTags.StudyDate !== null) {
                formattedDateExamen = study.MainDicomTags.StudyDate.toLocaleDateString(undefined, this.dateOptions)
            }

            formattedPatientDOB = "N/A";
            try {
                let patientDOBDate = patient.MainDicomTags.PatientBirthDate;
                formattedPatientDOB = patientDOBDate.toLocaleDateString(this.format, this.dateOptions);
            } catch (e) { }

            let modalitiesInStudy = String.join("//", study.getModalitiesInStudy());

            //Generate the ZIP with Orthanc IDs dicom
            let orthancIds = []
            orthancIds.push(studyID);

            Orthanc.exportArchiveDicom(study.MainDicomTags.StudyID, Orthanc.exportArchiveDicom(study.MainDicomTags.StudyID))

            let datInfos = [{
                nom: patient.MainDicomTags.PatientName,
                id: patient.MainDicomTags.PatientID,
                formattedDateExamen: formattedDateExamen,
                studyDescription: studyDescription,
                accessionNumber: accessionNumber,
                formattedPatientDOB: formattedPatientDOB,
                modalitiesInStudy: modalitiesInStudy
            }]

            // Unzip du fichier ZIP recupere
            for (u = 0; u < studies.length; u++) {
                fs.readFile('./data/export_dicom/' + Orthanc.exportArchiveDicom(studies[u].MainDicomTags.StudyID + '.zip', function (err, data) {
                    if (err) throw err;
                    JSZip.loadAsync(data).then(function (zip) {

                        tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
                            if (err) throw err;
                            fs.writeFile(path, zip, function (err) {
                                if (err) {
                                    return console.log(err);
                                }
                            });

                            let requestFileAndID
                            // Creation du Cd
                            if (this.burnerManifacturer === MONITOR_CD_EPSON) {
                                let discType = _determineDiscType()
                                //Generation du Dat
                                let dat = _printDat(datInfos);
                                requestFileAndID = await _createCdBurnerEpson(dat, discType, patient.getName(), "Mutiples");

                            } else if (this.burnerManifacturer === MONITOR_CD_PRIMERA) {
                                requestFileAndID = await _createCdBurnerPrimera(patient.getName(), patient.getPatientId(), "Mutiples", studies.size() + " studies", "Mutiples", formattedPatientDOB, studies.size(), modalitiesInStudyPrimera);
                            }

                            //On efface la study de Orthanc
                            if (deleteStudies) {
                                //ToDo
                            }

                            cleanupCallback();
                        });

                    });
                }));
            }
        }
    }

    /**
     * Calculate the amount of data to be burn on the media and return cd type
     * @param {string} dicomPath 
     */
    async _determineDiscType(dicomPath) {
        let discType
        if (suportType !== CdBurner.MONITOR_CD_TYPE_AUTO) {
            discType = suportType;
        } else {

            //Get viewer Path Size
            let viewerSize = await fsPromises.open(this.viewerPath).then((filehandle) => { return filehandle.stat() }).then(stat => {
                return stat.size
            })
            console.log(viewerSize)

            //Get DICOM Path Size
            let imageSize = await fsPromises.open(dicomPath).then((filehandle) => { return filehandle.stat() }).then(stat => {
                return stat.size
            })
            console.log(imageSize)

            //If size over 630 Mo
            if (imageSize + viewerSize > 630000000) {
                discType = CdBurner.MONITOR_CT_TYPE_DVD
            } else {
                discType = CdBurner.MONITOR_CT_TYPE_CD
            }
        }

        return discType;
    }

    async _printDat(infos) {

        //On parse le nom pour enlever les ^ et passer le prenom en minuscule
        let nom = infos[0].nom;
        let separationNomPrenom = nom.indexOf("^", 0);
        if (separationNomPrenom != -1) {
            nom = nom.substring(0, separationNomPrenom + 2) + nom.substring(separationNomPrenom + 2).toLowerCase();
        }

        let datFile = "patientName=" + nom.replaceAll("\\^", " ") + "\n"
            + "patientId=" + infos[0].id + "\n"
            //patient date is a duplicate of studydate (depreciated)
            + "patientDate=" + infos[0].patientDOB + "\n"
            + "patientDOB=" + infos[0].patientDOB + "\n"
            + "numberOfStudies=" + infos.length + "\n"

        for (let i = 0; i < infos.length; i++) {
            if (i == 0) {
                datFile += "studyDate=" + infos[i].date + "\n"
                    + "studyDescription=" + infos[i].studyDescription + "\n"
                    + "accessionNumber=" + infos[i].accessionNumber + "\n"
                    + "modalities=" + infos[i].modalities + "\n"
            } else {
                datFile += "studyDate" + (i + 1) + "=" + infos[i].date + "\n"
                    + "studyDescription" + (i + 1) + "=" + infos[i].studyDescription + "\n"
                    + "accessionNumber" + (i + 1) + "=" + infos[i].accessionNumber + "\n"
                    + "modalities" + (i + 1) + "=" + infos[i].modalities + "\n"
            }

        }

        let dat = await fs.appendFile(folder + File.separator + "CD" + dateFormat.format(datenow) + ".dat", datFile, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });

        return dat;
    }

    async _createCdBurnerEpson(dat, discType, name, formattedStudyDate) {
        //Builiding text file for robot request
        let txtRobot = "# Making data CD\n";
        let jobId = _createJobID(name, formattedStudyDate);
        //Peut definir le Job ID et le mettre le compteur dans registery si besoin de tracer les operation avec fichier STF
        if (jobId != null) txtRobot += "JOB_ID=" + jobId + "\n";

        txtRobot += "#nombre de copies\n"
            + "COPIES=1\n"
            + "#CD ou DVD\n"
            + "DISC_TYPE=" + discType + "\n"
            + "FORMAT=UDF102\n"
            + "DATA=" + viewerDirectory + "\n"
            + "DATA=" + folder + File.separator + "DICOM" + File.separator + "\n"
            + "#Instruction d'impression\n"
            + "LABEL=" + labelFile + "\n"
            + "REPLACE_FIELD=" + dat.getAbsolutePath().toString();

        // Wrint JDF file in monitoring folder
        await fs.promises.appendFile(this.monitoredFolder + File.separator + "CD_" + dateFormat.format(datenow) + ".JDF", txtRobot)

        let answer = { f, jobId };
        return answer;
    }

    async _createCdBurnerPrimera(nom, id, date, studyDescription, accessionNumber, patientDOB, nbStudies, modalities) {
        //Command Keys/Values for Primera Robot
        let txtRobot
        let jobId = _createJobID(nom, date);

        if (jobId != null) txtRobot += "JobID=" + jobId + "\n";

        txtRobot += "ClientID = Orthanc-Tools"
            + "Copies = 1\n"
            + "DataImageType = UDF\n"
            + "Data=" + viewerDirectory + "\n"
            + "Data=" + folder + File.separator + "DICOM\n"
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
            + "PrintLabel=" + labelFile + "\n"
            /* MergeField - This key specifies a merge field for SureThing printing.
            The print file specified within the JRQ must be a SureThing file, 
            and it must have been designed with a Merge File specified.
            Fields should be specified in the correct order to match the SureThing design.
            */
            + "MergeField=" + nom + "\n"
            + "MergeField=" + id + "\n"
            + "MergeField=" + date + "\n"
            + "MergeField=" + studyDescription + "\n"
            + "MargeField=" + patientDOB + "\n"
            + "MergeField=" + accessionNumber + "\n"
            + "MergeField=" + nbStudies + "\n"
            + "MergeField=" + modalities + "\n";

        // Making a .JRQ file in the watched folder
        await fs.promises.appendFile(this.monitoredFolder + File.separator + "CD_" + dateFormat.format(datenow) + ".JRQ", txtRobot)

        let answer = { f, jobId };
        return answer;
    }

    _createJobID(name, formattedStudyDate) {
        let results

        let lastName = null;
        let firstName;
        //prepare JOB_ID string.
        if (name.contains("^")) {
            let names = name.split(Pattern.quote("^"));
            //Get 10 first character of lastname and first name if input over 10 characters
            if (names[0].length() > 5) lastName = names[0].substring(0, 5); else lastName = names[0];
            if (names[1].length() > 5) firstName = names[1].substring(0, 5); else firstName = names[1];

        } else {
            if (name.length !== 0) {
                if (name.length > 10) lastName = name.substring(0, 10); else lastName = name;
            } else {
                //No name information return null
                return null;
            }

        }

        results = lastName + "_" + firstName + "_" + formattedStudyDate + "_" + Math.round(Math.random() * 1000);
        //Remove Accent and space to match requirement of burners
        results = results.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); //stripAccents
        results = results.trim();
        //Remove non alpha numeric character (except let _)
        results = results.replaceAll("[^a-zA-Z0-9_]", "");

        return results;
    }
}

const cdBurner = new CdBurner(orthanc_Monitoring)

const MONITOR_PATIENT = "Patient";
const MONITOR_STUDY = "Study"

const MONITOR_CD_TYPE_AUTO = "auto"
const MONITOR_CD_TYPE_CD = "CD"
const MONITOR_CT_TYPE_DVD = "DVD"

const MONITOR_CD_PRIMERA = "Primera"
const MONITOR_CD_EPSON = "Epson"

Object.freeze(cdBurner);
exports.CdBurner = CdBurner
exports.cdBurner = cdBurner