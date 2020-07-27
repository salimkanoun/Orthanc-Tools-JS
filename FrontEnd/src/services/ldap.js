import { toastifyError } from './toastify'
import updateOptions from '../authorizedOption'

const ldap = {

    setLdapSettings(LdapSettings){

      const setLdapSettingsOption = {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(LdapSettings)
      };

        return fetch("/api/ldap/", updateOptions(setLdapSettingsOption) ).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          }).catch(error => toastifyError(error))
    },

    getLdapSettings() {

      const getLdapSettingsOption =  {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }

        return fetch("/api/ldap/", updateOptions(getLdapSettingsOption)).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          }).catch(error => toastifyError(error))
    },

    createCorrespondence(Correspondence){

        const setLdapSettingsOption = {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(LdapSettings)
        };
  
          return fetch("/api/ldap/", updateOptions(setLdapSettingsOption) ).then((answer) => {
              if (!answer.ok) { throw answer }
              return (answer.json())
            }).catch(error => toastifyError(error))
      },
      
    deleteCorrespondence(Correspondence){

        const setLdapSettingsOption = {
            method: 'DELETE',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(LdapSettings)
        };
    
            return fetch("/api/ldap/", updateOptions(setLdapSettingsOption) ).then((answer) => {
                if (!answer.ok) { throw answer }
                    toastifySuccess('Correspondence deleted with success')
                    return (answer.json())
            }).catch(error => toastifyError(error))
        }, 
        
    getAllCorrespodences() {

      const getLdapSettingsOption =  {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }

        return fetch("/api/ldap/", updateOptions(getLdapSettingsOption)).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          }).catch(error => toastifyError(error))
    },
}

export default ldap