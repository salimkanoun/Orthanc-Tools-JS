var UserLabel = require('../model/UserLabel')

const createUserLabel = async function (req,res){
  await UserLabel.createUserLabel(req.params.id,req.params.name)
  res.sendStatus(201)
}

const deleteUserLabel = async function(req,res){
  await UserLabel.deleteUserLabel(req.params.id,req.params.name)
  res.sendStatus(200)
}

const getUsersLabels = async function(req,res){
  let userslabels = await UserLabel.getAll()
  res.json(userslabels)
}

const getUserLabels = async function(req,res){
  let userslabels = await UserLabel.getLabelsFromUserId(req.params.id)
  res.json(userslabels)
}

module.exports = {createUserLabel,deleteUserLabel,getUsersLabels,getUserLabels}