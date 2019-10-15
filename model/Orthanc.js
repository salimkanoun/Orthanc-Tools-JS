const request = require('request');
const fs=require('fs');

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
        let serverString=this.getOrthancAdressString()+'/'+url;

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
                form : data
            };
        }

        return options;
    }

    getSystem(returnCallBack){
        let currentOrthanc=this;
        request.get(this.createOptions('GET','system'), function(error, response, body){
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
        request.put(this.createOptions('PUT','modalities/'+name, JSON.stringify(data)), function(error, response, body){
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
        
        let query={
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

        this.preparedQuery=JSON.stringify(query);
        console.log(this.preparedQuery);
        console.log(query);

    }

    makeDicomQuery(aet, returnCallBack){
        let currentOrthanc=this;
        request.post(this.createOptions('POST','modalities/'+aet+"/query/", this.preparedQuery), function(error, response, body){
            console.log(body);
            returnCallBack(currentOrthanc.answerParser(body));
        });
    }

    
}

module.exports = Orthanc
