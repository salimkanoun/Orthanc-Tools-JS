const Label = require('../../repository/Label')
const StudyLabel = require('../../repository/StudyLabel')
const UserLabel = require('../../repository/UserLabel')
const {OTJSDBEntityNotFoundException} = require('../../Exceptions/OTJSErrors')

beforeEach(async function(){
  const label = await Label.getLabel('label test')
  if(label==null){
    const create = await Label.create('label test')
  }
})

afterEach(async function(){
  const label = await Label.getLabel('label test')
  if(!(label==null)){
    const create = await Label.delete('label test')
  }
})

//To run the test : npm test spec/integration/LabelsSpec.js
describe('Testing Label Table',()=>{
  
  it('should validate creating and get one labels',async()=>{
    let schedule = await Label.getLabel('label test')
    expect(schedule.label_name).toBe('label test')
  })

  it('should update one labels',async()=>{
    const label = await Label.update('label test','label_modified')
    let schedule = await Label.getLabel('label_modified')
    expect(schedule==null).toBe
    expect(schedule.label_name).toBe('label_modified')

    const reupdate = await Label.update('label_modified','label test')
  })

  it('should delete one labels',async()=>{
    const label = await Label.delete('label test')
    let schedule = await Label.getLabel('label test')
    expect(schedule==null).toBe(true)

  })

  it('should return an error for delete',async()=>{
    try{
      await Label.delete('label delete test')
    }catch(e){
      expect(typeof e).toEqual(typeof new OTJSDBEntityNotFoundException)
    }
  })

  it('should return an error for update',async()=>{
    try{
      await Label.update('label update test')
    }catch(e){
      expect(typeof e).toEqual(typeof new OTJSDBEntityNotFoundException)
    }
  })

})

describe('Testing cascade effect on label_name',()=>{
  it('should modify label_name on StudyLabels table',async()=>{
    //add a StudyLabels that contains label test as label_name
    //modify label_name on Labels
    //verify that the row a StudyLabels as been modified then delete it
    let study_label = StudyLabel.create('test2','label test')
    const update = Label.update('label test','label test2')
    study_label = StudyLabel.getStudyLabel('test2','label test2')

    expect(study_label==null).toBe(false)
    expect(study_label.label_name).toBe('label test2')

    await Label.delete('label test2')

  })

  it('should modify label_name on UserLabels table',async()=>{
    //add a UserLabels that contains label test as label_name
    //modify label_name on Labels
    //verify that the row a UserLabels as been modified then delete it
  })

})