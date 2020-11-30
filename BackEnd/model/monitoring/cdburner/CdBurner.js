var fsPromises = require('fs').promises
var JSZip = require("jszip")
const path = require('path');
const Queue = require('promise-queue')
const tmpPromise = require('tmp-promise')
const {withFile} = require('tmp-promise')

const Options = require('../../Options')
const orthanc_Monitoring = require('../Orthanc_Monitoring')
const moment = require('moment')
const recursive = require("recursive-readdir");

//SK RESTE A FAIRE
//Frequence de monitoring dans DB + front end
//Essayer de faire apparaitre la requette avant le unzip


class CdBurner {

    constructor(monitoring) {
        this.orthanc = monitoring.orthanc
        this.monitoring = monitoring
        this.monitoringStarted = false
        this.monitorJobs = this.monitorJobs.bind(this)
        this.jobQueue = new Queue(1, Infinity);
    }

    async setSettings() {

        //Date format
        this.dateOptions = { month: 'numeric', day: 'numeric', year : 'numeric' } //precision of the date

        const options = await Options.getCdBurnerOptions()
        
        //format of date (using contry convention)
        if (options.burner_date_format === "fr") {
            this.format = "DD/MM/YYYY"
        } else if (options.burner_date_format === "uk") {
            this.format = "MM/DD/YYYY"
        } else {
            this.format = "MM/DD/YYYY"
        }

        //Refresh parameter from DB
        this.labelFile = options.burner_label_path
        this.monitoringLevel = options.burner_monitoring_level
        this.burnerManifacturer = options.burner_manifacturer
        this.monitoredFolder = options.burner_monitored_path
        this.deleteStudyAfterSent = options.burner_delete_study_after_sent
        this.viewerPath = options.burner_viewer_path
        this.suportType = options.burner_support_type
        this.transferSyntax = options.burner_transfer_syntax
        this.autoStart = options.burner_started
        this.jobStatus = {}
        
    }

    async autoStartIfNeeded() {
        await this.setSettings()
        if(this.autoStart) this.startCDMonitoring()
    }

