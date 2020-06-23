const jwt = require("jsonwebtoken")

function getToken (req) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) throw "No token"
  return token
}

function decode (req, res) {
  let token;

  try { 
    token = getToken(req);
  }
  catch(err) {
    console.log(err)
    throw res.sendStatus(401) // if there isn't any token
  }

  try { 
    return jwt.verify(token, process.env.TOKEN_SECRET) 
  } 
  catch(err) {
    console.log(err)
    throw res.sendStatus(403)//if incorrect token
  }
}

const userAuthMidelware = function (req, res, next) {
  
  try {
    decoded = decode(req, res);
  }
  catch(err) {
    return err;
  }

  next() // pass the execution off to whatever request the client intended;
}

const userAdminMidelware = async function (req, res, next) {
  
  try {
    decoded = decode(req, res);
  }
  catch(err) {
    return err;
  }

  if(decoded.admin) {
    next() // pass the execution off to whatever request the client intended
  }
}

const uploadMidelware = async function (req, res, next) {
  
  try {
    decoded = decode(req, res);
  }
  catch(err) {
    return err;
  }

  if(decoded.upload) {
    next() // pass the execution off to whatever request the client intended
  }
}

const contentMidelware = async function (req, res, next) {
  
  try {
    decoded = decode(req, res);
  }
  catch(err) {
    return err;
  }

  if(decoded.content) {
    next() // pass the execution off to whatever request the client intended
  }
}

const anonMidelware = async function (req, res, next) {
  
  try {
    decoded = decode(req, res);
  }
  catch(err) {
    return err;
  }

  if(decoded.anon) {
    next() // pass the execution off to whatever request the client intended
  }
}

const exportLocalMidelware = async function (req, res, next) {
  
  try {
    decoded = decode(req, res);
  }
  catch(err) {
    return err;
  }

  if(decoded.export_local) {
    next() // pass the execution off to whatever request the client intended
  }
}

const exportExternMidelware = async function (req, res, next) {
  
  try {
    decoded = decode(req, res);
  }
  catch(err) {
    return err;
  }

  if(decoded.export_extern) {
    next() // pass the execution off to whatever request the client intended
  }
}

const queryMidelware = async function (req, res, next) {
  
  try {
    decoded = decode(req, res);
  }
  catch(err) {
    return err;
  }

  if(decoded.query) {
    next() // pass the execution off to whatever request the client intended
  }
}

const autoQueryMidelware = async function (req, res, next) {
  
  try {
    decoded = decode(req, res);
  }
  catch(err) {
    return err;
  }

  if(decoded.auto_query) {
    next() // pass the execution off to whatever request the client intended
  }
}

const deleteMidelware = async function (req, res, next) {
  
  try {
    decoded = decode(req, res);
  }
  catch(err) {
    return err;
  }

  if(decoded.delete) {
    next() // pass the execution off to whatever request the client intended
  }
}

module.exports = { userAuthMidelware, userAdminMidelware, uploadMidelware, contentMidelware, anonMidelware, exportLocalMidelware,
  exportExternMidelware, queryMidelware, autoQueryMidelware, deleteMidelware}    