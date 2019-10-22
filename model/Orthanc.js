const request = require('request');
const fs=require('fs');
let QueryAnswer=require('./QueryAnswer');
let TagAnon=require('./TagAnon');


/**
 * Orthanc object to communications with orthanc server
 */
class Orthanc {

    constructor(){
        console.log('construit');
        let configContent=JSON.parse(fs.readFileSync('./_config/config.json', "utf8"));
        this.address=configContent.Address;
        this.port=configContent.Port;
        this.username=configContent.Username;
        this.password=configContent.Password; 
    }

    /**
     * return orthanc connection string 
     */
    getOrthancAdressString(){
        return (this.address+':'+this.port);
    }

    /**
     * Generate option object for Request
     * @param {POST, GET, PUT} method 
     * @param {string} url 
     * @param {string} data in JSON
     */
    createOptions(method, url, data="none"){
        let serverString=this.getOrthancAdressString()+url;

        let options=null;
        if(method=='GET' || method=="DELETE"){
            options={
                method: method,
                url: serverString,
                auth: {
                    user: this.username,
                    password: this.password
                }
            };

        }else{
            options={
                method: method,
                url: serverString,
                auth: {
                    user: this.username,
                    password: this.password
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                },
                body : data
            };
        }

        return options;
    }

    /**
     * Return /System API data
     */
    getSystem(){
        let currentOrthanc=this;
        let promise=new Promise( (resolve, reject)=>{
            request.get(currentOrthanc.createOptions('GET','/system'), function(error, response, body){
                resolve(currentOrthanc.answerParser(body));
            });
        });
        return promise; 
    }

    /**
     * Return available AETs in Orthanc
     */
    getAvailableAet(){
        let currentOrthanc=this;
        console.log('ici get AET');
        let promise=new Promise((resolve, reject)=>{
            request.get(currentOrthanc.createOptions('GET','/modalities'), function(error, response, body){
                console.log(body);
                console.log(response);
                console.log(error);
                resolve(currentOrthanc.answerParser(body));
            });
        });
        return promise;
    }

    /**
     * Add DICOM Peer modality to Orthanc
     * @param {string} name 
     * @param {string} aet 
     * @param {string} ip 
     * @param {number} port 
     * @param {string} type 
     */
    putAet(name, aet, ip, port, type){
        let data=[aet, ip, port, type]
        let currentOrthanc=this;
        let promise=new Promise((resolve, reject)=>{
            request.put(currentOrthanc.createOptions('PUT','/modalities/'+name, JSON.stringify(data)), function(error, response, body){
                resolve(console.log('Aet Declared'));
            });
        });

        return promise;

    }

    /**
     * Save ZIP Archive to destination
     * @param {[string]} orthancIds 
     * @param {function(answer)} returnCallBack 
     */
    //SK Path a gerer
    exportArchiveDicom(orthancIds, filename){
        let currentOrthanc=this;
        let promise=new Promise((resolve, reject)=>{
            let inputStream =request.post(currentOrthanc.createOptions('POST','/tools/create-archive', JSON.stringify(orthancIds)));
            inputStream.pipe(fs.createWriteStream('./export_dicom/'+filename+'.zip'));
    
            inputStream.on('end', () => {
                resolve(console.log('done'));
            });

        });
        return promise;
    }

    /**
     * Parse recieved answer
     * @param {} answer 
     */
    answerParser(answer){
        let parsedAnwser=null;
        try{
            parsedAnwser=JSON.parse(answer);
        }catch(error){
            console.error(error);
        }
        return parsedAnwser;
    }

    buildDicomQuery(level="Study", patientName="*", patientID="*", studyDate="*", modality="*", studyDescription="*", accessionNb="*"){
        
        this.preparedQuery={
            Level: level,
            Query : {
                PatientName : patientName,
                PatientID : patientID,
                StudyDate : studyDate,
                ModalitiesInStudy : modality,
                StudyDescription : studyDescription,
                AccessionNumber : accessionNb
            }

        }
        
    }

    /**
     * Make Query on AET an return response path location
     * @param {String} aet 
     */
    makeDicomQuery(aet){
        let currentOrthanc=this;

        let promise=new Promise((resolve, reject)=>{
            request.post(currentOrthanc.createOptions('POST','/modalities/'+aet+"/query", JSON.stringify(currentOrthanc.preparedQuery)), function(error, response, body){
                let answer=currentOrthanc.answerParser(body);
                resolve(answer);
                
            });
        }).then(function(answer){            
            let answerDetails= currentOrthanc.getAnswerDetails(answer.Path);
            return answerDetails;
        });

        return promise;
    }

