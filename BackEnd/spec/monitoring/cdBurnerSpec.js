const CdBurner = require('../../model/monitoring/cdBurner/CdBurner')
const Orthanc = require('../../model/Orthanc')

describe('Test CdBurner', () => {

    let cdBurnerTest = CdBurner.cdBurner

    it('should be instence a cdBurner', ()=>{
        spyOn(cdBurner, '_dateFormat()').and.returnValue('fr-FR')

        let cdBurner = new CdBurner()
        expect(cdBurner.orthanc).toBeInstanceOf(Orthanc_Monitoring)
        expect(cdBurner.epsonDirectory).toBe()
        expect(cdBurner.viewerDirectory).toBe()
        expect(cdBurner.labelFile).toEqual()
        expect(cdBurner.dateFormatChoix).toEqual()
        expect(cdBurner.levelPatient).toEqual()
        expect(cdBurner.burnerManifacturer).toEqual()
    })

    it('date options should be imported from db', ()=>{
        spyOn(cdBurnerTest, 'dateFormat').and.returnValue('fr-FR')
        console.log(cdBurnerTest.dateFormat())

        expect( cdBurnerTest.dateFormat()).toBe("fr-FR")
    })

    it('_dateFormat should importe data from db', ()=>{
        cdB = new CdBurner()
        
        spyOn(cdB, 'findOne()').and.returnValue('fr')
        let rep  = cdBurnerTest._dateFormat() 
        expect(rep).toBe("fr-FR")

        spyOn(cdB, 'findOne()').and.returnValue('uk')
        let rep2  = cdBurnerTest._dateFormat() 
        expect(rep2).toBe("uk-UA")
    })

    it('start monitoring should create listner', ()=>{
        cdBurnerTest.startCDMonitoring()
        expect(cdBurnerTest.monitoring).toBe("")
    })

    it('stop monitoring should destroy listner', ()=>{
        cdBurnerTest.stopCDMonitoring()
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