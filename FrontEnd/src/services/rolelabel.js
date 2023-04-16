import axios from "axios"

const rolelabel = {
    /**
     * get all RoleLabels
     * @returns {Array.<JSON>}
     */
    getRolesLabels() {
        return axios.get('/api/labels/roles').then((answer) => answer.data
        ).catch(error => {
            throw error
        })
    },

    /**
     * Get Labels linked to a Role name
     * @param {String} username username of the active
     * @param {String} role_name role to search for
     * @returns {Array.<JSON>}
     */
    getRoleLabels(role_name) {
        return axios.get('/api/roles/' + role_name + '/labels').then((answer) => answer.data
        ).catch(error => {
            throw error
        })
    },

    /**
     * Get Roles linked to a label name
     * @param {String} label_name name of the label to search for
     * @returns {Array.<JSON>}
     */
    getLabelRoles(labelName) {
        return axios.get('/api/labels/' + labelName + '/roles').then((answer) => answer.data
        ).catch(error => {
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
    createRoleLabel(roleName, labelName) {
        const rolename = {
            role_name: roleName
        }

        return axios.post('/api/labels/' + labelName + '/roles', rolename).then((answer) =>
            true
        ).catch(error => {
            throw error
        })

    },

    /**
     * Delete a RoleLabel
     * @param {String} username username of the active user
     * @param {*} role_name name of the role
     * @param {*} label_name name of the label
     * @returns 
     */
    deleteRoleLabel(roleName, labelName) {
        const payload = {
            roleName: roleName
        }

        return axios.delete('/api/labels/' + labelName + '/roles', { data: payload }).then(() => true
        ).catch(error => {
            throw error
        })
    }
}

export default rolelabel