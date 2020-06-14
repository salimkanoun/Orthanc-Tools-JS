const JobItemRetrieve = require('../model/robot/JobItemRetrieve')
const QuerySeriesAnswer = require('../model/queries-answer/QuerySeriesAnswer')

describe('JobItemRetrieve', () =>{
        
    let jobItemRetrieve

    it('should create retrieve item ', ()=>{
        let queryAnswer = new QuerySeriesAnswer('id', 5, 'uid', 'seriesuid', 'CT', 'seriesDesc', 5, 'aet', 500)
        jobItemRetrieve = new JobItemRetrieve(queryAnswer)
        expect(jobItemRetrieve.AnswerId).toBe('id')
        expect(jobItemRetrieve.Validated).toBe(false)
        expect(jobItemRetrieve.RetrievedOrthancId).toBe(null)
        expect(jobItemRetrieve.getNumberOfInstances()).toBe(500)
    })

    it('should set retrived orthanc ID', ()=>{
        jobItemRetrieve.setRetrievedOrthancId('OrthancID')
        expect(jobItemRetrieve.getRetrievedOrthancId()).toBe('OrthancID')
    })

})