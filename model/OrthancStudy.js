let OrthancSeries=require('./OrthancSeries');

/**
 * Stores a study level Orthanc ressource
 */
class OrthancStudy{

    constructor(studyOrthancID, orthancInstance){
        this.studyOrthancID=studyOrthancID;
        this.orthancInstance=orthancInstance;
    }

    /**
     * Fill data from /study API
     * @param {function()} returnCallBack 
     */
    fillDetails(returnCallBack){
        let orthancStudyInstance=this;
        this.orthancInstance.getOrthancDetails('studies', this.studyOrthancID, function(answer){
            //Add anserwers element in this OrthancPatient Object
            for(let element in answer){
                orthancStudyInstance[element]=answer[element];
            };
            orthancStudyInstance.getSeries();
            returnCallBack();
        })

        
    }

    /**
     * Store references of child Series object
     */
    getSeries(){
        let orthancStudyInstance=this;
        let seriesObjectArray=[];
        this.Series.forEach(serie => {
            seriesObjectArray.push(new OrthancSeries(serie, orthancStudyInstance.orthancInstance)); 
        });
        this.seriesObjectArray=seriesObjectArray;
    }

}
module.exports = OrthancStudy;