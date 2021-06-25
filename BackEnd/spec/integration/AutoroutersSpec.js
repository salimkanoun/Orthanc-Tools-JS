const Autorouter = require('../../repository/Autorouter')
const {OTJSDBEntityNotFoundException} = require('../../Exceptions/OTJSErrors')

//npm test spec/integration/AutoroutersSpec.js
describe('Test Autorouters Table', () => {
  beforeEach(async () => {
    let autorouter = await Autorouter.getOneByName('test')
    if(!autorouter) await Autorouter.create('test',"ON",[{value1:'t',operator:'in',value2:'test'}],"New Studies",['aet'])
  })

  afterEach(async () => {
    let autorouter = await Autorouter.getOneByName('test')
    if(autorouter) await Autorouter.delete(autorouter.id)
  })

  it('should get one Autorouter by name and confirm his creation',async () => { //cannot test by id or need to reload the db at the beginning of every table test
    let autorouter = await Autorouter.getOneByName('test')

    expect(autorouter).not.toBeNull()
    expect(autorouter.name).toBe('test')
    expect(autorouter.condition).toBe("ON")
    expect(autorouter.rules).toEqual([{value1:'t',operator:'in',value2:'test'}])
    expect(autorouter.target).toBe("New Studies")
    expect(autorouter.destination).toEqual(['aet'])
    expect(autorouter.running).toBeFalse()
  })

  it('should get all Autorouter', async () => {
    let autorouters = await Autorouter.getAll()

    expect(autorouters).not.toBeNull()
    expect(autorouters.length).toBe(1)
    expect(autorouters[0].name).toBe('test')
  })

  it('should modify one Autorouter', async () => {
    let autorouter = await Autorouter.getOneByName('test')
    await Autorouter.modify(autorouter.id,null,null,null,"New series",null,null)

    autorouter = await Autorouter.getOneByName('test')
    expect(autorouter.target).toBe("New series")
  })

  it('should delete one Autorouter', async () => {
    let autorouter = await Autorouter.getOneByName('test')
    await Autorouter.delete(autorouter.id)

    autorouter= await Autorouter.getOneByName('test')
    expect(autorouter).toBeNull()
  })

  it('should throw an exception when modifying', async () => {
    try{
      await Autorouter.modify(-12)
    }catch(e){
      expect(e).toBeInstanceOf(OTJSDBEntityNotFoundException)
    }
  })

  it('should throw an exception when deleting', async () => {
    try{
      await Autorouter.delete(-12)
    }catch(e){
      expect(e).toBeInstanceOf(OTJSDBEntityNotFoundException)
    }
  })
})