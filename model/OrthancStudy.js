class OrthancStudy{

    constructor(studyOrthancID, orthancInstance){
        this.studyOrthancID=studyOrthancID;
        this.orthancInstance=orthancInstance;
    }

    fillDetails(){
        let orthancPatientInstance=this;
        this.orthancInstance.getOrthancDetails('studies', this.studyOrthancID, function(answer){
            //Add anserwers element in this OrthancPatient Object
            for(let element in answer){
                orthancPatientInstance[element]=answer[element];
            };
            console.log(orthancPatientInstance);
        })

        
    }

}
module.exports = OrthancStudy;