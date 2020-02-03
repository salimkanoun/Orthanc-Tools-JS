const db = require('../database/models')

Options = {

  getOptions : async () => {
    const option = await db.Option.findOne(({ where: { id: 1 } }))
    return ({ hour: option.hour, min: option.min })
  },

  setScheduleTime : async (hour, min) => {
    const option = await db.Option.findOne(({ where: { id: 1 } }))
    option.hour = hour
    option.min = min
    await option.save()

  }
}

module.exports = Options
