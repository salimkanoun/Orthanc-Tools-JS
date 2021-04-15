const crypto = require('crypto')

const algo = 'aes-256-cbc'
const ENCRYPTION_KEY = 'abdcefrt98i8i8i0i6r4t4fc7hz8j56a' //hard coded for tests to replace by process.env.HASH_KEY (defined while installing with generateRandomString(16)?)
const IV_LENGTH = 16

function encryptText(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(algo, Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptText(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algo, Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf8');
}

function compareText(text,hashText){
  var res = false
  let decryptedText = this.decryptText(hashText)
  if(decryptedText==text){
    res = true
  }
  return res
}

function generateRandomString(size) {
    return crypto.randomBytes(size).toString('hex') //return lenght * 2 string in hexadecimal
}

function hash(password,saltRounds){
  var salt = this.generateRandomString(saltRounds)
  var hash =crypto.pbkdf2Sync(password, salt,  
    1000, 64, `sha256`).toString(`hex`); 
  return salt.slice(0,16)+hash+salt.slice(16,32)
}

function compare(plainPassword,password){
  var salt = password.slice(0,16)+password.slice(144,160)
  var hashPassword = crypto.pbkdf2Sync(plainPassword, salt,  
    1000, 64, `sha256`).toString(`hex`);
  if(hashPassword==password.slice(16,144)){
    return true
  }
  else {
    return false
  }
}

//function to generate an hash key ?
module.exports = {encryptText, decryptText, compareText, generateRandomString,hash,compare}