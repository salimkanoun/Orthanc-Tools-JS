
const Option = require('../../repository/Option')

describe('Testing Options Table',()=>{
    it('should get one authentification mode',async()=>{
        let schedule = await Option.getOneAuthenticationMode()
        expect(schedule).not.toBeNull()
        expect(schedule.dataValues.ldap).toBeFalsy()
    })

    it('should give a selected options',async()=>{
        let schedule = await Option.getOptionById(1)
        expect(schedule).not.toBeNull()
    })

    it('should not give an Options',async ()=>{
        let schedule = await Option.getOptionById(14156654) // -> random big id
        expect(schedule).toBeNull()
    })
})

/* TESTING THE MODEL
const Options = require('../../model/Options')
describe('Testing Options', () =>{

    it('should be 22 00 by defaults', async () => {
        let schedule =await Options.getOptions()
        expect(schedule.hour).toBe(22)
        expect(schedule.min).toBe(0)

    })

    it('should set schedule', async ()=> {
        await Options.setScheduleTime(21, 30);
        let schedule =await Options.getOptions()
        expect(schedule.hour).toBe(21)
        expect(schedule.min).toBe(30)
        await Options.setScheduleTime(22, 00);
    })

    it('shoud set orthanc settings', () => {
        Options.setOrthancConnexionSettings('http://localhost', 8042, 'salimTest', 'salim')
        expect(Options.getOrthancConnexionSettings()).toEqual({
            orthancAddress : 'http://localhost',
            orthancPort : 8042,
            orthancUsername : 'salimTest',
            orthancPassword : 'salim'
        })
    })
})*/