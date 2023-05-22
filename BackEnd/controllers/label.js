const Labels = require('../model/Labels')
const Orthanc = require('../model/Orthanc')
/**
 * Create a Label
 * @param {*} req express request
 * @param {*} res request result
 */
const createLabel = async function (req, res) {
  await Labels.createLabels(req.params.name)
  res.sendStatus(201)
}

/**
 * get all labels
 * @param {*} req express request
 * @param {*} res request result
 */
const getLabels = async function (req, res) {
  let labels = await Labels.getAllLabels()
  answer = labels.map(label => label.label_name)
  res.json(answer)
}

/**
 * modify a label
 * @param {*} req express request
 * @param {*} res request result
 */
const modifyLabel = async function (req, res) {
  const body = req.body
  await Labels.modifyLabels(req.params.name, body.labelName)
  res.sendStatus(200)
}

/**
 * Delete a label
 * @param {*} req express request
 * @param {*} res request result
 */
const deleteLabel = async function (req, res) {
  await Labels.deleteLabels(req.params.name)
  res.sendStatus(200)
}

const getStudiesWithLabel = async function (req, res) {
  const labelName = req.params.name
  const orthanc = new Orthanc()
  const studies = await orthanc.findInOrthanc('Study', undefined, undefined, undefined, undefined, undefined, undefined, undefined, [labelName])
  res.json(studies)
}

module.exports = { createLabel, getLabels, modifyLabel, deleteLabel, getStudiesWithLabel }