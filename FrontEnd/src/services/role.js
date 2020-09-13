import { toastifyError, toastifySuccess } from './toastify'

const role = {


    getRoles(){
        const getRolesOptions = {
            method: 'GET', 
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }

        return fetch('/api/roles', getRolesOptions ).then((answer) => {
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

        return fetch('/api/roles/' + name, getPermissionOptions ).then((answer) => {
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

        return fetch('/api/roles', createRoleOptions ).then((answer) => {
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

        return fetch('/api/roles', modifyRoleOptions ).then((answer) => {
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

        return fetch('/api/roles', deleteRoleOptions ).then((answer) => {
                if (!answer.ok) { throw answer }
                toastifySuccess('Role deleted with success')
                return answer.json()
            }).catch(error => {
                toastifyError(error)
            })
    }

}

export default role