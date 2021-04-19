var Labels = require('../model/Labels')

const createLabel = async function(req,res){
  const body = req.body
  await Labels.createLabels(body.label_name)
  res.sendStatus(201)
}

const getLabels = async function(req,res){
  let labels = await Labels.getAllLabels()
  res.json(labels)
}

const modifyLabel = async function(req,res){
  const body = req.body
  await Labels.modifyLabels(body.label_name,body.new_label_name)
  res.sendStatus(200)
}

const deleteLabel = async function(req,res){
  const body = req.body
  await Labels.deleteLabels(body.label_name)
  res.sendStatus(200)
}

module.exports = {createLabel,getLabels,modifyLabel,deleteLabel}