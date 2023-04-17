import axios from "axios";

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

    return axios.put("/api/ldap/settings/", options).then((answer) => true
    ).catch(error => { throw error })
  },

  getLdapSettings() {

    return axios.get("/api/ldap/settings/").then((answer) => answer.data
    ).catch(error => { throw error })
  },

  testLdapSettings() {

    return axios.get("/api/ldap/test").then(async (answer) => await answer.data
    ).catch(error => { throw error })
  },

  createMatch(groupName, role) {

    let payload = {
      groupName: groupName,
      associedRole: role
    }

    return axios.post("/api/ldap/matches/", payload).then((answer) => true
    ).catch(error => {
      throw error
  })
  },

  deleteMatch(Match) {

    //SK SYNTAXE FAUSSE FAUDRAIT PASSER LA CLE DANS URI ET FAIRE JUSTE UN DELETE DESSUS
    return axios.delete("/api/ldap/matches/", { correspodence: Match }).then((answer) => true
    ).catch(error => {
      throw error
  })
  },

  getAllCorrespodences() {

    return axios.get("/api/ldap/matches/").then(async (answer) => await (answer.data)
    ).catch(error => {
      throw error
  })
  },

  getAllGroupName() {

    return axios.get("/api/ldap/groupname/").then(async (answer) =>  await (answer.data)
    ).catch(error => { throw error })
  }

}

export default ldap
