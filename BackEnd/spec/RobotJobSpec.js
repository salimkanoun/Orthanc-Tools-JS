const RobotJob = require('../model/RobotJob')
const RetrieveItem = require('../model/RetrieveItem')

describe('Testing Robot Job Creation', () => {
  let robotJob = null
  it('should create Robot', async () => {
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
})
