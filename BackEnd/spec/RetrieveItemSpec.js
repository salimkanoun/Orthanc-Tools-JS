const RetrieveItem = require('../model/RetrieveItem')
const Orthanc = require('../model/Orthanc')
const QueryStudyAnswer = require('../model/queries-answer/QueryStudyAnswer')
const QuerySeriesAnswer = require('../model/queries-answer/QuerySeriesAnswer')

describe('Retrieve Item Study', () => {

  let queryStudyAnswer = new QueryStudyAnswer('1234','12345', '', 'self', 'Name', 'id','Accession', 'CT', 'Description', 'uid', '20180101',3, 1300 )
  const retrieveItem = new RetrieveItem(queryStudyAnswer)

  it('should create Retrieve Item', () => {
    expect(retrieveItem).toBeInstanceOf(RetrieveItem)
  })

  it('should return the number of instances', ()=>{
    expect(retrieveItem.getNumberOfInstances()).toBe(1300)
  })

  it('should set item validated', () => {
    expect(retrieveItem.validated).toBe(false)
    retrieveItem.setValidated()
    expect(retrieveItem.validated).toBe(true)
  })

  it('should change retrieve status', () => {
    retrieveItem.setStatus(RetrieveItem.STATUS_RETRIVING)
    expect(retrieveItem.getStatus()).toBe(RetrieveItem.STATUS_RETRIVING)
  })

  it('should set Orthanc ID', () => {
    retrieveItem.setRetrievedOrthancId('123456789')
    expect(retrieveItem.getRetrievedOrthancId()).toBe('123456789')
  })

  it('should validate retrieve study item', async ()=> {

    let orthanc = new Orthanc()

    orthancBuildStudyQuerySpy  = spyOn(orthanc, 'buildStudyDicomQuery')
    orthancBuildSeriesQuerySpy = spyOn(orthanc, 'buildSeriesDicomQuery')
    orthancMakeDicomQuerySpy = spyOn(orthanc, 'makeDicomQuery')

    orthancMakeDicomQuerySpy.and.returnValue([{
      numberOfSeriesRelatedInstances : 1500
    }])

    let validateResults = await retrieveItem.validateRetrieveItem(orthanc)
    expect(orthancBuildStudyQuerySpy).toHaveBeenCalled()
    expect(orthancBuildSeriesQuerySpy).not.toHaveBeenCalled();

    expect(validateResults).toBe(true)

  })

  it('should retrieve study Item', async()=>{

    let orthanc = new Orthanc()
    orthancBuildStudyQuerySpy  = spyOn(orthanc, 'buildStudyDicomQuery')
    orthancBuildSeriesQuerySpy = spyOn(orthanc, 'buildSeriesDicomQuery')
    orthancMakeDicomQuerySpy = spyOn(orthanc, 'makeDicomQuery').and.returnValue([{answerId : '12345', answerNumber : '1234', aetDestination : 'self'}])
    orthancRetrieveSpy = spyOn(orthanc, 'makeRetrieve').and.returnValue({Query : [{'0020,000d' : "Test"}]})
    orthancFindByUIDSpy = spyOn(orthanc, 'findInOrthancByUid').and.returnValue([{ID : '123456789'}])

    retrieveItem.validated=true
    await retrieveItem.doRetrieveItem(orthanc)
    expect(orthancBuildStudyQuerySpy).toHaveBeenCalled()
    expect(orthancBuildSeriesQuerySpy).not.toHaveBeenCalled();
    expect(orthancRetrieveSpy).toHaveBeenCalled()
    expect(orthancFindByUIDSpy).toHaveBeenCalled()
    expect(retrieveItem.getRetrievedOrthancId()).toBe('123456789')

  })

  it('should return correct JSON', () => {
    expect(retrieveItem.toJSON()).toEqual({
      level: 'study',
      patientName: 'Name',
      patientID: 'id',
      studyDate: '20180101',
      modalitiesInStudy: 'CT',
      studyDescription: 'Description',
      accessionNumber: 'Accession',
      studyInstanceUID: 'uid',
      numberOfStudyRelatedSeries: 3,
      numberOfSeriesRelatedInstances: 1300,
      originAET: 'self',
      answerId: '1234',
      answerNumber : '12345',
      validated : true,
      status: RetrieveItem.STATUS_RETRIEVED,
      retrievedOrthancId : '123456789'
    })
  })
})

describe('Retrieve Item Series', () => {

  let querySeriesAnswer = new QuerySeriesAnswer('1234', '12345', '', 'studyUid', 'seriesUid', 'CT', 'description', 30, 'self',300 )
  const retrieveItemSeries = new RetrieveItem(querySeriesAnswer)

  it('should validate retrieve study item', async ()=> {

    let orthanc = new Orthanc()

    orthancBuildStudyQuerySpy  = spyOn(orthanc, 'buildStudyDicomQuery')
    orthancBuildSeriesQuerySpy = spyOn(orthanc, 'buildSeriesDicomQuery')
    orthancMakeDicomQuerySpy = spyOn(orthanc, 'makeDicomQuery')

    orthancMakeDicomQuerySpy.and.returnValue([{
      numberOfSeriesRelatedInstances : 1500
    }])

    let validateResultsSeries = await retrieveItemSeries.validateRetrieveItem(orthanc)
    expect(orthancBuildStudyQuerySpy).not.toHaveBeenCalled();
    expect(orthancBuildSeriesQuerySpy).toHaveBeenCalled();

    expect(validateResultsSeries).toBe(true)

  })

  it('should retrieve series Item', async()=>{

    let orthanc = new Orthanc()
    orthancBuildStudyQuerySpy  = spyOn(orthanc, 'buildStudyDicomQuery')
    orthancBuildSeriesQuerySpy = spyOn(orthanc, 'buildSeriesDicomQuery')
    orthancMakeDicomQuerySpy = spyOn(orthanc, 'makeDicomQuery').and.returnValue([{answerId : '12345', answerNumber : '1234', aetDestination : 'self'}])
    orthancRetrieveSpy = spyOn(orthanc, 'makeRetrieve').and.returnValue({Query : [{'0020,000d' : "Test"}]})
    orthancFindByUIDSpy = spyOn(orthanc, 'findInOrthancByUid').and.returnValue([{ID : '123456789'}])

    retrieveItemSeries.validated=true
    await retrieveItemSeries.doRetrieveItem(orthanc)
    expect(orthancBuildStudyQuerySpy).not.toHaveBeenCalled()
    expect(orthancBuildSeriesQuerySpy).toHaveBeenCalled();
    expect(orthancRetrieveSpy).toHaveBeenCalled()
    expect(orthancFindByUIDSpy).toHaveBeenCalled()
    expect(retrieveItemSeries.getRetrievedOrthancId()).toBe('123456789')

  })

})
