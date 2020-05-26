const RobotJob = require('../model/RobotJob')
const RetrieveItem = require('../model/RetrieveItem')
const QueryStudyAnswer = require('../model/queries-answer/QueryStudyAnswer')

describe('Testing Robot Job Creation', () => {

  let queryStudyAnswer1 = new QueryStudyAnswer('1234','12345', '', 'self', 'salimFirst', 'id','Accession', 'CT', 'Description', 'uid', '20180101',3, 1300 )
  let queryStudyAnswer2 = new QueryStudyAnswer('12345','123456', '', 'self', 'Name', 'id','Accession', 'CT', 'Description', 'uid', '20180101',3, 1300 )
 
  let robotJob = null

  it('should create Robot', () => {
    robotJob = new RobotJob('test', 'testJob')
    expect(robotJob).toBeInstanceOf(RobotJob)
  })

  it('should add queries to job', () => {
    robotJob.addRetrieveItem(queryStudyAnswer1)
    expect(robotJob.getRetrieveListSize()).toBe(1)
    robotJob.addRetrieveItem(queryStudyAnswer2)
    expect(robotJob.getRetrieveListSize()).toBe(2)
  })

  it('should have correct queries and projectName', () => {
    expect(robotJob.getProjectName()).toBe('testJob')
    expect(robotJob.getRetriveItem(1)).toBeInstanceOf(RetrieveItem)
  })

  it('should remove query from robotJob', () => {
    robotJob.removeRetrieveItem(1)
    expect(robotJob.getRetrieveListSize()).toBe(1)
    const retrieveItem = robotJob.getRetriveItem(0)
    expect(retrieveItem.getQueryAnswer().patientName).toBe('salimFirst')
  })

  it('should not be validated yet', () => {
    expect(robotJob.isValidated()).toBe(false)
  })

  it('should valid Job', () => {
    robotJob.setValidated()
    expect(robotJob.isValidated()).toBe(true)
  })

  it('should not validate job when items not validated', () => {
    robotJob.validated = false
    robotJob.validateJobIfAllItemValidated()
    expect(robotJob.isValidated()).toBe(false)
  })

  it('should validate job when all items validated', () => {
    robotJob.validated = false
    robotJob.getAllRetrieveItems().forEach((retrieveItem) => {
      retrieveItem.setValidated()
    })
    robotJob.validateJobIfAllItemValidated()
    expect(robotJob.isValidated()).toBe(true)
  })

  it('should calculate statistics of job', () => {
    robotJob.getRetriveItem(0).setStatus(RetrieveItem.STATUS_RETRIEVED)
    expect(robotJob.getProgression()).toEqual({
      totalInstances: 1300,
      retrievedInstances: 1300,
      failedInstances: 0
    })

    let queryStudyAnswer3 = new QueryStudyAnswer('12345','123456', '', 'self', 'Name', 'id','Accession', 'CT', 'Description', 'uid', '20180101',3, 50 )

    robotJob.addRetrieveItem(queryStudyAnswer3)
    robotJob.getRetriveItem(1).setStatus(RetrieveItem.STATUS_FAILURE)

    expect(robotJob.getProgression()).toEqual({
      totalInstances: 1350,
      retrievedInstances: 1300,
      failedInstances: 50
    })
  })
})
