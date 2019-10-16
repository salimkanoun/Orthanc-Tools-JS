class OrthancSerie{

    constructor(seriesOrthancID, orthancInstance){
        this.seriesOrthancID=seriesOrthancID;
        this.orthancInstance=orthancInstance;
    }

    fillDetails(){
        let orthancPatientInstance=this;
        this.orthancInstance.getOrthancDetails('series', this.seriesOrthancID, function(answer){
            //Add anserwers element in this OrthancPatient Object
            for(let element in answer){
                orthancPatientInstance[element]=answer[element];
            };
            console.log(orthancPatientInstance);
        })

        
    }

}
module.exports = OrthancSerie;