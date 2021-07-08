const Role = require('../../repository/Role')
const {OTJSDBEntityNotFoundException} = require('../../Exceptions/OTJSErrors')

describe('Test Role Table', function () {

    beforeEach(async function () {
        const role = await Role.getRole('test')
        if (role == null) {
            await Role.create('test', false, false, false, false, false, false, false, false, false, false,false, false)
        }
    })

    afterEach(async function () {
        const role = await Role.getRole('test')
        if (!(role == null)) {
            await Role.delete('test')
        }
    })

//To run the test : npm test spec/integration/RolesSpec.js
    describe('Testing Role Table', () => {

        it('should get one roles', async () => {
            let schedule = await Role.getRole('admin')
            expect(schedule).not.toBeNull()
        })

        it('should not get one roles', async () => {
            let schedule = await Role.getRole('test other')
            expect(schedule).toBeNull()
        })

        it('should validate creating one roles', async () => {
            let schedule = await Role.getRole('test')
            expect(schedule).not.toBeNull()
            expect(schedule.name).toBe('test')
        })

        it('should update one roles', async () => {
            await Role.update('test', true, false, false, false, false, false, false, false, false, false,false,false)
            let schedule = await Role.getRole('test')
            expect(schedule).not.toBe()
            expect(schedule.import).toBeTruthy()
        })

        it('should delete one roles', async () => {
            await Role.delete('test')
            let schedule = await Role.getRole('test')
            expect(schedule).toBeNull()
        })

        it('should return delete error', async () => {
            try {
                await Role.delete('test unknown')
            } catch (e) {
                expect(typeof e).toEqual(typeof new OTJSDBEntityNotFoundException())
            }
        })

        it('should return update error', async () => {
            try {
                await Role.update('test unknown')
            } catch (e) {
                expect(typeof e).toEqual(typeof new OTJSDBEntityNotFoundException())
            }
        })

    })
});