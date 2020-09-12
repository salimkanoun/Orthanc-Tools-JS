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
  const matches = await Ldap.getAllCorrespodences()
  res.json(matches)
}

var setLdapCorrespodence = async function(req, res) {
  try {
    const matches = req.body
    await Ldap.setCorrespodence(matches)
    res.json(true)

  } catch (err) {
    console.log(err)
    res.status(401).send('fail to create match')
  }
}

var deleteCorrespodence = async function(req, res){
  try{ 
    const match = req.body
    await Ldap.deleteCorrespodence(match)
    res.json(true)
  } catch (err) {
      console.log(err)
      res.status(401).send('fait to delete match')
  }
}

var getLdapGroupeNames = async function(req, res) {
  try {
    await Ldap.getAllGroupeNames(async function(matches) {
      await res.json(matches)
    })
  } catch(err) {
    console.log(err)
  }
}

module.exports = { getLdapSettings, setLdapSettings, testLdapSettings, getLdapCorrespodences, setLdapCorrespodence, deleteCorrespodence, getLdapGroupeNames }