const RetrieveItem = require('../model/RetrieveItem')

describe('Testing Retrieve Item', () => {
  const retrieveItem = new RetrieveItem('study', 'Name', 'id', '20180101', 'CT', 'Description', 'Accession', 'uid', 'self')

  it('should create Retrieve Item', async () => {
    expect(retrieveItem).toBeInstanceOf(RetrieveItem)
  })

  it('should change retrieve status', () => {
    retrieveItem.setStatus(RetrieveItem.STATUS_RETRIVING)
    expect(retrieveItem.getStatus()).toBe(RetrieveItem.STATUS_RETRIVING)
  })

  it('should set Orthanc ID', () => {
    retrieveItem.setRetrievedOrthancId('123456789')
    expect(retrieveItem.getRetrievedOrthancId()).toBe('123456789')
  })

  it('should set number of Instances', () => {
    retrieveItem.setNumberOfInstances(15)
    expect(retrieveItem.getNumberOfInstances()).toBe(15)
  })

  it('should set number of Series', () => {
    retrieveItem.setNumberOfSeries(6)
    expect(retrieveItem.getNumberOfSeries()).toBe(6)
  })

  it('should return correct JSON', () => {
    expect(retrieveItem.toJSON()).toEqual({
      level: 'study',
      patientName: 'Name',
      patientId: 'id',
      studyDate: '20180101',
      modality: 'CT',
      studyDescription: 'Description',
      accessionNb: 'Accession',
      studyInstanceUID: 'uid',
      numberOfSeries: 6,
      numberOfInstances: 15,
      aet: 'self',
      status: RetrieveItem.STATUS_RETRIVING
    })
  })
})
