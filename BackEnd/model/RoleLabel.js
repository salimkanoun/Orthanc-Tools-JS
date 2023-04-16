const RoleLabelRepo = require('../repository/RoleLabel.js')
const {OTJSConflictException} = require('../Exceptions/OTJSErrors')

class RoleLabel {
    /**
     * Create a RoleLabel
     * @param {String} roleName name of the role
     * @param {String} labelName name of the label
     * @returns 
     */
    static async createRoleLabel(roleName, labelName) {
        const RoleLabel = await RoleLabelRepo.getRoleLabel(roleName, labelName)


        if (RoleLabel) {
            throw new OTJSConflictException('This association RoleLabel already exist');
        }

        return RoleLabelRepo.create(roleName, labelName)
    }

    /**
     * RoleLabel to delete
     * @param {String} roleName name of the role
     * @param {String} labelName name of the label
     * @returns 
     */
    static async deleteRoleLabel(roleName, labelName) {
        return RoleLabelRepo.delete(roleName, labelName)
    }

    /**
     * Get all RoleLabels
     * @returns 
     */
    static async getAll() {
        return RoleLabelRepo.getAllRoleLabel()
    }

    /**
     * Get all labels linked to one role
     * @param {String} role_name name of the role
     * @returns 
     */
    static async getLabelsFromRoleName(role_name) {
        return RoleLabelRepo.getLabelsByRole(role_name)
    }

    /**
     * Get all roles linked to one label
     * @param {String} labelName name of the label
     * @returns 
     */
    static async getRolesFromLabel(labelName) {
        return RoleLabelRepo.getRolesByLabel(labelName)
    }
}

module.exports = RoleLabel
