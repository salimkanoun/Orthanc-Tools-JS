const Job = require('../model/robot/Job')
const JobItemRetrieve = require('../model/robot/JobItemRetrieve')
const QueryStudyAnswer = require('../model/queries-answer/QueryStudyAnswer')

describe('Job', () => {

    //SK TEST A FAIRE
    it('Should create new job', () => {

    })

    it('should add retrieve item', async () =>{
        let jobItemStudy = new JobItemRetrieve(new QueryStudyAnswer('id',5, 'aet', 'salim', 'id', 'accession', 'CT', 'desc', 'uid', '20200101', 3, 1500))
        

    })

})