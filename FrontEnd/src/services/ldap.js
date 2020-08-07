import { toastifyError } from './toastify'
import updateOptions from '../authorizedOption'

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

        return fetch("/api/ldapSettings/", updateOptions(setLdapSettingsOption) ).then((answer) => {
            if (!answer.ok) { throw answer }
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

        return fetch("/api/ldapSettings/", updateOptions(getLdapSettingsOption)).then((answer) => {
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

        return fetch("/api/ldapTestCo/", updateOptions(testLdapSettingsOption)).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          }).catch(error => toastifyError(error))
    },

    createCorrespondence(Correspondence){

        const createCorrespondenceOption = {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Correspondence)
        };
  
          return fetch("/api/ldap/", updateOptions(createCorrespondenceOption) ).then((answer) => {
              if (!answer.ok) { throw answer }
              return (answer.json())
            }).catch(error => toastifyError(error))
      },
      
    deleteCorrespondence(Correspondence){

        const deleteCorrespondenceOption = {
            method: 'DELETE',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(Correspondence)
        };
    
            return fetch("/api/ldap/", updateOptions(deleteCorrespondenceOption) ).then((answer) => {
                if (!answer.ok) { throw answer }
                    //toastifySuccess('Correspondence deleted with success')
                    return (answer.json())
            }).catch(error => toastifyError(error))
        }, 
        
    getAllCorrespodences() {

      const getAllCorrespodencesOption =  {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }

        return fetch("/api/ldap/", updateOptions(getAllCorrespodencesOption)).then((answer) => {
            if (!answer.ok) { throw answer }
            return (answer.json())
          }).catch(error => toastifyError(error))
    },
}

export default ldap