    getAnswerDetails(answerPath){
        let currentOrthanc=this;
        let promise=new Promise((resolve, reject)=>{

            request.get(currentOrthanc.createOptions('GET',answerPath+"/answers?expand"), function(error, response, body){
                let answersList=currentOrthanc.answerParser(body);
                let answersObjects=[];
                let answerNumber=0;
                answersList.forEach(element => {
                    
                    let queryLevel=element['0008,0052']['Value'];
                    let accessionNb=element['0008,0050']['Value'];
                    let studyDate=element['0008,0020']['Value'];
                    let origineAET=element['0008,0054']['Value'];
                    let studyDescription=element['0008,1030']['Value'];
                    let patientName=element['0010,0010']['Value'];
                    let patientID=element['0010,0020']['Value'];
                    let studyUID=element['0020,000d']['Value'];
                    let queryAnswserObject=new QueryAnswer(answerPath, answerNumber, queryLevel,origineAET,patientName,patientID,accessionNb,studyDescription,studyUID,studyDate);
                    answersObjects.push(queryAnswserObject);
                    answerNumber++;
                    
                });
    
                resolve(answersObjects);
            });

        });

        return promise;

    }

    /**
     * retrieve a qurey answer to an AET
     * @param {QueryAnswer} queryAnswerObject 
     * @param {string} aet 
     */
    makeRetrieve(queryAnswerObject, aet){
        let currentOrthanc=this;
        let promise = new Promise((resolve, reject)=>{
            request.post(currentOrthanc.createOptions('POST',queryAnswerObject.answerPath+'/answers/'+queryAnswerObject.answerNumber+'/retrieve', aet), function(error, response, body){
                let answer=currentOrthanc.answerParser(body);
                let answerObject={
                    accessionNb : answer.Query[0]['0008,0050'],
                    level : answer.Query[0]['0008,0052'],
                    patientID : answer.Query[0]['0010,0020'],
                    studyUID : answer.Query[0]['0020,000d']
    
                }
                resolve(answerObject);
            });

        });
        return promise;
    }

    /**
     * Search for content in Orthanc
     * @param {string} level 
     * @param {string} patientName 
     * @param {string} patientID 
     * @param {string} accessionNb 
     * @param {string} date 
     * @param {string} studyDescription 
     * @param {string} modality 
     */
    findInOrthanc(level='studies', patientName='*', patientID='*', accessionNb='*', date='*', studyDescription='*', modality='*'){

        let currentOrthanc=this;
        let queryDetails={};

        if(date !='*') queryDetails.StudyDate=date;
        if(studyDescription!='*') queryDetails.StudyDescription=studyDescription;
        if(modality!='*') queryDetails.ModalitiesInStudy=modality;
        if(patientName!='*') queryDetails.PatientName=patientName;
        if(patientID!='*') queryDetails.PatientID=patientID;
        if(accessionNb !='*') queryDetails.AccessionNumber=accessionNb;

        let queryParameter={
            Level : level,
            CaseSensitive : false,
            Expand : true,
            Query : queryDetails
        }
        let promise=new Promise((resolve, reject)=>{
            request.post(currentOrthanc.createOptions('POST', '/tools/find', JSON.stringify(queryParameter)),function(error, response, body){
                let answer=currentOrthanc.answerParser(body);
                resolve(answer);
    
            })

        });

        return promise; 

    }

    /**
     * Return details of the patients, studies, series GET API
     * @param {string} level 
     * @param {string} orthancID 
     */
    getOrthancDetails(level, orthancID){
        let currentOrthanc=this;
        let promise=new Promise( function(resolve, reject) {
            request.get(currentOrthanc.createOptions('GET', '/'+level+'/'+orthancID), function(error, response, body){
                let answer=currentOrthanc.answerParser(body);
                resolve(answer);
            });

        });

        return promise;
    }

    deleteFromOrhtanc(level, orthancID){
        let currentOrthanc=this;
        let promise = new Promise((resolve, reject)=>{
            request.delete(currentOrthanc.createOptions('DELETE', '/'+level+'/'+orthancID, function(error, response, body){
            }))
        });

        return promise;
    }

