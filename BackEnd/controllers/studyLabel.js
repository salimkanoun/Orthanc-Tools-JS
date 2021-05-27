var StudyLabel = require('../model/StudyLabel')

const createStudyLabel = async function(req,res){
  await StudyLabel.createStudyLabel(req.params.uid,req.params.name,req.params.id)
  res.sendStatus(201)
}

const deleteStudyLabel = async function(req,res){
  await StudyLabel.deleteStudyLabel(req.params.uid,req.params.name)
  res.sendStatus(200)
}

const getStudiesLabels = async function(req,res){
  let studieslabels = await StudyLabel.getAll()
  res.json(studieslabels)
}

const getStudiesLabel = async function(req,res){
  let studieslabels = await StudyLabel.getStudiesByLabel(req.params.name)
  res.json(studieslabels)
}

const getStudyLabels = async function(req,res){
  let studieslabels = await StudyLabel.getLabelsByStudy(req.params.uid)
  res.json(studieslabels)
}

const getStudyLabelsByStudyOrthancID = async function(req,res){
  let studieslabels = await StudyLabel.getStudyLabelsByStudyOrthancID(req.params.id)
  res.json(studieslabels)
}

module.exports = {createStudyLabel,deleteStudyLabel,getStudiesLabels,getStudiesLabel,getStudyLabels,getStudyLabelsByStudyOrthancID}