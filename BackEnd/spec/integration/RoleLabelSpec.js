const RoleLabel = require('../../repository/RoleLabel')
const Label = require('../../repository/Label')
const {OTJSDBEntityNotFoundException} = require('../../Exceptions/OTJSErrors')

//To run the test : npm test spec/integration/RoleLabelSpec.js
describe('Testing RoleLabel Table', function () {


    beforeEach(async function () {
        var l = await Label.getLabel('test_role_label')

        if (l == null) {
            l = await Label.create('test_role_label')
        }
        var rl = await RoleLabel.getRoleLabel('admin', l.label_name)
        if (rl == null) {
            await RoleLabel.create('admin', l.label_name)
        }

    })

    afterEach(async function () {
        var l = await Label.getLabel('test_role_label')
        var rl = await RoleLabel.getRoleLabel('admin', l.label_name)
        if ((!(l == null)) && !(rl == null)) {
            await RoleLabel.delete('admin', l.label_name)
        }
        if (!(l == null)) {
            await Label.delete('test_role_label')
        }
    })


    describe('Testing RoleLabel Table', () => {
        it('should confirm creating a RoleLabel and get a RoleLabel', async () => {
            let schedule = await RoleLabel.getRoleLabel('admin', 'test_role_label')
            expect(schedule).not.toBeNull()
            expect(schedule.role_name).toBe('admin')
            expect(schedule.label_name).toBe('test_role_label')
        })

        it('should not get a RoleLabel', async () => {
            let schedule = await RoleLabel.getRoleLabel('1452265', 'unknow label test')
            expect(schedule).toBeNull()
        })

        it('should delete a RoleLabel', async () => {
            await RoleLabel.delete('admin', 'test_role_label')
            let schedule = await RoleLabel.getRoleLabel('admin', 'test_role_label')
            expect(schedule).toBeNull()
        })

        it('shoudl throw an error when deleting', async () => {
            try {
                await RoleLabel.delete('1234', 'test_role_label unknown')
            } catch (e) {
                expect(e).toBeInstanceOf(OTJSDBEntityNotFoundException)
            }
        })
    })
});