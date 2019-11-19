let schedule = require('node-schedule');

class Retrieve_Robot{

    constructor (orthancObject, retrieveList, aetDestination) {
        this.orthancObject = orthancObject
        this.retrieveList = retrieveList
        this.aetDestination = aetDestination
    }

    scheduleRetrieve (hour, min){
        let robot=this;
        schedule.scheduleJob(min+hour+' * * *', function(){
            console.log('Scheduled Retrieve Started')
            robot.doRetrieve();
        })
    }

    async doRetrieve (){
        let robot=this;
        let studyInstancUIDRetrieve=[];
        console.log(robot.retrieveList);
        for (let i=0 ; i<robot.retrieveList.length ; i++) {
            
            let studyData=robot.retrieveList[i];
            console.log(studyData)
            
            robot.orthancObject.buildDicomQuery('Study', studyData['patientName'], studyData['patientID'], studyData['studyDate']+'-'+studyData['studyDate'],
                studyData['modality'], studyData['studyDescription'], studyData['accessionNb'])
            let answerDetails=await robot.orthancObject.makeDicomQuery(studyData['aet'])

            for(const answer of answerDetails){
                let retrieveAnswer=await robot.orthancObject.makeRetrieve(answer.answerId, answer.answerNumber, robot.aetDestination, true)
                console.log(retrieveAnswer)
                studyInstancUIDRetrieve.push(answer.studyInstanceUID)
            

            }
            
        }

        this.exportZips(studyInstancUIDRetrieve);

    }

    async exportZips(studyInstancUIDArray){
        let retrieveRobot=this;
        let orthancStudyID=[]
        for(let i=0; i<studyInstancUIDArray.length ; i++){
            let orthancResults= await retrieveRobot.orthancObject.findInOrthancByUid(studyInstancUIDArray[i])
            orthancStudyID.push(orthancResults[0])
        }

        this.orthancObject.exportArchiveDicom(orthancStudyID, 'resultRobot')
        

    }
}

module.exports = Retrieve_Robot