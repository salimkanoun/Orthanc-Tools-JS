const RoleLabelRepo = require('../repository/RoleLabel.js')
const {OTJSConflictException} = require('../Exceptions/OTJSErrors')

class RoleLabel {
    static async createRoleLabel(role_name, label_name) {
        const RoleLabel = await RoleLabelRepo.getRoleLabel(role_name, label_name)


        if (RoleLabel) {
            throw new OTJSConflictException('This association RoleLabel already exist');
        }

        return RoleLabelRepo.create(role_name, label_name)
    }

    static async deleteRoleLabel(role_name, label_name) {
        return RoleLabelRepo.delete(role_name, label_name)
    }

    static async getAll() {
        return RoleLabelRepo.getAllRoleLabel()
    }

    static async getLabelsFromRoleName(role_name) {
        return RoleLabelRepo.getLabelsByRole(role_name)
    }

    static getRolesFromLabel(label_name) {
        return RoleLabelRepo.getRolesByLabel(label_name)
    }
}

module.exports = RoleLabel
