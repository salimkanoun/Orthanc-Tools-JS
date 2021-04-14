const crypto = require('./cryptoAdapter')

describe('Testing Crypto Adapter',()=>{
  it('should encrypt and decrypt admin with 2 different encryption',()=>{
    var encrypted = crypto.encryptPassword('admin')
    var decrypted = crypto.decryptPassword(encrypted)
    var reen = crypto.encryptPassword(decrypted)
    var rede = crypto.decryptPassword(reen)

    console.log(encrypted)
    console.log(decrypted)
    console.log(reen)
    console.log(rede)
    
    expect(decrypted).toEqual('admin')
    expect(encrypted).not.toEqual(reen)
    expect(decrypted).toEqual(rede)
  })
})