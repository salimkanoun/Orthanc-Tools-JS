const RoleLabelRepo = require('../repository/RoleLabel.js')
const {OTJSConflictException} = require('../Exceptions/OTJSErrors')

class RoleLabel {
    /**
     * Create a RoleLabel
     * @param {String} role_name name of the role
     * @param {String} label_name name of the label
     * @returns 
     */
    static async createRoleLabel(role_name, label_name) {
        const RoleLabel = await RoleLabelRepo.getRoleLabel(role_name, label_name)


        if (RoleLabel) {
            throw new OTJSConflictException('This association RoleLabel already exist');
        }

        return RoleLabelRepo.create(role_name, label_name)
    }

    /**
     * RoleLabel to delete
     * @param {String} role_name name of the role
     * @param {String} label_name name of the label
     * @returns 
     */
    static async deleteRoleLabel(role_name, label_name) {
        return RoleLabelRepo.delete(role_name, label_name)
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
     * @param {String} label_name name of the label
     * @returns 
     */
    static async getRolesFromLabel(label_name) {
        return RoleLabelRepo.getRolesByLabel(label_name)
    }
}

module.exports = RoleLabel
