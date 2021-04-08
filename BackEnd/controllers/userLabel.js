var UserLabel = require('../model/UserLabel')

const createUserLabel = async function (req,res){
  const body = req.body
  await UserLabel.createUserLabel(body.user_id,body.label_name)
  res.sendStatus(201)
}

const deleteUserLabel = async function(req,res){
  const body = req.body
  await UserLabel.deleteUserLabel(body.user_id,body.label_name)
  res.sendStatus(200)
}

const getUsersLabels = async function(req,res){
  let userslabels = await UserLabel.getAll()
  res.json(userslabels)
}

module.exports = {createUserLabel,deleteUserLabel,getUsersLabels}