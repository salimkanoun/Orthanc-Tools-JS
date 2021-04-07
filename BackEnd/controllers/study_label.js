var Study_Label = require('../model/Study_Label')

const createStudyLabel = async function(req,res){
  const body = req.body
  await Study_Label.createStudyLabel(body.study_uid,body.label_name)
  res.sendstatus(201)
}

const deleteStudyLabel = async function(req,res){
  const body = req.body
  await Study_Label.deleteStudyLabel(body.study_uid,body.label_name)
  res.sendstatus(200)
}

const getStudiesLabels = async function(req,res){
  let studies_labels = await Study_Label.getAll()
  res.json(studies_labels)
}

module.exports = {createStudyLabel,deleteStudyLabel,getStudiesLabels}