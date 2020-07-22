const Orthanc_Monitoring = require('../../model/monitoring/Orthanc_Monitoring')

describe('Test Orthanc_Monitoring', () => {
    var orthanc_Monitoring = null

    beforeEach(function () {
        orthanc_Monitoring = new Orthanc_Monitoring()
      })

    it('should be instence a monitor', ()=>{
        let mon = new Orthanc_Monitoring()
        expect(orthanc_Monitoring.orthanc).toBeInstanceOf(Orthanc_Monitoring)
        expect(orthanc_Monitoring.done).toBe(false)
        expect(orthanc_Monitoring.last).toBe(0)
        expect(orthanc_Monitoring.eventEmitter).toEqual([])
    })

    it('should set last', ()=>{
        orthanc_Monitoring.setChangeLastLine(1)
        expect(orthanc_Monitoring.last).toBe(1)
    })

    it('should get last', ()=>{
        spyOn(orthanc, 'getChangesLast').and.returnValue('')
        orthanc_Monitoring.getChangeLastLine()
        expect(orthanc_Monitoring.last).toEqual('') 
    })

    it('_parseOutput emit', ()=>{

        let eventEmitterSpy  = spyOn(eventEmitter, 'NewPatient')
        orthanc_Monitoring._parseOutput(last)
        expect(eventEmitterSpy).toHaveBeenCalled()
       
    })

})    