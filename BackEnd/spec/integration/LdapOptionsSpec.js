const LdapOption = require('../../repository/LdapOption')

describe('Testing LdapOptions Table',()=>{
  it('should get one LdapOptions row',async()=>{
    let schedule = await LdapOption.getOneLdap()
    expect(schedule).not.toBeNull()
    expect(schedule.dataValues.id).toEqual(1)
    expect(schedule.dataValues.TypeGroup).toBe('ad')
  })
})