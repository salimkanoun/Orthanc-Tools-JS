const Ldap = require('../model/Ldap')

var getLdapSettings = async function(req, res) {
  const options = await Ldap.getLdapSettings()
  await res.json(options)
  console.log("TEST CONTROLLER get LDAP SETTINGS : ")
  console.log(options)
}

var setLdapSettings = async function(req, res) {
  const options = await req.body.options
  Ldap.setLdapSettings(options)
  await res.json(true)
  console.log("TEST CONTROLLER SET LDAP SETTINGS : ")
  console.log(options)
}

var testLdapSettings = async function(req, res) {
    const result = await Ldap.testLdapSettings()
    await res.json(result)
}


module.exports = { getLdapSettings, setLdapSettings, testLdapSettings  }