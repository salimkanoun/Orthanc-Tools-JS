const request = require('request');
const fs=require('fs');
let QueryAnswer=require('./QueryAnswer');


/**
 * Orthanc object to communications with orthanc server
 */
class Orthanc {

    constructor(){
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
        //SK Delete encore a tester
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
            request.get(this.createOptions('GET','/system'), function(error, response, body){
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
        let promise=new Promise((resolve, reject)=>{
            request.get(this.createOptions('GET','/modalities'), function(error, response, body){
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
    putPeer(name, aet, ip, port, type){
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
        let promise=new Promise((resolve, reject)=>{
            let inputStream =request.post(this.createOptions('POST','/tools/create-archive', JSON.stringify(orthancIds)));
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
            request.post(this.createOptions('POST','/modalities/'+aet+"/query", JSON.stringify(currentOrthanc.preparedQuery)), function(error, response, body){
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

            request.get(this.createOptions('GET',answerPath+"/answers?expand"), function(error, response, body){
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
            request.post(this.createOptions('POST',queryAnswerObject.answerPath+'/answers/'+queryAnswerObject.answerNumber+'/retrieve', aet), function(error, response, body){
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
            request.post(this.createOptions('POST', '/tools/find', JSON.stringify(queryParameter)),function(error, response, body){
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
 

    //Todo
    /**
     * Anonymisation
     */

    
}

module.exports = Orthanc
