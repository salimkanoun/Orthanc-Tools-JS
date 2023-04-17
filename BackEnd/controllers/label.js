const LabelEntity = require('../model/Entities/LabelEntity')
var Labels = require('../model/Labels')
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
  answer = labels.map(label => LabelEntity.createRolefromDB(label))
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

module.exports = { createLabel, getLabels, modifyLabel, deleteLabel }