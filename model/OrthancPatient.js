let OrthancStudy=require('./OrthancStudy');

/**
 * Stores a patient level Orthanc ressource
 */
class OrthancPatient{

    constructor(patientOrthancID, orthancInstance){
        this.patientOrthancID=patientOrthancID;
        this.orthancInstance=orthancInstance;
    }

     /**
     * Fill data from /patient API
     * @param {function()} returnCallBack 
     */
    fillDetails(){
        let orthancPatientInstance=this;
        return this.orthancInstance.getOrthancDetails('patients', this.patientOrthancID).then(function(answer){

            for(let element in answer){
                orthancPatientInstance[element]=answer[element];
            };
            orthancPatientInstance.getStudies();
            return orthancPatientInstance;
        });

        
    }

    /**
     * Store references of child Study object
     */
    getStudies(){
        let orthancPatientInstance=this;
        let studiesObjects=[];
        this.Studies.forEach(element => {
            studiesObjects.push(new OrthancStudy(element, orthancPatientInstance.orthancInstance)); 
        });
        this.studiesObjects=studiesObjects;
    }


    
}
module.exports = OrthancPatient;