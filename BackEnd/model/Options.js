const Option = require('../database/models/option')
class Options {

  async getOptions () {
    let option = await Option.findOne(({ where: { id: 1 } }))
    return ({ hour: option.hour, min: option.min })
  }

  async setScheduleTime (hour, min) {
    let option = await Option.findOne(({ where: { id: 1 } }))
    option.hour = hour
    option.min = min
    await option.save()
  }
}

module.exports = Options
