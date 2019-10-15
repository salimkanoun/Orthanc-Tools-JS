const request = require('request');
const fs=require('fs');
let QueryAnswer=require('./QueryAnswer');

/**
 * Orthanc object to communications with orthanc server
 */
class Orthanc {

    constructor(){
        this.address='http://10.210.18.185';
        this.port='8042';
        this.username='salim';
        this.password='salim';
        
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
     * @param {*} url 
     * @param {*} data 
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

    getSystem(returnCallBack){
        let currentOrthanc=this;
        request.get(this.createOptions('GET','/system'), function(error, response, body){
            returnCallBack(currentOrthanc.answerParser(body));
        });
    }

    /**
     * Add DICOM Peer modality to Orthanc
     * @param {string} name 
     * @param {string} aet 
     * @param {string} ip 
     * @param {number} port 
     * @param {string} type 
     * @param {function returnCallBack(answer) {   
     }} returnCallBack 
     */
    putPeer(name, aet, ip, port, type, returnCallBack){
        let data=[aet, ip, port, type]
        let currentOrthanc=this;
        request.put(this.createOptions('PUT','/modalities/'+name, JSON.stringify(data)), function(error, response, body){
            returnCallBack(currentOrthanc.answerParser(body));
        });
    }

    /**
     * Save ZIP Archive to destination
     * @param {[string]} orthancIds 
     * @param {function(answer)} returnCallBack 
     */
    //SK Path a gerer
    getArchiveDicom(orthancIds, returnCallBack){
        request.post(this.createOptions('POST','/tools/create-archive', JSON.stringify(orthancIds))).pipe(fs.createWriteStream('testDicom.zip'));
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
     * @param {function(answer)} returnCallBack 
     */
    makeDicomQuery(aet, returnCallBack){
        let currentOrthanc=this;
        request.post(this.createOptions('POST','/modalities/'+aet+"/query", JSON.stringify(this.preparedQuery)), function(error, response, body){
            let answer=currentOrthanc.answerParser(body);
            currentOrthanc.getAnswerDetails(answer.Path, function(answerObjects){
                returnCallBack(answerObjects);
            });
            
        });
    }

    getAnswerDetails(answerPath, returnCallBack){
        let currentOrthanc=this;
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

            returnCallBack(answersObjects);
        })
    }

    makeRetrieve(queryAnswerObject, aet){

        request.post(this.createOptions('POST',queryAnswerObject.answerPath+'/answers/'+queryAnswerObject.answerNumber+'/retrieve', aet), function(error, response, body){
            console.log(body);
        })

    }

    
}

module.exports = Orthanc
