const User = require('../model/Users')

// setup console reporter
const JasmineConsoleReporter = require('jasmine-console-reporter')
const reporter = new JasmineConsoleReporter({
  colors: 1, // (0|false)|(1|true)|2
  cleanStack: 1, // (0|false)|(1|true)|2|3
  verbosity: 4, // (0|false)|1|2|(3|true)|4|Object
  listStyle: 'indent', // "flat"|"indent"
  timeUnit: 'ms', // "ms"|"ns"|"s"
  timeThreshold: { ok: 500, warn: 1000, ouch: 3000 }, // Object|Number
  activity: true,
  emoji: true, // boolean or emoji-map object
  beep: true
})

jasmine.getEnv().addReporter(reporter)

describe('Testing User Creation', () => {
  it('should create user', async () => {
    await User.createUser('TestUser', 'password', false)
  })
})

describe('Testing User Data', () => {
  it('should check user password', async () => {
    const userObject = new User('TestUser')
    const checkPassword = await userObject.checkPassword('password')
    expect(userObject.username).toBe('TestUser')
    expect(checkPassword).toBe(true)
  })

  it('should report user admin status', async () => {
    const userObject = new User('TestUser')
    expect(await userObject.isAdmin()).toBe(false)
  })

  it('should delete user', async () => {
    const userObject = new User('TestUser')
    const userEntity = await userObject._getUserEntity()
    await userEntity.destroy()
    const promise = new Promise((resolve, reject) => {
      const userObject2 = new User('TestUser')
      userObject2._getUserEntity().then((user) => {
        resolve(user)
      }).catch((error) => {
        reject(error)
      })
    })

    await expectAsync(promise).toBeRejectedWithError('User Not Found')
  })
})
