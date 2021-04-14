const crypto = require('./cryptoAdapter')

describe('Testing Crypto Adapter',()=>{
  it('should encrypt and decrypt admin with 2 different encryption',()=>{
    var encrypted = crypto.encryptText('admin')
    var decrypted = crypto.decryptText(encrypted)
    var reen = crypto.encryptText(decrypted)
    var rede = crypto.decryptText(reen)

    console.log(encrypted)
    console.log(decrypted)
    console.log(reen)
    console.log(rede)
    
    expect(decrypted).toEqual('admin')
    expect(encrypted).not.toEqual(reen)
    expect(decrypted).toEqual(rede)
  })
})