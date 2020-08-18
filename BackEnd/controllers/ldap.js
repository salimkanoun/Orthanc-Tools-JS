const Ldap = require('../model/Ldap')

var getLdapSettings = async function(req, res) {
  const options = await Ldap.getLdapSettings()
  res.json(options)
}

var setLdapSettings = async function(req, res) {
  try {
    const options = req.body
    await Ldap.setLdapSettings(options)
    res.json(true)
  } catch(err) {
    console.log(err)
    res.status(401).send('settings fail')
  }
}

var testLdapSettings = async function(req, res) {
  try {  
  await Ldap.testLdapSettings(function(result) {
    return res.json(result)
    })
  } catch(err) {
    console.log(err)
  }  
}

var getLdapCorrespodences = async function(req, res) {
  const correspondences = await Ldap.getAllCorrespodences()
  res.json(correspondences)
}

var setLdapCorrespodence = async function(req, res) {
  try {
    const correspondences = req.body
    await Ldap.setCorrespodence(correspondences)
    res.json(true)

  } catch (err) {
    console.log(err)
    res.status(401).send('fail to create correspondence')
  }
}

var deleteCorrespodence = async function(req, res){
  try{ 
    const correspondence = req.body
    await Ldap.deleteCorrespodence(correspondence)
    res.json(true)
  } catch (err) {
      console.log(err)
      res.status(401).send('fait to delete correspondence')
  }
}

var getLdapGroupeNames = async function(req, res) {
  try {
    await Ldap.getAllGroupeNames(async function(correspondences) {
      await res.json(correspondences)
    })
  } catch(err) {
    console.log(err)
  }
}

module.exports = { getLdapSettings, setLdapSettings, testLdapSettings, getLdapCorrespodences, setLdapCorrespodence, deleteCorrespodence, getLdapGroupeNames }