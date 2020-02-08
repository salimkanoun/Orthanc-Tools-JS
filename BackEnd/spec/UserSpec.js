const User = require('../model/Users')

describe('Testing User Creation', () =>{

    it('should create user', async ()=> {
       await User.createUser('TestUser', 'password', false);
        
    })
})

describe('Testing User Data', ()=>{

    it('should check user password', async () =>{

        let userObject = new User('TestUser')
        let checkPassword = await userObject.checkPassword('password')
        expect(userObject.username).toBe('TestUser')
        expect(checkPassword).toBe(true)

    })

    it('should delete user', async () => {
        let userObject = new User('TestUser')
        let userEntity = await userObject._getUserEntity()
        await userEntity.destroy()
        let promise = new Promise( (resolve, reject ) => {
            let userObject2 = new User('TestUser')
            userObject2._getUserEntity().then((user) =>{
                resolve (user)
            }).catch( (error )=>{
                reject(error)
            })
        })

        await expectAsync(promise).toBeRejectedWithError('User Not Found');

    })

})
