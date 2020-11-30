const Options = require('../model/Options')
const {robot} = require('../model/robot/Robot')

var changeSchedule = async function (req, res) {
  await Options.setScheduleTime(req.body.hour_start, req.body.min_start, req.body.hour_stop, req.body.min_stop)
  // Refresh Retrieve Robot to the new time
  robot.updateRetrieveJobsSchelude()
  res.json(true)
}

var getOptions = async function (req, res) {
  const optionsValues = await Options.getOptions()
  res.json(optionsValues)
}

var updateRobotOptions = async function(req, res){
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
  res.json(true)
}


var getOrthancServer = function (req, res) {
  const orthancSettings = Options.getOrthancConnexionSettings()
  res.json(orthancSettings)
}

var setOrthancServer = function (req, res) {
  const data = req.body
  Options.setOrthancConnexionSettings(data.OrthancAddress, data.OrthancPort, data.OrthancUsername, data.OrthancPassword)
  res.end()
}

var getMode = async function(req, res) {
  const mode = await Options.getMode()
  res.json(mode)
}

var changeMode = async function(req, res) {
  const mode = await req.body.mode
  Options.changeMode(mode)
  res.json(true)
}  

module.exports = { changeSchedule, getOptions, getOrthancServer, setOrthancServer, getMode, changeMode, updateRobotOptions }
