const db = require('../database/models')
const Configstore = require('configstore');
const packageJson = require('../package.json');
const config = new Configstore(packageJson.name, {OrthancAdress: 'http://localhost', OrthancPort : 8042});

const Options = {

  getOptions: async () => {
    const option = await db.Option.findOne(({ where: { id: 1 } }))
    return ({ hour: option.hour, min: option.min })
  },

  setScheduleTime: async (hour, min) => {
    const option = await db.Option.findOne(({ where: { id: 1 } }))
    option.hour = hour
    option.min = min
    await option.save()
  },

  setOrthancConnexionSettings :  (address, port, username, password) => {
    config.set('OrthancAdress', address);
    config.set('OrthancPort', port);
    config.set('OrthancUsername', username);
    config.set('OrthancPassword', password);
    Options.configSettings = undefined
  },

  getOrthancConnexionSettings : () =>{
    console.log(Options.configSettings)

    if(Options.configSettings === undefined){

      Options.configSettings = {
        OrthancAdress : config.get('OrthancAdress'),
        OrthancPort : config.get('OrthancPort'),
        OrthancUsername : config.get('OrthancUsername'),
        OrthancPassword : config.get('OrthancPassword')
      }

    }
    
    return Options.configSettings
  }
  
}

module.exports = Options
