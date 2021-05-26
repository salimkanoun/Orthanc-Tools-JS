const db = require('../database/models')
const {OTJSDBEntityNotFoundException} = require('../Exceptions/OTJSErrors')

class RoleLabel {
    static getRoleLabel(role_name, label_name) {
        return db.RoleLabel.findOne({
            where: {
                role_name: role_name,
                label_name: label_name
            }
        })
    }

    static getLabelsByRole(role_name) {
        return db.RoleLabel.findAll({
            where: {
                role_name: role_name
            },attributes:['label_name']
        })
    }

    static getRolesByLabel(label_name) {
        return db.RoleLabel.findAll({
            where: {
                label_name
            }
        })
    }

    static create(role_name, label_name) {
        return db.RoleLabel.create({
            role_name: role_name,
            label_name: label_name
        })
    }

    static delete(role_name, label_name) {
        const user_label = RoleLabel.getRoleLabel(role_name, label_name)
        if (user_label == null) {
            throw new OTJSDBEntityNotFoundException('This RoleLabel doesn\'t exist')
        }

        return db.RoleLabel.destroy({
            where: {
                role_name: role_name,
                label_name: label_name
            }
        })
    }

    static getAllRoleLabel() {
        return db.RoleLabel.findAll()
    }
}

module.exports = RoleLabel