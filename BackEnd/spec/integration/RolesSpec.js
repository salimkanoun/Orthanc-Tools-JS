const Role = require('../../repository/Role')
const {OTJSDBEntityNotFoundException} = require('../../Exceptions/OTJSErrors')

beforeEach(async function(){
    const role = await Role.getRole('test')
    if(role==null){
        const createtest = await Role.create('test',false,false,false,false,false,false,false,false,false,false,false)
    }
})

afterEach(async function(){
    const role = await Role.getRole('test')
    if(!(role==null)){
        const deletetest = await Role.delete('test')
    }
})

//To run the test : npm test spec/integration/RolesSpec.js
describe('Testing Role Table', () =>{

    it('should get one roles', async () => {
        let schedule = await Role.getRole('admin')
        expect(schedule==null).toBe(false)
        schedule = await Role.getRole('test other')
        expect(schedule==null).toBe(true)
    })

    it('should validate creating one roles',async()=>{
        let schedule = await Role.getRole('test')
        expect(schedule==null).toBe(false)
        expect(schedule.name).toBe('test')
    })

    it('should update one roles',async()=>{
        const role = await Role.update('test',true,false,false,false,false,false,false,false,false,false,false)
        let schedule = await Role.getRole('test')
        expect(schedule==null).toBe(false)
        expect(schedule.import).toBe(true)
    })

    it('should delete one roles',async()=>{
        const role = await Role.delete('test')
        let schedule = await Role.getRole('test')
        expect(schedule==null).toBe(true)
    })

    it('should return delete error',async()=>{
        try{
            await Role.delete('test unknown')
        }catch(e){
            expect(typeof e).toEqual(typeof new OTJSDBEntityNotFoundException())
        }
    })

    it('should return update error',async()=>{
        try{
            await Role.update('test unknown')
        }catch(e){
            expect(typeof e).toEqual(typeof new OTJSDBEntityNotFoundException())
        }
    })

})