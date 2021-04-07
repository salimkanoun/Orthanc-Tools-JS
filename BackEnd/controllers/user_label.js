var User_Label = require('../model/User_Label')

const createUserLabel = async function (req,res){
  const body = req.body
  await User_Label.createUserLabel(body.user_id,body.label_name)
  res.sendStatus(201)
}

const deleteUserLabel = async function(req,res){
  const body = req.body
  await User_Label.deleteUserLabel(body.user_id,body.label_name)
  res.sendStatus(200)
}

const getUsersLabels = async function(req,res){
  let users_labels = await User_Label.getAll()
  res.json(users_labels)
}

module.exports = {createUserLabel,deleteUserLabel,getUsersLabels}