let OrthancSeries=require('./OrthancSeries');

class OrthancStudy{

    constructor(studyOrthancID, orthancInstance){
        this.studyOrthancID=studyOrthancID;
        this.orthancInstance=orthancInstance;
    }

    fillDetails(returnCallBack){
        let orthancStudyInstance=this;
        this.orthancInstance.getOrthancDetails('studies', this.studyOrthancID, function(answer){
            //Add anserwers element in this OrthancPatient Object
            for(let element in answer){
                orthancStudyInstance[element]=answer[element];
            };
            console.log(orthancStudyInstance);
            orthancStudyInstance.getSeries();
            returnCallBack();
        })

        
    }

    getSeries(){
        let orthancStudyInstance=this;
        let seriesObjectArray=[];
        this.Series.forEach(serie => {
            seriesObjectArray.push(new OrthancSeries(serie, orthancStudyInstance.orthancInstance)); 
        });

        console.log(seriesObjectArray);
        this.seriesObjectArray=seriesObjectArray;
    }

}
module.exports = OrthancStudy;