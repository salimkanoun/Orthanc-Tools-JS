import { toastifyError, toastifySuccess } from './toastify'
import updateOptions from '../authorizedOption'

const role = {


    getRoles(){
        const getRolesOptions = {
            method: 'GET', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch('/api/roles', updateOptions(getRolesOptions)).then((answer) => {
            if (!answer.ok) { throw answer }
                return answer.json()
            }).catch(error => {
                toastifyError(error)
            })
    },

    getPermission(name){
        const getPermissionOptions = {
            method: 'GET', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch('/api/roles/' + name, updateOptions(getPermissionOptions)).then((answer) => {
            if (!answer.ok) { throw answer }
                return answer.json()
            }).catch(error => {
                console.log(error)
                toastifyError(error)
            })
    },

    createRole(payload){
        const createRoleOptions = {
            method: 'POST', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(payload)
        }

        return fetch('/api/roles', updateOptions(createRoleOptions)).then((answer) => {
                if (!answer.ok) { throw answer }
                toastifySuccess('Role created with success')
                return answer.json()
            }).catch(error => {
                toastifyError('error')
            })
    },

    modifyRole(payload){
        const modifyRoleOptions = {
            method: 'PUT', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(payload)
        }

        return fetch('/api/roles', updateOptions(modifyRoleOptions)).then((answer) => {
            if (!answer.ok) { throw answer }
            toastifySuccess('Role have been motified with success')
                return answer.json()
            }).catch(error => {
                console.log(error)
                toastifyError(error)
            })
    }, 
    
    deleteRole(name){
        const deleteRoleOptions = {
            method: 'DELETE', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify([name])
        }

        return fetch('/api/roles', updateOptions(deleteRoleOptions)).then((answer) => {
                if (!answer.ok) { throw answer }
                toastifySuccess('Role deleted with success')
                return answer.json()
            }).catch(error => {
                toastifyError(error)
            })
    }

}

export default role