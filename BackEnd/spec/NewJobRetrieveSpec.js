const JobRetrieve = require('../model/robot/JobRetrieve')
const Job = require('../model/robot/Job')
const Orthanc  = require('../model/Orthanc')
const Options = require('../model/Options')
const JobItemRetrieve = require('../model/robot/JobItemRetrieve')
const QuerySeriesAnswer = require('../model/queries-answer/QuerySeriesAnswer')
const QueryStudyAnswer = require('../model/queries-answer/QueryStudyAnswer')

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

    it('should prepare query for series', ()=> {        
        let jobItemSeries = new JobItemRetrieve(new QuerySeriesAnswer('id', 5, 'uid','uidseries', 'CT','desc', 5, 'sourceaet', 300))
        let orthancBuildStudyQuerySpy  = spyOn(orthanc, 'buildStudyDicomQuery')
        let orthancBuildSeriesQuerySpy = spyOn(orthanc, 'buildSeriesDicomQuery')
        jobRetrieve.buildDicomQuery(jobItemSeries)
        expect(orthancBuildSeriesQuerySpy).toHaveBeenCalled()
        expect(orthancBuildStudyQuerySpy).not.toHaveBeenCalled();
        orthancBuildSeriesQuerySpy.calls.reset();
        orthancBuildStudyQuerySpy.calls.reset();

    })

    it('should prepare query for studies', ()=> {        
        let jobItemStudy = new JobItemRetrieve(new QueryStudyAnswer('id',5, 'aet', 'salim', 'id', 'accession', 'CT', 'desc', 'uid', '20200101', 3, 1500))
        let orthancBuildStudyQuerySpy  = spyOn(orthanc, 'buildStudyDicomQuery')
        let orthancBuildSeriesQuerySpy = spyOn(orthanc, 'buildSeriesDicomQuery')
        jobRetrieve.buildDicomQuery(jobItemStudy)
        expect(orthancBuildStudyQuerySpy).toHaveBeenCalled()
        expect(orthancBuildSeriesQuerySpy).not.toHaveBeenCalled();
        orthancBuildSeriesQuerySpy.calls.reset();
        orthancBuildStudyQuerySpy.calls.reset();

    })

    it('should succed to retrieve an item', async ()=> {
        let jobItemStudy = new JobItemRetrieve(new QueryStudyAnswer('id',5, 'aet', 'salim', 'id', 'accession', 'CT', 'desc', 'uid', '20200101', 3, 1500))
        spyOn(jobRetrieve, 'buildDicomQuery').and.returnValue(null)
        spyOn(orthanc, 'makeDicomQuery').and.returnValue([{answerId : 'idanswer', answerNumber : 5, }])
        spyOn(orthanc, 'makeRetrieve').and.returnValue({Query : [{'0020,000d' : "1234"}]})
        spyOn(orthanc, 'findInOrthancByUid').and.returnValue([{ID : 'orthancID'}])
        await jobRetrieve.doRetrieveItem(jobItemStudy)
        expect(jobItemStudy.retrievedOrthancId).toBe('orthancID')
        expect(jobItemStudy.status).toBe('Success')

    })

    it('should fail to retrieve an item', async ()=> {
        let jobItemStudy = new JobItemRetrieve(new QueryStudyAnswer('id',5, 'aet', 'salim', 'id', 'accession', 'CT', 'desc', 'uid', '20200101', 3, 1500))
        spyOn(jobRetrieve, 'buildDicomQuery').and.returnValue(null)
        spyOn(orthanc, 'makeDicomQuery').and.returnValue([{answerId : 'idanswer', answerNumber : 5, }])
        spyOn(orthanc, 'makeRetrieve').and.returnValue({Query : [{'0020,000d' : "1234"}]})
        spyOn(orthanc, 'findInOrthancByUid').and.returnValue([{ID : 'orthancID'},{id2:'OrthancID2'}])
        await jobRetrieve.doRetrieveItem(jobItemStudy)
        expect(jobItemStudy.retrievedOrthancId).toBe(null)
        expect(jobItemStudy.status).toBe('Failure')

    })

    it('should return JSON details', async() => {
        console.log(JSON.stringify(jobRetrieve))
    })



})