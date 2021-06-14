const rolelabel = {
    /**
     * get all RoleLabels
     * @returns {Array.<JSON>}
     */
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

    /**
     * Get Labels linked to a Role name
     * @param {String} username username of the active
     * @param {String} role_name role to search for
     * @returns {Array.<JSON>}
     */
    getRoleLabels(username,role_name) {
        const getRoleLabelsOptions = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
        }
        return fetch('/api/users/' + username +'/roles/'+role_name+'/labels', getRoleLabelsOptions).then((answer) => {
            if (!answer.ok) {
                throw answer
            }
            return answer.json()
        }).catch(error => {
            throw error
        })
    },

    /**
     * Get Roles linked to a label name
     * @param {String} label_name name of the label to search for
     * @returns {Array.<JSON>}
     */
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

    /**
     * Create a RoleLabel
     * @param {String} username username of the active user
     * @param {String} role_name name of the role to link
     * @param {String} label_name name of the label to link
     * @returns 
     */
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

    /**
     * Delete a RoleLabel
     * @param {String} username username of the active user
     * @param {*} role_name name of the role
     * @param {*} label_name name of the label
     * @returns 
     */
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