    /**
     * Start Cd Monitoring process
     */
    async startCDMonitoring() {
        if (this.monitoringStarted) return
        if (!this.monitoredFolder) throw 'Monitoring folder not defined'

        this.monitoringStarted = true
        await Options.setBurnerStarted(true)
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
            this.monitoring.on('StablePatient', (orthancID) => { 
                this.jobQueue.add( async ()=> {
                    await this._makeCDFromPatient(orthancID) 
                })
               
            })
            
        } else if (this.monitoringLevel === CdBurner.MONITOR_STUDY) {
            this.monitoring.on('StableStudy', (orthancID) => { 
                this.jobQueue.add( async ()=>{
                    await this._makeCDFromStudy(orthancID)
                })
                 
            })
        }
        this.monitorJobInterval = setInterval(this.monitorJobs, 5000)
    }

    /**
     * Destroy event listener according to monitoring level
     */
    __removeListener() {
        if (this.monitoringLevel === CdBurner.MONITOR_PATIENT) {
            this.monitoring.removeListener('StablePatient', (orthancID) => { this._makeCDFromPatient(orthancID) })
        } else if (this.monitoringLevel === CdBurner.MONITOR_STUDY) {
            this.monitoring.removeListener('StableStudy', (orthancID) => { this._makeCDFromStudy(orthancID) })
        }
        clearInterval(this.monitorJobInterval)
    }

    /**
     * Stops Monitoring Process
     */
    async stopCDMonitoring() {
        this.monitoringStarted = false
        await Options.setBurnerStarted(false)
        this.__removeListener()
        this.monitoring.stopMonitoringService(orthanc_Monitoring.MONITORING_SERVICE_CDBURNER)
    }

    /**
     * download dicom from orthanc and unzip archive in a temporary folder
     * return temporary path (containings dicom)
     * @param {Array} studies 
     */
    async __unzip(studies){

        let studyOrthancIDArray  = studies.map((study)=>{
            return study.ID
        })

        let zipFileName = await this.orthanc.getArchiveDicomDir(studyOrthancIDArray, this.transferSyntax)

        var jsZip = new JSZip()

        let unzipedFolder = await tmpPromise.dir({ unsafeCleanup : true }).then( (directory)=>{
            return fsPromises.readFile(zipFileName).then((data)=>{
                return jsZip.loadAsync(data, {createFolders: true})
            }).then ( async (contents)=>{
               
                let files = Object.keys(contents.files)

                for(let i=0; i<files.length; i++) {

                    let filename = files[i]

                    if(contents.files[filename].dir) continue

                    await jsZip.file(filename).async('nodebuffer').then((content)=>{
                        var dest = path.join(directory.path, filename)
                        return fsPromises.mkdir(path.dirname(dest), { recursive: true }).then( () => fsPromises.appendFile(dest, content))
                    })

                }

            }).then( ()=> fsPromises.unlink(zipFileName) ).then( ()=> directory)

        })

        return unzipedFolder;

    }

    async _makeCDFromPatient(newStablePatientID) {
        let patient = await this.orthanc.getOrthancDetails('patients', newStablePatientID)
        let studies = await this.orthanc.getStudiesDetailsOfPatient(newStablePatientID)

        //If Patient has only one study get the study Orthanc ID and process it as a single study burning
        if (studies.length === 1) {
            let newStableStudyID = studies[0].ID 
            await this._makeCDFromStudy(newStableStudyID)
            return
        }

        let formattedPatientDOB = "N/A"
        try {
            formattedPatientDOB = this.formatDicomDate(patient.MainDicomTags.PatientBirthDate)
        } catch (err) {
            console.log(err)
        }

        let datInfos = []
        let uniqueModalitiesForPrimera = []

        let modalitiesInPatient = []

        for (let i = 0; i < studies.length; i++) {
            let formattedDateExamen = "N/A";
            try {
                formattedDateExamen = this.formatDicomDate(studies[i].MainDicomTags.StudyDate)
            } catch (err) {
                console.log(err)
            }
            let studyDescription = studies[i].MainDicomTags.StudyDescription;
            let accessionNumber = studies[i].MainDicomTags.AccessionNumber;

            let series = await this.orthanc.getSeriesDetailsOfStudy(studies[i].ID)

            let modalities = []
            series.forEach((serie)=>{
                let modality = serie.MainDicomTags.Modality;
                if (!modalities.includes(modality)) modalities.push(modality);
                if (!uniqueModalitiesForPrimera.includes(modality)) uniqueModalitiesForPrimera.push(modality);
            })

            //Conctatenate modalities array to a string with "//" separator
            let modalitiesInStudy = modalities.join("//")
            modalitiesInPatient.push(...modalities)

            datInfos.push( {
                patientName: patient.MainDicomTags.PatientName,
                patientID: patient.MainDicomTags.PatientID,
                studyDate: formattedDateExamen,
                studyDescription: studyDescription,
                accessionNumber: accessionNumber,
                patientDOB: formattedPatientDOB,
                modalitiesInStudy: modalitiesInStudy
            } )
        }

        let uniqueModalitiesInPatient = [...new Set(modalitiesInPatient)]

        let timeStamp = this.getTimeStamp()

        let studyDetailsToFront = {
            patientName: patient.MainDicomTags.PatientName,
            patientID: patient.MainDicomTags.PatientID,
            studyDate: 'Multiples',
            studyDescription: 'Multiples',
            accessionNumber: 'Multiples',
            patientDOB: formattedPatientDOB,
            modalitiesInStudy: uniqueModalitiesInPatient.join("//"),
            timeStamp : timeStamp
        }

        let jobID = this._createJobID(patient.MainDicomTags.PatientName, "Mutiples")

        this.updateJobStatus(jobID, null, null, CdBurner.JOB_STATUS_UNZIPING, 'None', studyDetailsToFront)

        let unzipedFolder = await this.__unzip(studies)
        this.updateJobStatus(jobID, null, null, CdBurner.JOB_STATUS_UNZIP_DONE, unzipedFolder)

        let requestFilePath 
        let datFile = null
        if (this.burnerManifacturer === CdBurner.MONITOR_CD_EPSON) {
            let discType = await this._determineDiscType(unzipedFolder.path)
            //Generation du Dat
            datFile = await this._printDat(datInfos, timeStamp);
            requestFilePath = await this._createCdBurnerEpson(jobID, datFile, discType, unzipedFolder.path, timeStamp)

        } else if (this.burnerManifacturer === CdBurner.MONITOR_CD_PRIMERA) {

            requestFilePath = await this._createCdBurnerPrimera(jobID, patient.MainDicomTags.PatientName, 
                patient.MainDicomTags.PatientID, 
                "Mutiples", 
                (studies.length + " studies") , 
                "Mutiples", 
                formattedPatientDOB, 
                studies.length, 
                uniqueModalitiesForPrimera.join("//"),
                unzipedFolder.path)
        }

        this.updateJobStatus(jobID ,requestFilePath, datFile, CdBurner.JOB_STATUS_SENT_TO_BURNER)

        if (this.deleteStudyAfterSent) {
            this.orthanc.deleteFromOrthanc('patients', newStablePatientID)
        }

    }

    async _makeCDFromStudy(newStableStudyID) {
        let study = await this.orthanc.getOrthancDetails('studies', newStableStudyID)
        let patient = await this.orthanc.getOrthancDetails('patients', study.ParentPatient)
        let series = await this.orthanc.getSeriesDetailsOfStudy(newStableStudyID)

        let formattedDateExamen = "N/A"

        try {
            formattedDateExamen = this.formatDicomDate(study.MainDicomTags.StudyDate)
        } catch (e) { }


        let formattedPatientDOB = "N/A"
        try {
            formattedPatientDOB = this.formatDicomDate(patient.MainDicomTags.PatientBirthDate)
        } catch (e) { }

        let modalities = []
        series.forEach((serie)=>{
            let modality = serie.MainDicomTags.Modality
            if (!modalities.includes(modality)) modalities.push(modality)
        })
        //Conctatenate modalities array to a string with "//" separator
        let modalitiesInStudy = modalities.join("//")

        let timeStamp = this.getTimeStamp()

        let datInfos = [{
            patientName: patient.MainDicomTags.PatientName,
            patientID: patient.MainDicomTags.PatientID,
            studyDate: formattedDateExamen,
            studyDescription: study.MainDicomTags.StudyDescription,
            accessionNumber: study.MainDicomTags.AccessionNumber,
            patientDOB: formattedPatientDOB,
            modalitiesInStudy: modalitiesInStudy,
            timeStamp : timeStamp
        }]

        

        //Creat ID for this JOB
        let jobID = this._createJobID(patient.MainDicomTags.PatientName, formattedDateExamen)
        this.updateJobStatus(jobID, null, null, CdBurner.JOB_STATUS_UNZIPING, 'None', datInfos[0])

        //Generate the ZIP with Orthanc IDs dicom
        let unzipedFolder = await this.__unzip([study])
        this.updateJobStatus(jobID, null, null, CdBurner.JOB_STATUS_UNZIP_DONE, unzipedFolder)
       
        let requestFilePath
        let datFile = null

        if (this.burnerManifacturer === CdBurner.MONITOR_CD_EPSON) {
            let discType = await this._determineDiscType(unzipedFolder.path)
            //Generation du Dat
            datFile = await this._printDat(datInfos, timeStamp);
            requestFilePath = await this._createCdBurnerEpson(jobID, datFile, discType, unzipedFolder.path, timeStamp);

        } else if (this.burnerManifacturer === CdBurner.MONITOR_CD_PRIMERA) {
            requestFilePath = await this._createCdBurnerPrimera(jobID, datInfos[0].patientName, 
                datInfos[0].patientID, 
                datInfos[0].studyDate, 
                datInfos[0].studyDescription, 
                datInfos[0].accessionNumber, 
                datInfos[0].patientDOB, 
                1, 
                datInfos[0].modalitiesInStudy, 
                unzipedFolder.path);
        }

        this.updateJobStatus(jobID ,requestFilePath, datFile, CdBurner.JOB_STATUS_SENT_TO_BURNER)

        //On efface la study de Orthanc
        if (this.deleteStudyAfterSent) {
            await this.orthanc.deleteFromOrthanc('studies', newStableStudyID)
        }

    }

    /**
     * format dicom string according to current date display settings
     * @param {string} dicomDateString 
     */
    formatDicomDate(dicomDateString){
        let parsedDate = moment(dicomDateString, "YYYYMMDD")
        return moment(parsedDate).format(this.format)
    }

    /**
     * Monitor the monitored folder to search for request extension change
     */
    async monitorJobs(){

        let nonFinishedRequestFile = {}
        
        //Keep only job which didn't reached Done or Error Status
        Object.keys(this.jobStatus).forEach(jobID =>{
            if(this.jobStatus[jobID]['status'] !== CdBurner.JOB_STATUS_BURNING_DONE && 
            this.jobStatus[jobID]['status'] !== CdBurner.JOB_STATUS_BURNING_ERROR &&  
            this.jobStatus[jobID]['status'] !== null &&
            this.jobStatus[jobID]['requestFile'] !== null ){
                nonFinishedRequestFile[jobID] = {...this.jobStatus[jobID]}
            }
        })

        //Get Current Job File available in monitored folder
        let currentRequestFiles = await fsPromises.readdir(this.monitoredFolder).then((files)=>{
            let fileObject = {}
            files.forEach((file)=>{
                let name  = path.parse(file).name
                let extension = path.parse(file).ext
                if(extension === ".PTM" && extension === ".JCF"){
                    //Ici pour prioriser les fichier cancels (2 fichier present pour le meme id)
                    fileObject[name] = extension
                }
                else if (extension !== ".DAT" && fileObject[name] === undefined ) fileObject[name] = extension
            })
            return fileObject
        })
       
        //For each current JobID check if the file request extension has changed and update the status accordically
        for (let jobID of Object.keys(nonFinishedRequestFile) ){
            let jobRequestFile = nonFinishedRequestFile[jobID]['requestFile']
            let datFile = nonFinishedRequestFile[jobID]['datFile']

            let name = path.parse(jobRequestFile).name

            if(currentRequestFiles[name] === '.DON'){
                this.updateJobStatus(jobID, jobRequestFile, datFile, CdBurner.JOB_STATUS_BURNING_DONE)
            }else if(currentRequestFiles[name] === '.INP'){
                this.updateJobStatus(jobID, jobRequestFile, datFile, CdBurner.JOB_STATUS_BURNING_IN_PROGRESS)
            }else if(currentRequestFiles[name] === '.ERR'){
                this.updateJobStatus(jobID, jobRequestFile, datFile, CdBurner.JOB_STATUS_BURNING_ERROR)
            }else if(currentRequestFiles[name] === '.STP'){
                this.updateJobStatus(jobID, jobRequestFile, datFile, CdBurner.JOB_STATUS_BURNING_PAUSED)
            }else if (currentRequestFiles[name] === '.JCF' || currentRequestFiles[name] === '.PTM'){
                this.updateJobStatus(jobID, jobRequestFile, datFile, CdBurner.JOB_STATUS_REQUEST_CANCELING)
            }



        }
      
    }

    updateJobStatus(jobID, requestFile, datFile, status, tempZip = null, jobDetails = null){

        this.jobStatus[jobID] = {
            requestFile : requestFile,
            datFile : datFile,
            status : status,
            tempZip : (tempZip!==null) ? tempZip : this.jobStatus[jobID]['tempZip'],
            details : (jobDetails !==null ) ? jobDetails  : this.jobStatus[jobID]['details']
        }

        //If Done or Error remove temporary files
        if(status === CdBurner.JOB_STATUS_BURNING_DONE || status === CdBurner.JOB_STATUS_BURNING_ERROR){
            this.jobStatus[jobID]['tempZip'].cleanup()
            fsPromises.unlink(this.jobStatus[jobID]['datFile'])
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

    async _printDat(infos, timeStampString) {

        let datFile = "patientName=" + this.formatPatientName(infos[0].patientName) + "\n"
            + "patientId=" + infos[0].patientID + "\n"
            + "patientDOB=" + infos[0].patientDOB + "\n"
            + "numberOfStudies=" + infos.length + "\n"

        for (let i = 0; i < infos.length; i++) {
            if (i == 0) {
                datFile += "studyDate=" + infos[i].studyDate + "\n"
                    + "studyDescription=" + infos[i].studyDescription + "\n"
                    + "accessionNumber=" + infos[i].accessionNumber + "\n"
                    + "modalities=" + infos[i].modalitiesInStudy + "\n"
            } else {
                datFile += "studyDate" + (i + 1) + "=" + infos[i].studyDate + "\n"
                    + "studyDescription" + (i + 1) + "=" + infos[i].studyDescription + "\n"
                    + "accessionNumber" + (i + 1) + "=" + infos[i].accessionNumber + "\n"
                    + "modalities" + (i + 1) + "=" + infos[i].modalitiesInStudy + "\n"
            }

        }

        let datFilePath = await this.__createFile(datFile, "DAT_" + timeStampString + ".DAT")
        return datFilePath;
    }

    async _createCdBurnerEpson(jobId, dat, discType, dicomPath, timeStampString) {

        //Builiding text file for robot request
        let txtRobot = "# Making data CD\n"
            + "JOB_ID=" + jobId + "\n"
            + "#nombre de copies\n"
            + "COPIES=1\n"
            + "#CD ou DVD\n"
            + "DISC_TYPE=" + discType + "\n"
            + "FORMAT=UDF102\n"
            + "DATA=" + this.viewerPath + "\n"
            + "DATA=" + dicomPath + "\n"
            + "#Instruction d'impression\n"
            + "LABEL=" + this.labelFile + "\n"
            + "REPLACE_FIELD=" + dat

        // Wrint JDF file in monitoring folder
        let filePath = await this.__createFile(txtRobot, "CD_" + timeStampString + ".JDF" )

        return filePath;
    }

    /**
     * Request file shouldn't be written directly in Epson folder (see epson documentation),
     * File need to be written in a temporary file and then be copied to the monitored folder
     * @param {} data 
     * @param {*} destination 
     */
    __createFile(data, fileName){
        //Create temporary file with data

        return tmpPromise.withFile(async (fileObject) => {
            // when this function returns or throws - release the file 
            let filePath = fileObject.path
            //write data in temporary file
            await fsPromises.appendFile(filePath, data)
            //Define definitive location
            let destinationPath = path.join(this.monitoredFolder, fileName)
            //Copy temporary file to definitive location
            await fsPromises.copyFile(filePath, destinationPath)

            return destinationPath
        });
        
    }

    formatPatientName(patientName){

        //On parse le nom pour enlever les ^ et passer le prenom en minuscule
        try{
            let separationNomPrenom = patientName.indexOf("^", 0);
            patientName = patientName.substring(0, separationNomPrenom).toUpperCase() +" "+ patientName.substring(separationNomPrenom + 1).toLowerCase();
        }catch (err) {
            patientName = null
         }

        if(!patientName) patientName = "No Name"

        return patientName

    }

    getTimeStamp(){
        return moment().format('YYYYMMDDHHmmssSS')
    }

    async _createCdBurnerPrimera(jobId, patientName, id, date, studyDescription, accessionNumber, patientDOB, nbStudies, modalities, dicomPath) {

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
            + "PrintLabel=" + this.labelFile + "\n"
            /* MergeField - This key specifies a merge field for SureThing printing.
            The print file specified within the JRQ must be a SureThing file, 
            and it must have been designed with a Merge File specified.
            Fields should be specified in the correct order to match the SureThing design.
            */
            + "MergeField=" + this.formatPatientName(patientName) + "\n"
            + "MergeField=" + id + "\n"
            + "MergeField=" + date + "\n"
            + "MergeField=" + studyDescription + "\n"
            + "MargeField=" + patientDOB + "\n"
            + "MergeField=" + accessionNumber + "\n"
            + "MergeField=" + nbStudies + "\n"
            + "MergeField=" + modalities + "\n";

        // Making a .JRQ file in the watched folder
        let filePath = await this.__createFile(txtRobot, ("CD_"+ this.getTimeStamp() +".JRQ") )

        return filePath;
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
            let names = name.split("^");
            //Get 10 first character of lastname and first name if input over 10 characters
            if (names[0].length > 5) lastName = names[0].substring(0, 5); else lastName = names[0];
            if (names[1].length > 5) firstName = names[1].substring(0, 5); else firstName = names[1];

        } else {
            if (name !== undefined && name.length !== 0) {
                if (name.length > 10) lastName = name.substring(0, 10); else lastName = name;
            } else {
                lastName = "NoName"
            }

        }

        let id = lastName + "-" + firstName + "-" + formattedStudyDate.replace(new RegExp('[\/]', 'g'), '') + "-" + Math.round(Math.random() * 1000);
        //Remove Accent and space to match requirement of burners
        id = id.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); //stripAccents
        id = id.trim();
        //Remove non alpha numeric character (except let _)
        id = id.replace(new RegExp('[^a-zA-Z0-9_]', 'g'), "");

        return id;
    }

    async cancelCdJob(jobID){

        let requestFile = this.jobStatus[jobID]['requestFile']
        let requestFileWithoutExtension = path.parse(requestFile).name

        if(this.burnerManifacturer === CdBurner.MONITOR_CD_PRIMERA){

            let ptmString = "Message = ABORT\n"
                    + "ClientID = Orthanc-Tools";
            await this.__createFile(ptmString, requestFileWithoutExtension + ".PTM")

        }else if(this.burnerManifacturer === CdBurner.MONITOR_CD_EPSON){

            let jcfString="[CANCEL]\n"
                    + "JOB_ID="+jobID;

            await this.__createFile(jcfString, requestFileWithoutExtension + ".JCF")

        }

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

    toJSON(){
        return {
            CdBurnerService : this.monitoringStarted,
            Jobs : this.jobStatus,
            QuededJobs : this.jobQueue.queue.length
        }
    }
}

