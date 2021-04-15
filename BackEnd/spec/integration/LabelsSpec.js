const Label = require('../../repository/Label')
const StudyLabel = require('../../repository/StudyLabel')
const UserLabel = require('../../repository/UserLabel')
const User = require('../../repository/User')
const {OTJSDBEntityNotFoundException} = require('../../Exceptions/OTJSErrors')
const crypto = require('../../adapter/cryptoAdapter')
beforeEach(async function(){
  //made for cascade tests if they were wrongly executed
  //remove foreign key constraint for other tests
  let sl = await StudyLabel.getStudyLabel('test2','label test')
  if(!(sl==null)){
    await StudyLabel.delete('test2','label test')
  }
  sl = await StudyLabel.getStudyLabel('test2','label test2')
  if(!(sl==null)){
    await StudyLabel.delete('test2','label test2')
  } 
  const l = await Label.getLabel('label test2')
  if(!(l==null)){
    await Label.delete('label test2')
  }
  const user = await User.getUser('test')
  if(!(user==null)){
    await User.delete('test')
  }
  //end cascade part

  const label = await Label.getLabel('label test')
  if(label==null){
    await Label.create('label test')
  }
})

afterEach(async function(){
  const label = await Label.getLabel('label test')
  if(!(label==null)){
    await Label.delete('label test')
  }
})

//To run the test : npm test spec/integration/LabelsSpec.js
describe('Testing Label Table',()=>{
  
  it('should validate creating and get one labels or not',async()=>{
    //getting the label created in beforeEach
    let schedule = await Label.getLabel('label test')
    expect(schedule).not.toBeNull()
    expect(schedule.label_name).toBe('label test')
  })

  it('should not get one labels',async()=>{
    let schedule = await Label.getLabel('undefined label test')
    expect(schedule).toBeNull()
  })

  it('should update one labels',async()=>{
    await Label.update('label test','label_modified')
    let schedule = await Label.getLabel('label_modified')
    expect(schedule).not.toBeNull()
    expect(schedule.label_name).toBe('label_modified')

    //reupdate to clean the row with afterEach function
    await Label.update('label_modified','label test') 
  })

  it('should delete one labels',async()=>{
    await Label.delete('label test')
    let schedule = await Label.getLabel('label test')
    expect(schedule).toBeNull()

  })

  it('should return an error for delete',async()=>{
    try{
      await Label.delete('label delete test')
    }catch(e){
      expect(e).toBeInstanceOf(OTJSDBEntityNotFoundException)
    }
  })

  it('should return an error for update',async()=>{
    try{
      await Label.update('label update test')
    }catch(e){
      expect(e).toBeInstanceOf(OTJSDBEntityNotFoundException)
    }
  })

})

describe('Testing cascade effect on label_name',()=>{
  it('should modify label_name on StudyLabels table',async()=>{
    /*
      add a StudyLabels that contains label test as label_name
      modify label_name on Labels
      verify that the row a StudyLabels as been modified then delete it
    */
    await StudyLabel.create('test2','label test')
    var study_label = await StudyLabel.getStudyLabel('test2','label test')
    expect(study_label).not.toBeNull()
    expect(study_label.study_instance_uid).toBe('test2')
    expect(study_label.label_name).toBe('label test')

    await Label.update('label test','label test2')
    let label = await Label.getLabel('label test2')
    expect(label).not.toBeNull()
    var study_label_upd = await StudyLabel.getStudyLabel('test2','label test2')

    expect(study_label_upd).not.toBeNull()
    expect(study_label_upd.study_instance_uid).toBe('test2')
    expect(study_label_upd.label_name).toBe('label test2')

    await StudyLabel.delete(study_label_upd.study_instance_uid,study_label_upd.label_name)
    await Label.delete(study_label_upd.label_name)

  })

  it('should modify label_name on UserLabels table',async()=>{
    /*
      add a UserLabels that contains label test as label_name
      modify label_name on Labels
      verify that the row on UserLabels as been modified then delete it
    */
    await User.create('test','test','test','test','test','user',false)
    var user = await User.getUser('test')
    await UserLabel.create(user.id,'label test')
    var user_label = await UserLabel.getUserLabel(user.id,'label test')
    expect(user_label).not.toBeNull()
    expect(user_label.user_id).toBe(user.id)
    expect(user_label.label_name).toBe('label test')

    await Label.update('label test','label test2')
    let label = await Label.getLabel('label test2')
    expect(label).not.toBeNull()

    user_label = await UserLabel.getUserLabel(user.id,'label test2')
    expect(user_label).not.toBeNull()
    expect(user_label.user_id).toBe(user.id)
    expect(user_label.label_name).toBe('label test2')

    await UserLabel.delete(user_label.user_id,user_label.label_name)
    await User.delete('test')
    await Label.delete(user_label.label_name)
  })

})