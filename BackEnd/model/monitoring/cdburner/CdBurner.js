var fsPromises = require('fs').promises
var JSZip = require("jszip")
const path = require('path');
const tmpPromise = require('tmp-promise')
const orthanc_Monitoring = require('../Orthanc_Monitoring')
const db = require('../../../database/models')
const moment = require('moment')
const recursive = require("recursive-readdir");

//SK RESTE A FAIRE
//Debug des metadonnées (cf infra)
//recuperation des modalities
//debug patient
//TRACKING DES PROCESS
//HISTORIQUE DES CDS
//Transcoding dans export


class CdBurner {

    constructor(monitoring) {
        this.orthanc = monitoring.orthanc
        this.monitoring = monitoring
    }

    async setSettings() {

        //Date format
        this.dateOptions = { month: 'numeric', day: 'numeric', year : 'numeric' } //precision of the date

        const options = await db.Option.findOne({
            attributes: ['date_format',
            'burner_label_file','burner_monitoring_level','burner_burner_manifacturer'
            ,'burner_monitored_folder','burner_delete_study_after_sent','burner_viewer_path', 'burner_support_type'],
        });

        //format of date (using contry convention)
        if (options.date_format === "fr") {
            this.format = "DD/MM/YYYY"
        } else if (options.date_format === "uk") {
            this.format = "MM/DD/YYYY"
        } else {
            this.format = "MM/DD/YYYY"
        }

        //Refresh parameter from DB
        this.labelFile = options.burner_label_file
        this.monitoringLevel = options.burner_monitoring_level
        this.burnerManifacturer = options.burner_burner_manifacturer
        this.monitoredFolder = options.burner_monitored_folder
        this.deleteStudyAfterSent = options.burner_delete_study_after_sent
        this.viewerPath = options.burner_viewer_path
        this.suportType = options.burner_support_type

        //TEST
        this.monitoringLevel = CdBurner.MONITOR_STUDY
        this.burnerManifacturer = CdBurner.MONITOR_CD_EPSON
        this.monitoredFolder = 'C:\\Users\\kanoun_s\\Documents\\cdBurner'
        this.deleteStudyAfterSent = false
        this.viewerPath = 'C:\\Users\\kanoun_s\\Documents\\monitoring'
        this.suportType = CdBurner.MONITOR_CD_TYPE_AUTO
        this.labelFile = 'labelPath'
        this._makeCD('4197238a-fd8a087e-b411f628-693092b5-badcccd0')
        
    }

