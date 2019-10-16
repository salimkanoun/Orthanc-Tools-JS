class OrthancPatient{

    constructor(patientOrthancID, orthancInstance){
        this.patientOrthancID=patientOrthancID;
        this.orthancInstance=orthancInstance;
    }

    fillDetails(){
        let orthancPatientInstance=this;
        this.orthancInstance.getOrthancDetails('patients', this.patientOrthancID, function(answer){
            //Add anserwers element in this OrthancPatient Object
            for(let element in answer){
                orthancPatientInstance[element]=answer[element];
            };
            console.log(orthancPatientInstance);
        })

        
    }

    //SK To Continue
    getStudies(){
        let orthancPatientInstance=this;
        
        this.getStudies.array.forEach(element => {
            
            
        });
    }

}
module.exports = OrthancPatient;