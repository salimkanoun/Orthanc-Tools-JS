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
        let getSeriesPromises=[];
        this.seriesObjectArray.forEach(serie=>{
            getSeriesPromises.push(serie.fillDetails());
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

    async fillAllChildsDetails(){

        await this.fillDetails();

        await this.fillSeriesDetails();

    };

}
module.exports = OrthancStudy;