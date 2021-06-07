const ldap = {

  setLdapSettings(typeGroup, address, port, DN, password, protocol, base, group, user) {

    const options = {
      TypeGroup: typeGroup,
      address: address,
      port: port,
      DN: DN,
      password: password,
      protocol: protocol,
      base: base,
      group: group,
      user: user
    }

    const setLdapSettingsOption = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(options)
    };

    return fetch("/api/ldap/settings/", setLdapSettingsOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return true
    }).catch(error => { throw error })
  },

  getLdapSettings() {

    const getLdapSettingsOption = {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }

    return fetch("/api/ldap/settings/", getLdapSettingsOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return (answer.json())
    }).catch(error => { throw error })
  },

  testLdapSettings() {

    const testLdapSettingsOption = {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }

    return fetch("/api/ldap/test", testLdapSettingsOption).then(async (answer) => {
      if (!answer.ok) { throw answer }
      return await answer.json()
    }).catch(error => { throw error })
  },

  createMatch(groupName, role) {

    let payload = { 
      groupName: groupName,
      associedRole: role 
    }

    const createMatchOption = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    };

    return fetch("/api/ldap/matches/", createMatchOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return true
    })
  },

  deleteMatch(Match) {

    const deleteMatchOption = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ correspodence: Match })
    }

    //SK SYNTAXE FAUSSE FAUDRAIT PASSER LA CLE DANS URI ET FAIRE JUSTE UN DELETE DESSUS
    return fetch("/api/ldap/matches/", deleteMatchOption).then((answer) => {
      if (!answer.ok) { throw answer }
      return true
    })
  },

  getAllCorrespodences() {

    const getAllCorrespodencesOption = {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }

    return fetch("/api/ldap/matches/", getAllCorrespodencesOption).then(async (answer) => {
      if (!answer.ok) { throw answer }
      return await (answer.json())
    })
  },

  getAllGroupName() {
    const getAllCorrespodencesOption = {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }

    return fetch("/api/ldap/groupname/", getAllCorrespodencesOption).then(async (answer) => {
      if (!answer.ok) { throw answer }
      return await (answer.json())
    }).catch( error => {throw error} )
  }

}

export default ldap
