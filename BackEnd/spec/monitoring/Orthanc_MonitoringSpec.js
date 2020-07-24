const Orthanc_Monitoring = require('../../model/monitoring/Orthanc_Monitoring')

const Orthanc = require('../../model/Orthanc')
const EventEmitter = require('events').EventEmitter;

describe('Test Orthanc_Monitoring', () => {
    let orthanc_MonitoringTest

    beforeEach(function () {
        orthanc_MonitoringTest = Orthanc_Monitoring.orthanc_Monitoring
      })

    it('should be instence a monitor', ()=>{
        expect(orthanc_MonitoringTest.orthanc).toBeInstanceOf(Orthanc)
        expect(orthanc_MonitoringTest.done).toBe(false)
        expect(orthanc_MonitoringTest.last).toBe(0)
        expect(orthanc_MonitoringTest.eventEmitter).toBeInstanceOf(EventEmitter)
    })

    it('should set last', ()=>{
        orthanc_MonitoringTest.setChangeLastLine(1)
        expect(orthanc_MonitoringTest.last).toBe(1)
    })

    it('should get last', ()=>{
        spyOn(orthanc_MonitoringTest.orthanc, 'getChangesLast').and.returnValue('')
        orthanc_MonitoringTest.getChangeLastLine()
        expect(orthanc_MonitoringTest.last).toEqual('') 
    })

    it('_parseOutput emit', ()=>{

        let eventEmitterSpy  = spyOn(orthanc_MonitoringTest.eventEmitter, 'NewPatient')
        orthanc_MonitoringTest._parseOutput(last)
        expect(eventEmitterSpy).toHaveBeenCalled()
       
    })

})    