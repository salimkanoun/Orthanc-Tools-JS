const crypto = require('crypto')

const algo = 'aes-256-cbc'
const ENCRYPTION_KEY = 'abdcefrt98i8i8i0i6r4t4fc7hz8j56a' //too replace by process.env.HASH_KEY
const IV_LENGTH = 16

function encryptPassword(password){
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(algo, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(password);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptPassword(hashPassword){
  let textParts = hashPassword.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(algo, Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
 
  decrypted = Buffer.concat([decrypted, decipher.final()]);
 
  return decrypted.toString('utf8');
}

function comparePassword(password,hashPassword){
  var res = false
  let decryptedPassword = this.decryptPassword(hashPassword)
  if(decryptedPassword==password){
    res = true
  }
  return res
}

function generateRandomString(size){
  return crypto.randomBytes(size).toString('hex')
}

//function to generate an hash key ?
module.exports = { encryptPassword, decryptPassword, comparePassword, generateRandomString }