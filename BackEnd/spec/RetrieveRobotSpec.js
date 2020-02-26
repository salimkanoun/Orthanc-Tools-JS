const RetrieveRobot = require('../model/RetrieveRobot')
const RobotJob = require('../model/RobotJob')
const Orthanc = require('../model/Orthanc')
const QueryAnswer = require('../model/QueryAnswer')

describe('Retrieve Robot', () =>{

    let orthanc = null 

    beforeEach(function() {

        orthanc = new Orthanc()
    
        let answer = new QueryAnswer('answerId', 
            'answerNumber', 
            'level', 
            'originAET', 
            'patientName', 
            'patientID', 
            'accessionNumber', 
            'modalitiesInStudy', 
            'studyDescription', 
            'studyInstanceUID', 
            'studyDate',
            '5',
            '50')

        spyOn(orthanc, "makeDicomQuery").and.returnValue(answer);

    });

    it('should query each item and store instance series number on validation', async () => {

        let retrieveRobot = new RetrieveRobot(orthanc)
        let robotJob = new RobotJob('salim', 'testProject')
        robotJob.addRetrieveItem('Study', 'patientName', 'patientID', 'sutdyDate', 'modality', 'studyDesctiption', 'accessionNb', 'uid', 'self')
        robotJob.addRetrieveItem('Study', 'patientName', 'patientID', 'sutdyDate', 'modality', 'studyDesctiption', 'accessionNb', 'uid', 'self')
        retrieveRobot.addRobotJob(robotJob)
        await retrieveRobot.validateContent('salim')
        expect(orthanc.makeDicomQuery).toHaveBeenCalledTimes(2);


    })


})
