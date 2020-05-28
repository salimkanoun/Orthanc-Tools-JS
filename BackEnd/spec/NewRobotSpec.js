const {Robot, robot} = require('../model/robot/Robot')
const JobRetrieve = require('../model/robot/JobRetrieve')
const Job = require('../model/robot/Job')
const Orthanc = require('../model/Orthanc')

describe('Robot Singleton', () => {


    it('should return robot singleton', ()=>{
        expect(robot).toBeInstanceOf(Robot)
    })

    it('should accept a new job', ()=>{
        let orthanc = new Orthanc()
        let jobRetrieveObject = new JobRetrieve('salim', orthanc)
        robot.addJob(jobRetrieveObject)
        let jobInstance = robot.getJob('salim', Job.TYPE_RETRIEVE)
        expect(jobInstance).toBeInstanceOf(JobRetrieve)
    })

    it('should remove a job', () =>{
        robot.removeJob('salim', Job.TYPE_RETRIEVE)
        expect(robot.jobs).toEqual({salim:{}})
    })
    
})