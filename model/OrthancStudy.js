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
    fillDetails(){
        let orthancStudyInstance=this;
        return this.orthancInstance.getOrthancDetails('studies', this.studyOrthancID).then(function(answer){

            for(let element in answer){
                orthancStudyInstance[element]=answer[element];
            };
            orthancStudyInstance.getSeries();
            return orthancStudyInstance;
        });

    }

    fillSeriesDetails(){
        let orthancInstance= this.orthancInstance;
        let getSeriesPromises=[];
        this.seriesObjectArray.forEach(serie=>{
            getSeriesPromises.push(new Promise(function(resolve, reject){
                orthancInstance.getOrthancDetails('series', orthancInstance.studyOrthancID).then(function(answer){
                    console.log(answer);
                });

            }));
        });
        return Promise.all(getSeriesPromises)
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