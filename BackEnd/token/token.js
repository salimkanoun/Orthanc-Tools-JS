//access SECRET_TOKEN
    const dotenv = require("dotenv");

    // get config vars
    dotenv.config();

    // access config var
    process.env.TOKEN_SECRET;

function generateToken(payload) {

    // expires after one hour
        return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '3600' });
  }

  module.exports = { generateToken }
