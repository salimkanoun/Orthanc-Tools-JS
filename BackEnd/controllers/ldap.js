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

var getLdapCorrespodences = async function(req, res) {
  const correspondences = await Ldap.getAllCorrespodences()
  await res.json(correspondences)
}

var setLdapCorrespodence = async function(req, res) {
  const correspondences = await req.body
  Ldap.setCorrespodence(correspondences)
  await res.json(true)
}

var deleteCorrespodence = async function(req, res){
  const correspondence = req.body
  await Ldap.deleteCorrespodence(correspondence)
  res.json(true)
}

var getLdapGroupeNames = async function(req, res) {
  const correspondences = await Ldap.getAllGroupeNames()
  await res.json(correspondences)
}

module.exports = { getLdapSettings, setLdapSettings, testLdapSettings, getLdapCorrespodences, setLdapCorrespodence, deleteCorrespodence, getLdapGroupeNames }