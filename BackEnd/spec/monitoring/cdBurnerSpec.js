const CdBurner = require('../../model/monitoring/cdburner/CdBurner')

const Orthanc = require('../../model/Orthanc')
const db = require('../../database/models')
const {orthanc_Monitoring, Orthanc_Monitoring } = require('../../model/monitoring/Orthanc_Monitoring')

describe('Test CdBurner', () => {

    let cdBurnerTest = CdBurner.cdBurner

    it('should be instence a cdBurner', ()=>{
        let cdBurner = new CdBurner.CdBurner(orthanc_Monitoring)

        expect(cdBurner.orthanc).toBeInstanceOf(Orthanc)
        expect(cdBurner.monitoring).toBeInstanceOf(Orthanc_Monitoring)

        expect(cdBurner.labelFile).toEqual('')
        expect(cdBurner.levelPatient).toEqual('')
        expect(cdBurner.burnerManifacturer).toEqual('')
        
        expect(cdBurner.dateOptions).toEqual({month: 'numeric', day: 'numeric'})
    })

    /*
    it('date options should be return', ()=>{
        let cdBurner = new CdBurner.CdBurner()
        spyOn(cdBurner, '_dateFormat').and.returnValue('fr-FR')
        expect(cdBurner._dateFormat()).toBe("fr-FR")
    })*/

    it('_dateFormat should importe data from db', async ()=>{
        let cdBurner = new CdBurner.CdBurner()
        
        spyOn(db.Option, 'findOne').and.returnValue({dateFormat:'fr'})
        let rep  = await cdBurner.setSettings() 
        expect(this.format).toBe("fr-FR")
    })

    it('start monitoring should create listener', ()=>{
        let spy = spyOn(cdBurnerTest.monitoring.EventEmitter, 'on')

        cdBurnerTest.startCDMonitoring()
        expect(spy.count()).toBe(2)
    })

    it('stop monitoring should destroy listner', async ()=>{
        await cdBurnerTest.stopCDMonitoring()
        expect(cdBurner.monitoring).toBe("")
    })

    it('_determineDiscType should determine correct disc type', ()=>{
        spyOnProperty(cdBurnerTest, 'imageSize', 'get').and.returnValue(100);
        spyOnProperty(cdBurnerTest, 'ViewerSize', 'get').and.returnValue(100);
        let res = cdBurnerTest._determineDiscType()
        expect(res).toBe("CD")

        spyOnProperty(cdBurnerTest, 'imageSize', 'get').and.returnValue(100000000);
        spyOnProperty(cdBurnerTest, 'ViewerSize', 'get').and.returnValue(10000000000);
        let res2 = cdBurnerTest._determineDiscType()
        expect(res2).toBe("DVD")
    })

    it('_determineDiscType should determine size', ()=>{
        spyOnProperty(cdBurnerTest, 'imageSize', 'get').and.returnValue("ToDo");

        const spieImageSize = spyOnProperty(cdBurnerTest, 'imageSize', 'set');
        const spieViewerSize = spyOnProperty(cdBurnerTest, 'ViewerSize', 'set');
        
        expect(spieImageSize).toBe()
        expect(spieViewerSize).toBe()
    })

    it('_printDat should return correct dat', ()=>{
    })

    it('_createCdBurnerEpson should create epson cd', ()=>{
    })

    it('_createCdBurnerPrimera should create primera cd', ()=>{
    })

    it('_createJobID should retunr jobId', ()=>{
    })

    it('_makeCDFromPatient should create cd from patient', ()=>{
    })

    it('_makeCD should create cd from studie', ()=>{
    })

})    