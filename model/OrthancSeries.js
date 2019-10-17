/**
 * Stores a serie level Orthanc ressource
 */
class OrthancSerie{

    constructor(seriesOrthancID, orthancInstance){
        this.seriesOrthancID=seriesOrthancID;
        this.orthancInstance=orthancInstance;
    }

    /**
     * Fill data from /serie API
     * @param {function()} returnCallBack 
     */
    fillDetails(returnCallBack){
        let orthancPatientInstance=this;
        this.orthancInstance.getOrthancDetails('series', this.seriesOrthancID, function(answer){
            //Add anserwers element in this OrthancPatient Object
            for(let element in answer){
                orthancPatientInstance[element]=answer[element];
            };
            returnCallBack();
        });

        
    }

    /*
    To DO ?
    getInstances(){
        let orthancSeriesInstance=this;
        let instancesObjectArray=[];
        this.Series.forEach(element => {
            instancesObjectArray.push(); 
        });

        console.log(instancesObjectArray);
    }
    */
}
module.exports = OrthancSerie;