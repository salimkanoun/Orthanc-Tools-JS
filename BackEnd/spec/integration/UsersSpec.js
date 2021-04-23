const User = require('../../repository/User')
const {OTJSDBEntityNotFoundException} = require('../../Exceptions/OTJSErrors')

//to run test : npm test spec/integration/UsersSpec.js

describe('Testing User Table', function () {


    beforeEach(async function () {


        let user = await User.getUser('test')
        if (user == null) {
            await User.create('test', 'test', 'test', 'test', 'test', 'user', false)
        }
    })
    afterEach(async function () {
        let user = await User.getUser('test')
        if (!(user == null)) {
            await User.delete('test')
        }
    })

    function containsUser(userTab, search) {

        let r = false
        for (var i = 0; i < userTab.length; i++) {
            if (userTab[i].dataValues.username == search) {
                r = true
                break
            }
        }
        return r
    }

    describe('Testing Users Table', () => {
        it('should return the test user and confirm that he was created on beforeEach', async () => {
            const user = await User.getUser('test')
            expect(user).not.toBeNull()
            expect(user.username).toBe('test')
            expect(user.role).toBe('user')
            expect(user.super_admin).toBeFalsy()

            const undefined_user = await User.getUser('undefined user test')
            expect(undefined_user).toBeNull()
        })

        it('should return all the users', async () => {
            const user = await User.getAllUser()
            expect(user).not.toBeNull()
            expect(Array.isArray(user)).toBeTruthy()
            expect(user.length).toEqual(2)

            let res = containsUser(user, 'test')
            expect(res).toBeTruthy()
        })

        it('should return and count all the super users (at least one with admin)', async () => {
            const user = await User.findAndCountAllSuperUser()
            console.log(user.rows[0].dataValues.username)
            expect(user).not.toBeNull()
            expect(user.count).toEqual(1)

            let res = containsUser(user.rows, 'admin')
            expect(res).toBeTruthy()
        })

        it('should delete a test user', async () => {
            await User.delete('test')
            let user = await User.getUser('test')
            expect(user).toBeNull()
        })

        it('should raise an error for deleting an unknow user', async () => {
            try {
                await User.delete('test unknow user')
            } catch (e) {
                expect(typeof e).toBe(typeof new OTJSDBEntityNotFoundException)
            }
        })
    })

});
