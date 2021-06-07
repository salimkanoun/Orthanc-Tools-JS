const Options = require('../model/Options')

const changeSchedule = async function (req, res) {
  await Options.setScheduleTime(req.body.hour_start, req.body.min_start, req.body.hour_stop, req.body.min_stop)
  res.sendStatus(200)
}

const getOptions = async function (req, res) {
  const optionsValues = await Options.getOptions()
  res.json(optionsValues)
}

const updateRobotOptions = async function(req, res){
  let body = req.body
  Options.setBurnerOptions(
    body.burner_monitored_path,
    body.burner_viewer_path,
    body.burner_label_path,
    body.burner_manifacturer,
    body.burner_monitoring_level,
    body.burner_support_type,
    body.burner_delete_study_after_sent,
    body.burner_transfer_syntax,
    body.burner_date_format
  )
  res.sendStatus(200)
}


const getOrthancServer = function (req, res) {
  const orthancSettings = Options.getOrthancConnexionSettings()
  res.json(orthancSettings)
}

const setOrthancServer = function (req, res) {
  const data = req.body
  Options.setOrthancConnexionSettings(data.orthancAddress, data.orthancPort, data.orthancUsername, data.orthancPassword)
  res.sendStatus(200)
}

const getRedisServer = function (req, res){
  const redisSettings = Options.getRedisConnexionSettings()
  res.json(redisSettings)
}

const setRedisServer = function (req, res){
  const data = req.body
  Options.setRedisConnexionSettings(data.redisAddress, data.redisPort, data.redisPassword)
  res.sendStatus(200)
}

const getMode = async function(req, res) {
  const mode = await Options.getMode()
  res.json(mode)
}

const changeMode = async function(req, res) {
  const mode = await req.body.mode
  Options.changeMode(mode)
  res.json(true)
}  


const setExportOption = async function(req, res){
  let body = req.body
  Options.setExportOption(body.export_transcoding);
  res.sendStatus(200);
}

const getExportTranscoding = async function(req, res){
  let transcodeTS = await Options.getExportOption()
  res.send(transcodeTS)
}
module.exports = { changeSchedule, getOptions, getOrthancServer, setOrthancServer, getMode, changeMode, updateRobotOptions, getRedisServer, setRedisServer, setExportOption, getExportTranscoding }
