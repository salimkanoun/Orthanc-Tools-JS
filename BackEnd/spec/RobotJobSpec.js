const RobotJob = require('../model/RobotJob')
const RetrieveItem = require('../model/RetrieveItem')

describe('Testing Robot Job Creation', () => {
  let robotJob = null

  it('should create Robot', () => {
    robotJob = new RobotJob('test', 'testJob')
    expect(robotJob).toBeInstanceOf(RobotJob)
  })

  it('should add queries to job', () => {
    robotJob.addRetrieveItem('study', 'salimFirst', 'salimID', '01012000', 'PT', 'Mammo', '12345689', 'self')
    expect(robotJob.getRetrieveListSize()).toBe(1)
    robotJob.addRetrieveItem('study', 'salimSecond', 'salimID2', '01012000', 'PT', 'Mammo', '12345689', 'self')
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
    expect(retrieveItem.patientName).toBe('salimFirst')
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

  it('should validate job now all items validated', () => {
    robotJob.validated = false
    robotJob.getAllRetrieveItems().forEach((retrieveItem) => {
      retrieveItem.setValidated()
    })
    robotJob.validateJobIfAllItemValidated()
    expect(robotJob.isValidated()).toBe(true)
  })

  it('should calculate statistics of job', () => {
    robotJob.getRetriveItem(0).setNumberOfInstances(15)
    robotJob.addRetrieveItem('study', 'salimSecond', 'salimID2', '01012000', 'PT', 'Mammo', '12345689', 'self')
    robotJob.getRetriveItem(1).setNumberOfInstances(45)
    robotJob.getRetriveItem(1).setStatus(RetrieveItem.STATUS_RETRIEVED)
    expect(robotJob.getProgression()).toEqual({
      totalInstances: 60,
      retrievedInstances: 45,
      failedInstances: 0
    })

    robotJob.addRetrieveItem('study', 'salimSecond', 'salimID2', '01012000', 'PT', 'Mammo', '12345689', 'self')
    robotJob.getRetriveItem(2).setNumberOfInstances(15)
    robotJob.getRetriveItem(2).setStatus(RetrieveItem.STATUS_FAILURE)

    expect(robotJob.getProgression()).toEqual({
      totalInstances: 75,
      retrievedInstances: 45,
      failedInstances: 15
    })
  })
})
