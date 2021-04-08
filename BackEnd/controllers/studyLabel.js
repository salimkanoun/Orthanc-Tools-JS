var StudyLabel = require('../model/StudyLabel')

const createStudyLabel = async function(req,res){
  const body = req.body
  await StudyLabel.createStudyLabel(body.study_instance_uid,body.label_name)
  res.sendstatus(201)
}

const deleteStudyLabel = async function(req,res){
  const body = req.body
  await StudyLabel.deleteStudyLabel(body.study_instance_uid,body.label_name)
  res.sendstatus(200)
}

const getStudiesLabels = async function(req,res){
  let studieslabels = await StudyLabel.getAll()
  res.json(studieslabels)
}

module.exports = {createStudyLabel,deleteStudyLabel,getStudiesLabels}