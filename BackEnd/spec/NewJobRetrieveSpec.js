const JobRetrieve = require('../model/robot/JobRetrieve')
const Job = require('../model/robot/Job')
const Orthanc  = require('../model/Orthanc')
const Options = require('../model/Options')

describe('Retrieve Job', () => {

    let orthanc = new Orthanc()

    let jobRetrieve = new JobRetrieve('salim', orthanc)

    it('should be a RetrieveJob for correct user', ()=>{
        expect(jobRetrieve.type).toBe(Job.TYPE_RETRIEVE)
        expect(jobRetrieve.username).toBe('salim')
    })

    it('should retrieve destination AET from Orthanc', async ()=>{
        spyOn(orthanc, 'getOrthancAetName').and.returnValue('aetName')
        await jobRetrieve.storeAetDestination()
        expect(jobRetrieve.aetDestination).toBe('aetName')
    })

    it('should retrieve schedule Time', async()=>{
       spyOn(Options, 'getOptions').and.returnValue({hour : 22, min :00})
       await jobRetrieve.getScheduleTimeFromOptions()
       expect(jobRetrieve.scheduleTime).toEqual({hour:22, min:00})
    })

})