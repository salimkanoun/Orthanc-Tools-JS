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
    fillDetails(returnCallBack){
        let orthancPatientInstance=this;
        this.orthancInstance.getOrthancDetails('patients', this.patientOrthancID, function(answer){
            //Add anserwers element in this OrthancPatient Object
            for(let element in answer){
                orthancPatientInstance[element]=answer[element];
            };

            orthancPatientInstance.getStudies();
            returnCallBack();
        })

        
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

        console.log(studiesObjects);
        this.studiesObjects=studiesObjects;
    }

}
module.exports = OrthancPatient;