import axios from "axios"

const rolelabel = {
    /**
     * get all RoleLabels
     * @returns {Array.<JSON>}
     */
    getRolesLabels() {

        return axios.get('/api/users/labels').then((answer) => answer.data
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
    getRoleLabels(username, role_name) {

        return axios.get('/api/users/' + username + '/roles/' + role_name + '/labels').then((answer) => answer.data
        ).catch(error => {
            throw error
        })
    },

    /**
     * Get Roles linked to a label name
     * @param {String} label_name name of the label to search for
     * @returns {Array.<JSON>}
     */
    getLabelRoles(label_name) {

        return axios.get('/api/users/labels/' + label_name + '/').then((answer) => answer.data
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
    createRoleLabel(username, role_name, label_name) {
        const rolename = {
            role_name: role_name
        }

        return axios.post('/api/users/' + username + '/labels/' + label_name, rolename).then((answer) =>
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
    deleteRoleLabel(username, role_name, label_name) {
        const rolename = {
            role_name: role_name
        }

        return axios.delete('/api/users/' + username + '/labels/' + label_name, rolename).then((answer) => true
        ).catch(error => {
            throw error
        })
    }
}
export default rolelabel