var StudyLabel = require('../model/StudyLabel')

/**
 * Create a StudyLabel
 * @param {*} req express request
 * @param {*} res request result
 */
const createStudyLabel = async function(req,res){
  await StudyLabel.createStudyLabel(req.params.uid,req.params.name,req.params.id,req.body.study_orthanc_id,req.body.patient_orthanc_id)
  res.sendStatus(201)
}

/**
 * Delete a StudyLabel
 * @param {*} req express request
 * @param {*} res request result
 */
const deleteStudyLabel = async function(req,res){
  await StudyLabel.deleteStudyLabel(req.params.uid,req.params.name)
  res.sendStatus(200)
}

/**
 * Get all StudyLabels
 * @param {*} req express request
 * @param {*} res request result
 */
const getStudiesLabels = async function(req,res){
  let studieslabels = await StudyLabel.getAll()
  res.json(studieslabels)
}

/**
 * Get StudyLabels using a label name
 * @param {*} req express request
 * @param {*} res request result
 */
const getStudiesLabel = async function(req,res){
  let studieslabels = await StudyLabel.getStudiesByLabel(req.params.name)
  res.json(studieslabels)
}

/**
 * get StudyLabels using a study instance uid
 * @param {*} req express request
 * @param {*} res request result
 */
const getStudyLabels = async function(req,res){
  let studieslabels = await StudyLabel.getLabelsByStudy(req.params.uid)
  res.json(studieslabels)
}

/**
 * Get StudyLabels using study orthanc id
 * @param {*} req express request
 * @param {*} res request result
 */
const getStudyLabelsByStudyOrthancID = async function(req,res){
  let studieslabels = await StudyLabel.getStudyLabelsByStudyOrthancID(req.params.id)
  res.json(studieslabels)
}

module.exports = {createStudyLabel,deleteStudyLabel,getStudiesLabels,getStudiesLabel,getStudyLabels,getStudyLabelsByStudyOrthancID}