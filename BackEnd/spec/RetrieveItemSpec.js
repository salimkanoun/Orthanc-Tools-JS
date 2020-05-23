const RetrieveItem = require('../model/RetrieveItem')
const Orthanc = require('../model/Orthanc')
const QueryStudyAnswer = require('../model/queries-answer/QueryStudyAnswer')
const QuerySeriesAnswer = require('../model/queries-answer/QuerySeriesAnswer')

describe('Testing Retrieve Item', () => {

  let queryStudyAnswer = new QueryStudyAnswer('1234','12345', '', 'self', 'Name', 'id','Accession', 'CT', 'Description', 'uid', '20180101',3, 1300 )
  let querySeriesAnswer = new QuerySeriesAnswer('1234', '12345', '', 'studyUid', 'seriesUid', 'CT', 'description', 30, 'self',300 )
  const retrieveItem = new RetrieveItem(queryStudyAnswer)
  const retrieveItemSeries = new RetrieveItem(querySeriesAnswer)

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

  it('should validate retrieve study or series item', async ()=> {

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

    let validateResultsSeries = await retrieveItemSeries.validateRetrieveItem(orthanc)
    expect(orthancBuildStudyQuerySpy).toHaveBeenCalledTimes(1)
    expect(orthancBuildSeriesQuerySpy).toHaveBeenCalled();

    expect(validateResults).toBe(true)
    expect(validateResultsSeries).toBe(true)

  })

  it('should retrieve study or series', async()=>{

    //SK A FAIRE

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
      status: RetrieveItem.STATUS_RETRIVING,
      retrievedOrthancId : '123456789'
    })
  })
})
