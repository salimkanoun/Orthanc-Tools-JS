const role = {

    getRoles() {
        const getRolesOptions = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            }
        }

        return fetch('/api/roles', getRolesOptions).then((answer) => {
            if (!answer.ok) { throw answer }
            return answer.json()
        }).catch(error => {
            throw error
        })
    },

    getPermission(name) {
        const getPermissionOptions = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            }
        }

        return fetch('/api/roles/' + name, getPermissionOptions).then((answer) => {
            if (!answer.ok) { throw answer }
            return answer.json()
        })
    },

    createRole(payload) {

        const createRoleOptions = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(payload)
        }

        return fetch('/api/roles', createRoleOptions).then((answer) => {
            if (!answer.ok) { throw answer }
            return true
        })
    },

    modifyRole(payload) {
        const modifyRoleOptions = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(payload)
        }

        return fetch('/api/roles', modifyRoleOptions).then((answer) => {
            if (!answer.ok) { throw answer }
            return true
        })
    },

    deleteRole(name) {
        const deleteRoleOptions = {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify([name])
        }

        return fetch('/api/roles', deleteRoleOptions).then((answer) => {
            if (!answer.ok) { throw answer }
            return true
        })
    }

}

export default role