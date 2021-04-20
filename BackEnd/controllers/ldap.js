const { OTJSForbiddenException } = require('../Exceptions/OTJSErrors')
const Ldap = require('../model/Ldap')

var getLdapSettings = async function (req, res) {
  const options = await Ldap.getLdapSettings()
  res.json(options)
}

var setLdapSettings = async function (req, res) {
  const options = req.body

  await Ldap.setLdapSettings(
    options.TypeGroup,
    options.address,
    options.port,
    options.DN,
    options.password,
    options.protocol,
    options.group,
    options.user,
    options.base
  )

  res.sendStatus(200)

}

var testLdapSettings = async function (req, res) {
  try {
    let answer = await Ldap.testLdapSettings()
    res.json(answer)
  } catch (error) {
    throw new OTJSForbiddenException(error.message)
  }

}

var getLdapCorrespondences = async function (req, res) {
  try {
    const matches = await Ldap.getAllCorrespondences()
    res.json(matches)
  } catch (error) {
    throw error
  }

}

var setLdapCorrespondence = async function (req, res) {
  let matches = req.body
  await Ldap.setCorrespondence(matches.groupName, matches.associedRole)
  res.sendStatus(200)
}

var deleteCorrespondence = async function (req, res) {
  const match = req.body
  await Ldap.deleteCorrespodence(match.correspodence)
  res.sendStatus(200)
}

var getLdapGroupeNames = async function (req, res) {
  try {
    let groups = await Ldap.getAllLdapGroups()
    res.json(groups)
  } catch (error) {
    throw new OTJSForbiddenException(error.message)
  }

}

module.exports = { getLdapSettings, setLdapSettings, testLdapSettings, getLdapCorrespondences, setLdapCorrespondence, deleteCorrespondence, getLdapGroupeNames }