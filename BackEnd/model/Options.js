const db = require('../database/models')
const Configstore = require('configstore')
const packageJson = require('../package.json')
const { EventEmitter } = require('events')
const config = new Configstore(packageJson.name, { OrthancAddress: process.env.OrthancAddress || 'http://localhost', 
                                                    OrthancPort: process.env.Port || 8042, 
                                                    OrthancUsername : process.env.OrthancUsername || '', 
                                                    OrthancPassword : process.env.OrthancPassword || '' })

class OptionEventEmittter extends EventEmitter{}

/**
 * Update and read configuration data from database or config store
 */
const Options = {

  optionEventEmiter: new OptionEventEmittter(), 

  getOptions: async () => {
    const option = await db.Option.findOne(({ where: { id: 1 } }))
    return option
  },

  setScheduleTime: async (hour_start, min_start, hour_stop, min_stop) => {
    const option = await db.Option.findOne(({ where: { id: 1 } }))
    option.hour_start = hour_start
    option.min_start = min_start
    option.hour_stop = hour_stop
    option.min_stop = min_stop
    await option.save()
    Options.optionEventEmiter.emit('schedule_change');
  },

  setBurnerOptions : async (burner_monitored_path, burner_viewer_path, burner_label_path, burner_manifacturer, burner_monitoring_level,
    burner_support_type, burner_delete_study_after_sent, burner_transfer_syntax, burner_date_format ) => {

    const option = await db.Option.findOne(({ where: { id: 1 } }))

    option.burner_monitored_path = burner_monitored_path
    option.burner_viewer_path = burner_viewer_path
    option.burner_label_path = burner_label_path
    option.burner_manifacturer = burner_manifacturer
    option.burner_monitoring_level = burner_monitoring_level
    option.burner_support_type = burner_support_type
    option.burner_delete_study_after_sent = burner_delete_study_after_sent
    option.burner_transfer_syntax = burner_transfer_syntax
    option.burner_date_format = burner_date_format
    
    await option.save()

  },

  setBurnerStarted : async (started) =>{
    const option = await db.Option.findOne(({ where: { id: 1 } }))
    option.burner_started = started
    await option.save()
  },

  setOrthancConnexionSettings: (address, port, username, password) => {
    config.set('OrthancAddress', address)
    config.set('OrthancPort', port)
    config.set('OrthancUsername', username)
    config.set('OrthancPassword', password)
    Options.configSettings = undefined
  },

  getOrthancConnexionSettings: () => {
    if (Options.configSettings === undefined) {
      Options.configSettings = {
        OrthancAddress: config.get('OrthancAddress'),
        OrthancPort: config.get('OrthancPort'),
        OrthancUsername: config.get('OrthancUsername'),
        OrthancPassword: config.get('OrthancPassword')
      }
    }

    return Options.configSettings
  },

  getCdBurnerOptions : async () => {
    const options = await db.Option.findOne(({ where: { id: 1 } }));
    return options
  },

  getMode: async () => {
    let mode
    try {
      mode = await db.Option.findOne()

    } catch (err) {
      console.log(err)
    }

    return mode.ldap
  },

  changeMode: async (mode) => {
    
    try {
      await db.Option.upsert({
        id:1,
        ldap: mode
      })

    } catch (err) {
      console.log(err)
    }
  }

}

module.exports = Options
