const UserLabel = require('../../repository/UserLabel')
const Label = require('../../repository/Label')
const User = require('../../repository/User')
const {OTJSDBEntityNotFoundException} = require('../../Exceptions/OTJSErrors')

//To run the test : npm test spec/integration/UserLabelSpec.js
beforeEach(async function(){
  var l = await Label.getLabel('test_user_label')
  var u = await User.getUser('test')
  
  if(l==null){
    l = await Label.create('test_user_label')
  }
  if(u==null){
    u = await User.create('test','test','test','test.test@testmail.com','test','user',false)
  }
  var ul = await UserLabel.getUserLabel(u.id,l.label_name)
  if(ul==null){
    await UserLabel.create(u.id,l.label_name)
  }

})

afterEach(async function(){
  var l = await Label.getLabel('test_user_label')
  var u = await User.getUser('test')
  var ul = await UserLabel.getUserLabel(u.id,l.label_name)
  if((!(l==null))&& (!(u==null)) &&!(ul==null)){
    await UserLabel.delete(u.id,l.label_name)
  }
  if(!(l==null)){
    await Label.delete('test_user_label')
  }
  if(!(u==null)){
    await User.delete('test')
  }
})




describe('Testing UserLabel Table',()=>{
  it('should confirm creating a UserLabel and get a UserLabel',async()=>{
    let user = await User.getUser('test')
    let schedule = await UserLabel.getUserLabel(user.id,'test_user_label')
    expect(schedule).not.toBeNull()
    expect(schedule.user_id).toBe(user.id)
    expect(schedule.label_name).toBe('test_user_label')
  })

  it('should not get a UserLabel',async()=>{
    let schedule = await UserLabel.getUserLabel(1452265,'unknow label test')
    expect(schedule).toBeNull()
  })

  it('should delete a UserLabel',async()=>{
    const user= await User.getUser('test')
    await UserLabel.delete(user.id,'test_user_label')
    let schedule = await UserLabel.getUserLabel(user.id,'test_user_label')
    expect(schedule).toBeNull()
  })

  it('shoudl throw an error when deleting',async()=>{
    try{
      await UserLabel.delete(1234,'test_user_label unknown')
    }catch(e){
      expect(e).toBeInstanceOf(OTJSDBEntityNotFoundException)
    }
  })
})