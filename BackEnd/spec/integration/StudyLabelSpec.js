const StudyLabel = require('../../repository/StudyLabel')
const Label = require('../../repository/Label')
const {OTJSDBEntityNotFoundException} = require('../../Exceptions/OTJSErrors')

//To run the test : npm test spec/integration/StudyLabelSpec.js
beforeEach(async function(){
  const l = await Label.getLabel('test_study_label')
  if(l==null){
    const label = await Label.create('test_study_label')
  }
})

afterEach(async function(){
  const l = await Label.getLabel('test_study_label')
  if(!(l==null)){
    const label = await Label.delete('test_study_label')
  }
})


describe('Testing StudyLabel Table',()=>{
  it('should create and get a StudyLabel',async()=>{
    const study_instance_uid = 'ABCDEFG'
    const study_label = await StudyLabel.create(study_instance_uid,'test_study_label')

    let schedule = await StudyLabel.getStudyLabel(study_instance_uid,'test_study_label')
    expect(schedule==null).toBe(false)
    expect(schedule.study_instance_uid).toBe('ABCDEFG')
    expect(schedule.label_name).toBe('test_study_label')
  })

  it('should delete a StudyLabel',async()=>{
    const study_labl = await StudyLabel.delete('ABCDEFG','test_study_label')
    let schedule = await StudyLabel.getStudyLabel('ABCDEFG','test_study_label')

    expect(schedule==null).toBe(true)
  })

  it('should throw an error when deleting',async ()=>{
    try{
      await StudyLabel.delete('unknown','test_study_label unknown')
    }catch(e){
      expect(typeof e).toEqual(typeof new OTJSDBEntityNotFoundException)
    }
  })
})