    /**
     * Start Cd Monitoring process
     */
    async startCDMonitoring() {
        if (this.monitoringStarted) return

        this.monitoringStarted = true
        //Fill options value from DB
        await this.setSettings()
        //Create listener
        this.__makeListener()
        //Start monitoring service
        this.monitoring.startMonitoringService(orthanc_Monitoring.MONITORING_SERVICE_CDBURNER)
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

    /**
     * Stops Monitoring Process
     */
    stopCDMonitoring() {
        this.monitoringStarted = false
        this.__removeListener()
        this.monitoring.stopMonitoringService(orthanc_Monitoring.MONITORING_SERVICE_CDBURNER)
    }

    /**
     * download dicom from orthanc and unzip archive in a temporary folder
     * return temporary path (containings dicom)
     * SK : A FAIRE LE TRANSCODING
     * @param {Array} studies 
     */
    async __unzip(studies){

        let studyOrthancIDArray  = studies.map((study)=>{
            return study.ID
        })

        let zipFileName = await this.orthanc.getArchiveDicom(studyOrthancIDArray)

        var jsZip = new JSZip()

        let unzipedFolder = await tmpPromise.dir({ unsafeCleanup : true }).then( (directory)=>{
            return fsPromises.readFile(zipFileName).then((data)=>{
                return jsZip.loadAsync(data, {createFolders: true})
            }).then ( (contents)=>{
                let writeFileUnzipedPromises = []

                Object.keys(contents.files).forEach( (filename) => {
                    if(contents.files[filename].dir) return
                    
                    let writePromise = jsZip.file(filename).async('nodebuffer').then((content)=>{
                        var dest = path.join(directory.path, filename)
                        return fsPromises.mkdir(path.dirname(dest), { recursive: true }).then( () => fsPromises.appendFile(dest, content))
                    })

                    writeFileUnzipedPromises.push(writePromise)

                })
                return writeFileUnzipedPromises
            }).then((writepromises)=>{
                return Promise.all(writepromises)
            }).then( ()=> fsPromises.unlink(zipFileName) ).then( ()=> directory.path)

        })

        return unzipedFolder;

    }

    async _makeCDFromPatient(newStablePatientID) {
        //SK A REFACTORISER POUR AVOIR LES STUDIES DU PATIENT
        //SK A VERIFIER SI PLUSIEURS EVENT EN MEME TEMPS EN ASYNC LA CHARGE SERVEUR
        //SK A CORRIGER POUR LES DATES ICI
        let patient = await this.orthanc.findInOrthanc('Patient', '', newStablePatientID, '', '', '', '', '')//Obtenir les infos d un patient depuis son patientID
        let studies = await this.orthanc.findInOrthanc('Study', '', newStablePatientID, '', '', '', '', '')

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

        let unzipedFolder = await this.__unzip(studies)

        if (this.burnerManifacturer === CdBurner.MONITOR_CD_EPSON) {
            let discType = await this._determineDiscType(unzipedFolder)
            let dat = await this._printDat(datInfos);
            //Generation du Dat
            requestFileAndID = await this._createCdBurnerEpson(dat, discType, patient.MainDicomTags.PatientName, "Mutiples", unzipedFolder)

        } else if (this.burnerManifacturer === CdBurner.MONITOR_CD_PRIMERA) {
            nom, id, date, studyDescription, accessionNumber, patientDOB, nbStudies, modalities
            //SK ICI METHODE POUR RECUPERE LES MODALITIES IN STUDY
            let modalitiesInStudyPrimera = "MODALITIES"
            requestFileAndID = await this._createCdBurnerPrimera(patient.MainDicomTags.PatientName, 
                patient.MainDicomTags.PatientID, 
                "Mutiples", 
                (studies.length + " studies") , 
                "Mutiples", 
                formattedPatientDOB, 
                studies.length, 
                modalitiesInStudyPrimera,
                unzipedFolder)
        }

        if (this.deleteStudyAfterSent) {
            this.orthanc.deleteFromOrthanc('patients', newStablePatientID)
        }

    }

    async _makeCD(newStableStudyID) {
        let study = await this.orthanc.getOrthancDetails('studies', newStableStudyID)
        let patient = await this.orthanc.getOrthancDetails('patients', study.ParentPatient)

        let formattedDateExamen = "N/A"
        console.log(study)
        if (study.MainDicomTags.StudyDate !== undefined) {
            let parsedDate = moment(study.MainDicomTags.StudyDate, "YYYYMMDD")
            console.log(parsedDate)
            formattedDateExamen = moment(parsedDate).format(this.format)
        }

        let formattedPatientDOB = "N/A";
        try {
            let patientDOBDate = moment(patient.MainDicomTags.PatientBirthDate, "YYYYMMDD")
            formattedPatientDOB = moment(patientDOBDate).format(this.format);
        } catch (e) { }

        //SK ICI FAIRE DE QUOI RECUPERER LES MODALITIES IN STUDY
        let modalitiesInStudy = "MODALITY" //String.join("//", study.getModalitiesInStudy());

        //Generate the ZIP with Orthanc IDs dicom
        let unzipedFolder = await this.__unzip([study])

        //SK DEBEUGER ICI
        let datInfos = [{
            nom: patient.MainDicomTags.PatientName,
            id: patient.MainDicomTags.PatientID,
            formattedDateExamen: formattedDateExamen,
            studyDescription: study.MainDicomTags.StudyDescription,
            accessionNumber: study.MainDicomTags.AccessionNumber,
            formattedPatientDOB: formattedPatientDOB,
            modalitiesInStudy: modalitiesInStudy
        }]

        let requestFileAndID

        if (this.burnerManifacturer === CdBurner.MONITOR_CD_EPSON) {
            let discType = await this._determineDiscType(unzipedFolder)
            //Generation du Dat
            let dat = await this._printDat(datInfos);
            requestFileAndID = await this._createCdBurnerEpson(dat, discType, datInfos.nom, datInfos.formattedDateExamen, unzipedFolder);

        } else if (this.burnerManifacturer === CdBurner.MONITOR_CD_PRIMERA) {
            requestFileAndID = await this._createCdBurnerPrimera(datInfos.nom, 
                datInfos.id, 
                datInfos.formattedDateExamen, 
                studies[u].MainDicomTags.StudyDescription, 
                studies[u].MainDicomTags.AccessionNumber, 
                datInfos.formattedPatientDOB, 
                1, 
                datInfos.modalitiesInStudy, 
                unzipedFolder);
        }

        //On efface la study de Orthanc
        if (this.deleteStudyAfterSent) {
            await this.orthanc.deleteFromOrthanc('studies', newStableStudyID)
        }

        

    }

    /**
     * Calculate the amount of data to be burn on the media and return cd type
     * @param {string} dicomPath 
     */
    async _determineDiscType(dicomPath) {
        let discType

        if (this.suportType !== CdBurner.MONITOR_CD_TYPE_AUTO) {
            discType = suportType;
        } else {

            //Get viewer Path Size
            let dicomSize = await this.getFolderSize(dicomPath)
            let viewerSize = await this.getFolderSize(this.viewerPath)

            //If size over 630 Mo
            if ( (dicomSize + viewerSize) > 630000000) {
                discType = CdBurner.MONITOR_CD_TYPE_DVD
            } else {
                discType = CdBurner.MONITOR_CD_TYPE_CD
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

        let datFile = "patientName=" + nom.replace("\\^", " ") + "\n"
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

        let dat = await fsPromises.appendFile(path.join(this.monitoredFolder, "CD" + moment().format('YYYYMMDDTHHmmssSS') + ".dat"), datFile, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });

        return dat;
    }

    async _createCdBurnerEpson(dat, discType, name, formattedStudyDate, dicomPath) {
        
        let jobId = this._createJobID(name, formattedStudyDate);

        //Builiding text file for robot request
        let txtRobot = "# Making data CD\n"
            + "JOB_ID=" + jobId + "\n"
            + "#nombre de copies\n"
            + "COPIES=1\n"
            + "#CD ou DVD\n"
            + "DISC_TYPE=" + discType + "\n"
            + "FORMAT=UDF102\n"
            + "DATA=" + this.viewerDirectory + "\n"
            + "DATA=" + dicomPath + "\n"
            + "#Instruction d'impression\n"
            + "LABEL=" + this.labelFile + "\n"
            + "REPLACE_FIELD=" + dat

        // Wrint JDF file in monitoring folder
        let filePath = path.join(this.monitoredFolder, "CD_" + moment().format('YYYYMMDDTHHmmssSS') + ".JDF")
        await fsPromises.appendFile( filePath, txtRobot)

        let answer = { filePath, jobId };
        return answer;
    }

    async _createCdBurnerPrimera(nom, id, date, studyDescription, accessionNumber, patientDOB, nbStudies, modalities, dicomPath) {
        //Command Keys/Values for Primera Robot
        let jobId = this._createJobID(nom, date);

        let txtRobot = "JobID=" + jobId + "\n"
            + "ClientID = Orthanc-Tools" + "\n"
            + "Copies = 1\n"
            + "DataImageType = UDF\n"
            + "Data=" + this.viewerPath + "\n"
            + "Data=" + dicomPath+ "\n"
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
        let filePath = path.join(this.monitoredFolder, "CD_"+ moment().format('YYYYMMDDTHHmmssSS'), ".JRQ")
        await fsPromises.appendFile( filePath, txtRobot)

        let answer = { filePath, jobId };
        return answer;
    }

    /**
     * Create unique job id using patient last and first name, date and random number
     * @param {string} name 
     * @param {string} formattedStudyDate 
     */
    _createJobID(name, formattedStudyDate) {
        let lastName = ""
        let firstName = ""
        //prepare JOB_ID string.
        if (name !== undefined && name.includes("^")) {
            let names = name.split(Pattern.quote("^"));
            //Get 10 first character of lastname and first name if input over 10 characters
            if (names[0].length() > 5) lastName = names[0].substring(0, 5); else lastName = names[0];
            if (names[1].length() > 5) firstName = names[1].substring(0, 5); else firstName = names[1];

        } else {
            if (name !== undefined && name.length !== 0) {
                if (name.length > 10) lastName = name.substring(0, 10); else lastName = name;
            } else {
                lastName = "NoName"
            }

        }

        let results = lastName + "_" + firstName + "_" + formattedStudyDate + "_" + Math.round(Math.random() * 1000);
        //Remove Accent and space to match requirement of burners
        results = results.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); //stripAccents
        results = results.trim();
        //Remove non alpha numeric character (except let _)
        results = results.replace("[^a-zA-Z0-9_]", "");

        return results;
    }

    /**
     * calculate folder's content size
     * @param {string} path 
     */
    getFolderSize(path){
        return recursive(path).then( (files, error)=>{
            let promises = []
            let sizeCounter = 0
            for(let file of files){
                promises.push(
                    fsPromises.stat(file).then((stat) =>{sizeCounter += stat.size})
                )
            }

            return Promise.all(promises).then(()=> sizeCounter)

        })
    }
}

CdBurner.MONITOR_PATIENT = "Patient";
CdBurner.MONITOR_STUDY = "Study"

CdBurner.MONITOR_CD_TYPE_AUTO = "Auto"
CdBurner.MONITOR_CD_TYPE_CD = "CD"
CdBurner.MONITOR_CD_TYPE_DVD = "DVD"

CdBurner.MONITOR_CD_PRIMERA = "Primera"
CdBurner.MONITOR_CD_EPSON = "Epson"

module.exports = CdBurner