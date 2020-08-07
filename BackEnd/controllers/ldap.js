const Ldap = require('../model/Ldap')

var getLdapSettings = async function(req, res) {
  const options = await Ldap.getLdapSettings()
  await res.json(options)
}

var setLdapSettings = async function(req, res) {
  const options = await req.body
  Ldap.setLdapSettings(options)
  await res.json(true)
}

var testLdapSettings = async function(req, res) {
    const result = await Ldap.testLdapSettings()
    await res.json(result)
}


module.exports = { getLdapSettings, setLdapSettings, testLdapSettings  }