    buildAnonQuery(profile, newAccessionNumber, newPatientID, newPatientName, newStudyDescription){

        let tagObjectArray=[];
        let date;
        let body;

        if(profile=="Default"){
            date=TagAnon.keep;
            body=TagAnon.keep;
            
            tagObjectArray.push(new TagAnon("0010,0030", TagAnon.replace, "19000101")); // BirthDay
            tagObjectArray.push(new TagAnon("0008,1030", TagAnon.replace, newStudyDescription)); //studyDescription
            tagObjectArray.push(new TagAnon("0008,103E", TagAnon.keep)); //series Description
           
    
        }else if(profile=="Full"){
            date=TagAnon.clear;
            body=TagAnon.clear;
            
            tagObjectArray.push(new TagAnon("0010,0030", TagAnon.replace, "19000101")); // BirthDay
            tagObjectArray.push(new TagAnon("0008,1030", TagAnon.clear)); // studyDescription
            tagObjectArray.push(new TagAnon("0008,103E", TagAnon.clear)); //series Description
        }
        
    	//List tags releted to Date
    	tagObjectArray.push(new TagAnon("0008,0022", date)); // Acquisition Date
    	tagObjectArray.push(new TagAnon("0008,002A", date)); // Acquisition DateTime
    	tagObjectArray.push(new TagAnon("0008,0032", date)); // Acquisition Time
    	tagObjectArray.push(new TagAnon("0038,0020", date)); // Admitting Date
    	tagObjectArray.push(new TagAnon("0038,0021", date)); // Admitting Time
    	tagObjectArray.push(new TagAnon("0008,0035", date)); // Curve Time
    	tagObjectArray.push(new TagAnon("0008,0025", date)); // Curve Date
    	tagObjectArray.push(new TagAnon("0008,0023", date)); // Content Date
    	tagObjectArray.push(new TagAnon("0008,0033", date)); // Content Time
    	tagObjectArray.push(new TagAnon("0008,0024", date)); // Overlay Date
    	tagObjectArray.push(new TagAnon("0008,0034", date)); // Overlay Time
    	tagObjectArray.push(new TagAnon("0040,0244", date)); // ...Start Date
    	tagObjectArray.push(new TagAnon("0040,0245", date)); // ...Start Time
    	tagObjectArray.push(new TagAnon("0008,0021", date)); // Series Date
    	tagObjectArray.push(new TagAnon("0008,0031", date)); // Series Time
    	tagObjectArray.push(new TagAnon("0008,0020", date)); // Study Date
    	tagObjectArray.push(new TagAnon("0008,0030", date)); // Study Time
    	tagObjectArray.push(new TagAnon("0010,21D0", date)); // Last menstrual date
    	tagObjectArray.push(new TagAnon("0008,0201", date)); // Timezone offset from UTC
    	tagObjectArray.push(new TagAnon("0040,0002", date)); // Scheduled procedure step start date
        tagObjectArray.push(new TagAnon("0040,0003", date)); // Scheduled procedure step start time
    	tagObjectArray.push(new TagAnon("0040,0004", date)); // Scheduled procedure step end date
    	tagObjectArray.push(new TagAnon("0040,0005", date)); // Scheduled procedure step end time
    	
    	// same for Body characteristics
    	tagObjectArray.push(new TagAnon("0010,2160", body)); // Patient's ethnic group
    	tagObjectArray.push(new TagAnon("0010,21A0", body)); // Patient's smoking status
    	tagObjectArray.push(new TagAnon("0010,0040", body)); // Patient's sex
    	tagObjectArray.push(new TagAnon("0010,2203", body)); // Patient's sex neutered
    	tagObjectArray.push(new TagAnon("0010,1010", body)); // Patient's age
    	tagObjectArray.push(new TagAnon("0010,21C0", body)); // Patient's pregnancy status
    	tagObjectArray.push(new TagAnon("0010,1020", body)); // Patient's size
    	tagObjectArray.push(new TagAnon("0010,1030", body)); // Patient's weight
    
    	//Others
    	tagObjectArray.push(new TagAnon("0008,0050", TagAnon.replace, newAccessionNumber));  // Accession Number hardcoded to our system name
    	tagObjectArray.push(new TagAnon("0010,0020", TagAnon.replace, newPatientID)); //new Patient Name
    	tagObjectArray.push(new TagAnon("0010,0010", TagAnon.replace, newPatientName)); //new Patient Name
    	
    	// Keep some Private tags usefull for PET/CT or Scintigraphy
    	tagObjectArray.push(new TagAnon("7053,1000", TagAnon.keep)); //Phillips
    	tagObjectArray.push(new TagAnon("7053,1009", TagAnon.keep)); //Phillips
    	tagObjectArray.push(new TagAnon("0009,103B", TagAnon.keep)); //GE
    	tagObjectArray.push(new TagAnon("0009,100D", TagAnon.keep)); //GE
    	tagObjectArray.push(new TagAnon("0011,1012", TagAnon.keep)); //Other
    	
        
        let anonParameters={
            KeepPrivateTags : false,
            Force : true,
            Keep : [],
            Replace : {}
        };

        tagObjectArray.forEach(tag=>{
            let tagNb=tag.tagNumber;
            let tagNewValue=tag.newValue;
            if(tag.choice==TagAnon.keep){
                anonParameters['Keep'].push(tagNb);
            }else if(tag.choice==TagAnon.replace){
                anonParameters['Replace'][tagNb]=tagNewValue;
            }
        });

        console.log(JSON.stringify(anonParameters));

        return JSON.stringify(anonParameters);
    }

    makeAnon(level, orthancID, profile, newAccessionNumber, newPatientID, newPatientName, newStudyDescription ){
        let currentOrthanc=this;
        let promise=new Promise((resolve, reject)=>{
            request.post(currentOrthanc.createOptions('POST', '/'+level+'/'+orthancID+'/anonymize', currentOrthanc.buildAnonQuery(profile, newAccessionNumber, newPatientID, newPatientName, newStudyDescription)), function(error, response, body){
                console.log(body)
            })
        })
    }
 

    //Todo
    /**
     * Database NeDB
     * https://github.com/louischatriot/nedb/
     */

    
}

module.exports = Orthanc
