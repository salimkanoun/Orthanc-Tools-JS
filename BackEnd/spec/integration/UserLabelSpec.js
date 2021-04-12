const UserLabel = require('../../repository/UserLabel')
const Label = require('../../repository/Label')
const User = require('../../repository/User')
const {OTJSDBEntityNotFoundException} = require('../../Exceptions/OTJSErrors')

//To run the test : npm test spec/integration/UserLabelSpec.js
beforeEach(async function(){
  const l = await Label.getLabel('test_user_label')
  const u = await User.getUser('test')
  if(l==null){
    const label = await Label.create('test_user_label')
  }
  if(u==null){
    const user = await User.create('test','test','test','test.test@testmail.com','test','user',false)
  }
})

afterEach(async function(){
  const l = await Label.getLabel('test_user_label')
  const u = await User.getUser('test')
  if(!(l==null)){
    const label = await Label.delete('test_user_label')
  }
  if(!(u==null)){
    const user = await User.delete('test')
  }
})




describe('Testing UserLabel Table',()=>{
  it('should create and get a UserLabel',async()=>{
    const user= await User.getUser('test')
    const label=await Label.getLabel('test_user_label')
    const user_label = await UserLabel.create(user.id,label.label_name)

    let schedule = await UserLabel.getUserLabel(user.id,label.label_name)
    expect(schedule==null).toBe(false)
    expect(schedule.user_id).toBe(user.id)
    expect(schedule.label_name).toBe(label.label_name)
  })

  it('should delete a UserLabel',async()=>{
    const user= await User.getUser('test')
    const user_label = await UserLabel.delete(user.id,'test_user_label')
    let schedule = await UserLabel.getUserLabel(user.id,'test_user_label')

    expect(schedule==null).toBe(true)
  })

  it('shoudl throw an error when deleting',async()=>{
    try{
      const user= await User.getUser('test')
      await UserLabel.delete(1234,'test_user_label unknown')
    }catch(e){
      expect(typeof e).toEqual(typeof new OTJSDBEntityNotFoundException)
    }
  })
})