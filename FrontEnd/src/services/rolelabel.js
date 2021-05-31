const rolelabel = {
    getRolesLabels() {
        const getRolesLabelsOptions = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            }
        }
        return fetch('/api/users/labels', getRolesLabelsOptions).then((answer) => {
            if (!answer.ok) {
                throw answer
            }
            return answer.json()
        }).catch(error => {
            throw error
        })
    },

    getRoleLabels(username,role_name) {
        const getRoleLabelsOptions = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
        }
        return fetch('/api/users/' + username +'/role/'+role_name+'/labels', getRoleLabelsOptions).then((answer) => {
            if (!answer.ok) {
                throw answer
            }
            return answer.json()
        }).catch(error => {
            throw error
        })
    },

    getLabelRoles(label_name) {
        const getLabelRolesOptions = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            }
        }
        return fetch('/api/users/labels/' + label_name + '/', getLabelRolesOptions).then((answer) => {
            if (!answer.ok) {
                throw answer
            }
            return answer.json()
        }).catch(error => {
            throw error
        })
    },

    createRoleLabel(username,role_name, label_name) {
        const rolename = {
            role_name : role_name
        }
        const createRoleLabelOptions = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(rolename)
        }

        return fetch('/api/users/' + username + '/labels/' + label_name, createRoleLabelOptions).then((answer) => {
            if (!answer.ok) {
                throw answer
            }
            return true
        })

    },

    deleteRoleLabel(username,role_name, label_name) {
        const rolename = {
            role_name : role_name
        }
        const deleteRoleLabelOptions = {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(rolename)
        }

        return fetch('/api/users/' + username + '/labels/' + label_name, deleteRoleLabelOptions).then((answer) => {
            if (!answer.ok) {
                throw answer
            }
            return true
        })
    }
}
export default rolelabel