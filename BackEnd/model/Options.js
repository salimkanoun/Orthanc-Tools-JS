const { EventEmitter } = require('events')
const Option = require('../repository/Option')


class OptionEventEmittter extends EventEmitter { }

/**
 * Update and read configuration data from database or config store
 */
const Options = {

  optionEventEmiter: new OptionEventEmittter(),

  getOptions:  () => {
    return Option.getOptionById(1)
  },

  setScheduleTime:  async (startHour, startMin, stopHour, stopMin) => {
    const option = await Options.getOptions()
    option.hour_start = startHour
    option.min_start = startMin
    option.hour_stop = stopHour
    option.min_stop = stopMin
    await option.save()
    Options.optionEventEmiter.emit('schedule_change');
  },

  setBurnerOptions: async (burnerMonitoredPath,
    burnerViewerPath,
    burnerLabelPath,
    burnerManifacturer,
    burnerMonitoringLevel,
    burnerSupportType,
    burnerDeleteStudyAfterSent,
    burnerTransferSyntax,
    burnerDateFormat) => {

    const option = await Options.getOptions()

    option.burner_monitored_path = burnerMonitoredPath
    option.burner_viewer_path = burnerViewerPath
    option.burner_label_path = burnerLabelPath
    option.burner_manifacturer = burnerManifacturer
    option.burner_monitoring_level = burnerMonitoringLevel
    option.burner_support_type = burnerSupportType
    option.burner_delete_study_after_sent = burnerDeleteStudyAfterSent
    option.burner_transfer_syntax = burnerTransferSyntax
    option.burner_date_format = burnerDateFormat

    await option.save()

  },

  setBurnerStarted:  async (started) => {
    const option = await Options.getOptions()
    option.burner_started = started
    await option.save()
  },

  getOrthancConnexionSettings: () => {
    return {
      orthancAddress: process.env.ORTHANC_ADDRESS,
      orthancPort: process.env.ORTHANC_PORT,
      orthancUsername: process.env.ORTHANC_USERNAME,
      orthancPassword: process.env.ORTHANC_PASSWORD,
    }
  },

  getRedisConnexionSettings : () =>{
    return {
      redisAddress: process.env.REDIS_HOST,
      redisPort: process.env.REDIS_PORT,
      redisPassword: process.env.REDIS_PASSWORD
    }
  }, 

  setOrthancConnexionSettings: (orthancAddress, orthancPort, orthancUsername, orthancPassword) => {
    process.env['ORTHANC_ADDRESS'] = orthancAddress;
    process.env['ORTHANC_PORT'] = orthancPort;
    process.env['ORTHANC_USERNAME'] = orthancUsername;
    process.env['ORTHANC_PASSWORD'] = orthancPassword;
  },

  setRedisConnexionSettings : (redisAddress, redisPort, redisPassword ) =>{
    process.env['REDIS_HOST'] = redisAddress;
    process.env['REDIS_PORT'] = redisPort;
    process.env['REDIS_PASSWORD'] = redisPassword;
  }, 

  getMode: async () => {
    let mode = await Options.getOptions()
    return mode.ldap
  },

  changeMode: async (mode) => {
    let option = await Options.getOptions()
    option.ldap = mode
    await option.save()
  },

  setExportOption: async(transcoding)=>{
    const option = await Options.getOptions()

    option.export_transcoding = transcoding

    await option.save()
  },

  getExportOption : async () => {
    const option = await Options.getOptions()
    return option.export_transcoding
  }

}

module.exports = Options
