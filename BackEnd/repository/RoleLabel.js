const db = require('../database/models')
const { OTJSDBEntityNotFoundException } = require('../Exceptions/OTJSErrors')

class RoleLabel {
    static getRoleLabel(roleName, labelName) {
        return db.RoleLabel.findOne({
            where: {
                role_name: roleName,
                label_name: labelName
            }
        })
    }

    static getLabelsByRole(roleName) {
        return db.RoleLabel.findAll({
            where: {
                role_name: roleName
            },
            attributes: ['label_name']
        })
    }

    static getRolesByLabel(labelName) {
        return db.RoleLabel.findAll({
            where: {
                label_name: labelName
            }
        })
    }

    static create(role_name, labelName) {
        return db.RoleLabel.create({
            role_name: role_name,
            label_name: labelName
        })
    }

    static delete(roleName, labelName) {
        const user_label = RoleLabel.getRoleLabel(roleName, labelName)
        if (user_label == null) {
            throw new OTJSDBEntityNotFoundException('This RoleLabel doesn\'t exist')
        }

        return db.RoleLabel.destroy({
            where: {
                role_name: roleName,
                label_name: labelName
            }
        })
    }

    static getAllRoleLabel() {
        return db.RoleLabel.findAll()
    }
}

module.exports = RoleLabel