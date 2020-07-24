const CdBurner = require('../../model/monitoring/cdBurner/CdBurner')

describe('Test CdBurner', () => {
    let cdBurner

    beforeEach(function () {
        cdBurner = CdBurner.cdBurner()
      })

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
        spyOn(cdBurner, '_dateFormat()').and.returnValue('fr-FR')
        let cdBurner = new CdBurner()
        expect(cdBurner.DateOptions).toEqual({month: 'numeric', day: 'numeric'})
        expect(cdBurner.format).toBe("fr-FR")
    })

    it('_dateFormat should importe data from db', ()=>{
        spyOn(db.Option, 'findOne()').and.returnValue('fr')
        let rep  = cdBurner._dateFormat() 
        expect(rep).toBe("fr-FR")

        spyOn(db.Option, 'findOne()').and.returnValue('uk')
        let rep  = cdBurner._dateFormat() 
        expect(rep).toBe("uk-UA")
    })

    it('start monitoring should create listner', ()=>{
        cdBurner.startCDMonitoring()
        expect(cdBurner.monitoring).toBe("")
    })

    it('stop monitoring should destroy listner', ()=>{
        cdBurner.stopCDMonitoring()
        expect(cdBurner.monitoring).toBe("")
    })

    it('_determineDiscType should determine correct disc type', ()=>{
        spyOnProperty(cdBurner, 'imageSize', 'get').and.returnValue(100);
        spyOnProperty(foop, 'ViewerSize', 'get').and.returnValue(100);
        let res = cdBurner._determineDiscType()
        expect(res).toBe("CD")

        spyOnProperty(cdBurner, 'imageSize', 'get').and.returnValue(100000000);
        spyOnProperty(foop, 'ViewerSize', 'get').and.returnValue(10000000000);
        let res = cdBurner._determineDiscType()
        expect(res).toBe("DVD")
    })

    it('_determineDiscType should determine size', ()=>{
        spyOnProperty(cdBurner, 'imageSize', 'get').and.returnValue("ToDo");

        const spieImageSize = spyOnProperty(cdBurner, 'imageSize', 'set');
        const spieViewerSize = spyOnProperty(cdBurner, 'ViewerSize', 'set');
        
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