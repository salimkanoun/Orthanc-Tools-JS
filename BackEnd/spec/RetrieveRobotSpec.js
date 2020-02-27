const RetrieveRobot = require('../model/RetrieveRobot')
const RobotJob = require('../model/RobotJob')
const Orthanc = require('../model/Orthanc')
const QueryAnswer = require('../model/QueryAnswer')

describe('Retrieve Robot', () => {
  let orthanc = null
  let retrieveRobot = null

  beforeEach(function () {
    orthanc = new Orthanc()
    const answer = []
    answer.push(new QueryAnswer('answerId',
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
      '50'))

    spyOn(orthanc, 'makeDicomQuery').and.returnValue(answer)

    retrieveRobot = new RetrieveRobot(orthanc)

    const robotJob = new RobotJob('salim', 'testProject')
    // Robot job with 2 items
    robotJob.addRetrieveItem('Study', 'patientName', 'patientID', 'sutdyDate', 'modality', 'studyDesctiption', 'accessionNb', 'uid', 'self')
    robotJob.addRetrieveItem('Study', 'patientName', 'patientID', 'sutdyDate', 'modality', 'studyDesctiption', 'accessionNb', 'uid', 'self')

    // Add job to robot
    retrieveRobot.addRobotJob(robotJob)
  })

  it('should have 2 items in job', () => {
    // Check that the add robot has 2 items
    expect(retrieveRobot.getRobotData('salim').retrieveList.length).toBe(2)
  })

  it('should remove robotJob', () => {
    retrieveRobot.removeRobotJob('salim')
    expect(retrieveRobot.robotJobs.salim).toBe(undefined)
  })

  it('should query each item and store instance series number on validation', async () => {
    await retrieveRobot.validateContent('salim')
    expect(orthanc.makeDicomQuery).toHaveBeenCalledTimes(2)
    expect(retrieveRobot.robotJobs.salim.isValidated()).toBe(true)
    /*
        expect(retrieveRobot.getRobotStats()).toEqual({

        })
        */
  })
})
