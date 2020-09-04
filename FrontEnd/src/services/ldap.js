import { toastifyError, toastifySuccess } from './toastify'

const ldap = {

    async setLdapSettings(LdapSettings){
      const setLdapSettingsOption = {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(LdapSettings)
      };

        return fetch("/api/ldap/settings/", setLdapSettingsOption ).then((answer) => {
            if (!answer.ok) { throw answer }
            toastifySuccess('Settings updated')
            return (answer.json())
          }).catch(error => toastifyError(error))
    },

    async getLdapSettings() {

      const getLdapSettingsOption =  {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }

        return fetch("/api/ldap/settings/", getLdapSettingsOption ).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          }).catch(error => toastifyError(error))
    },

    async testLdapSettings() {

      const testLdapSettingsOption =  {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }

        return fetch("/api/ldap/test", testLdapSettingsOption ).then(async (answer) => {
            if (!answer.ok) { throw answer }
            let ans = await answer.json()
            if(ans) {
              toastifySuccess('Connexion established')
            } else {
              toastifyError('connexion failed')
            }
            return
          }).catch(error => toastifyError('connexion failed'))
    },

    async createCorrespondence(Correspondence){

        const createCorrespondenceOption = {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify([Correspondence])
        };
  
          return fetch("/api/ldap/correspondences/", createCorrespondenceOption ).then((answer) => {
              if (!answer.ok) { throw answer }
              toastifySuccess('Correspodence create with success')
              return (answer.json())
            }).catch(async error => {
              let errorText = await error.text()
              toastifyError(errorText)
            })
      },
      
    async deleteCorrespondence(Correspondence){
      const deleteCorrespondenceOption = {
            method: 'DELETE',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({correspodence:Correspondence})
        };
    
            return fetch("/api/ldap/correspondences/", deleteCorrespondenceOption ).then((answer) => {
                if (!answer.ok) { throw answer }
                    toastifySuccess('Correspondence deleted with success')
                    return (answer.json())
            }).catch(error => toastifyError(error))
        }, 
        
    async getAllCorrespodences() {

      const getAllCorrespodencesOption =  {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }

        return fetch("/api/ldap/correspondences/", getAllCorrespodencesOption ).then(async (answer) => {
            if (!answer.ok) { throw answer }
            return await (answer.json())
          }).catch(error => toastifyError(error))
    },

    async getAllGroupName() {
      const getAllCorrespodencesOption =  {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }

        return fetch("/api/ldap/groupname/", getAllCorrespodencesOption ).then(async (answer) => {
            if (!answer.ok) { throw answer }
            let ans = await answer.json()
            return (ans)
          }).catch(error => toastifyError(error))
    }
}

export default ldap