CdBurner.MONITOR_PATIENT = "Patient";
CdBurner.MONITOR_STUDY = "Study"

CdBurner.MONITOR_CD_TYPE_AUTO = "Auto"
CdBurner.MONITOR_CD_TYPE_CD = "CD"
CdBurner.MONITOR_CD_TYPE_DVD = "DVD"

CdBurner.MONITOR_CD_PRIMERA = "Primera"
CdBurner.MONITOR_CD_EPSON = "Epson"

CdBurner.JOB_STATUS_SENT_TO_BURNER ="Sent To Burner"
CdBurner.JOB_STATUS_RETRIEVING_DICOM = "Retrieving Dicom"
CdBurner.JOB_STATUS_UNZIPING = "Unziping"
CdBurner.JOB_STATUS_UNZIP_DONE = "Unzip Done"
CdBurner.JOB_STATUS_BURNING_ERROR = "Burning Error"
CdBurner.JOB_STATUS_BURNING_IN_PROGRESS = "Burning In Progress"
CdBurner.JOB_STATUS_BURNING_DONE = "Burning Done"
CdBurner.JOB_STATUS_BURNING_PAUSED = "Burning Paused"
CdBurner.JOB_STATUS_REQUEST_RECIEVED = "Burning Request Recieved"
CdBurner.JOB_STATUS_REQUEST_CANCELING = "Burning Request Canceling"

module.exports = CdBurner