let schedule = require('node-schedule');

class Retrieve_Robot{

    constructor (orthancObject, retrieveList, aetDestination) {
        this.orthancObject = orthancObject
        this.retrieveList = retrieveList
        this.aetDestination=aetDestination
    }

    scheduleRetrieve (){
        let robot=this;
        schedule.scheduleJob('00 22 * * *', function(){
            Console.log('Scheduled Retrieve Started')
            robot.doRetrieve();
        })
    }

    async doRetrieve (){
        let robot=this;
        let studyInstancUIDRetrieve=[];
        for (const studyData of studyInstancUIDRetrieve) {
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
        for( studyInstanceUID in studyInstancUIDArray){
            let orthancResults= await retrieveRobot.orthancObject.findInOrthancByUid(studyInstanceUID)
            console.log(orthancResults)
        }
        

    }
}

export default Retrieve_Robot