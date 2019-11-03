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

    fillDetails(){
        let orthancSerieInstance=this;
        return this.orthancInstance.getOrthancDetails('series', this.seriesOrthancID).then(function(answer){
            for(let element in answer){
                orthancSerieInstance[element]=answer[element];
            };
            return orthancSerieInstance;
        }).catch((error)=>{console.log('Error getting series details ' + error)});

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