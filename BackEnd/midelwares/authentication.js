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
    res.sendStatus(401).send('No token') // if there isn't any token
    console.log(err)
    throw 'No token' 
  }

  try { 
    return jwt.verify(token, process.env.TOKEN_SECRET) 
  } 
  catch(err) {
    res.sendStatus(403).send('Invalid token')//if incorrect token
    console.log(err)
    throw 'Invalid token'
  }
}

const userAuthMidelware = function (req, res, next) {
  
  let decoded;

  try {
    decoded = decode(req, res);
  }
  catch(err) { return }

  next() // pass the execution off to whatever request the client intended;
}

const userAdminMidelware = async function (req, res, next) {
  
  let decoded;

  try {
    decoded = decode(req, res);
  }
  catch(err) { return }

  if(decoded.admin) {
    next() // pass the execution off to whatever request the client intended
  } else {
    res.status(401).send('Not admin');
  }
}

const uploadMidelware = async function (req, res, next) {
  
  let decoded;

  try {
    decoded = decode(req, res);
  }
  catch(err) { return }

  if(decoded.upload) {
    next() // pass the execution off to whatever request the client intended
  } else {
    res.status(401).send('Not allowed to upload');
  }
}

const contentMidelware = async function (req, res, next) {
  
  let decoded;

  try {
    decoded = decode(req, res);
  }
  catch(err) { return }

  if(decoded.content) {
    next() // pass the execution off to whatever request the client intended
  } else {
    res.status(401).send('Not allowed to content');
  }
}

const anonMidelware = async function (req, res, next) {
  
  let decoded;

  try {
    decoded = decode(req, res);
  }
  catch(err) { return }

  if(decoded.anon) {
    next() // pass the execution off to whatever request the client intended
  } else {
    res.status(401).send('Not allowed to anonymize');
  }
}

const exportLocalMidelware = async function (req, res, next) {
  
  let decoded;

  try {
    decoded = decode(req, res);
  }
  catch(err) { return }

  if(decoded.export_local) {
    next() // pass the execution off to whatever request the client intended
  } else {
    res.status(401).send('Not allowed to export local');
  }
}

const exportExternMidelware = async function (req, res, next) {
  
  let decoded;

  try {
    decoded = decode(req, res);
  }
  catch(err) { return }

  if(decoded.export_extern) {
    next() // pass the execution off to whatever request the client intended
  } else {
    res.status(401).send('Not allowed to export extern');
  }
}

const queryMidelware = async function (req, res, next) {
  
  let decoded;

  try {
    decoded = decode(req, res);
  }
  catch(err) { return }

  if(decoded.query) {
    next() // pass the execution off to whatever request the client intended
  } else {
    res.status(401).send('Not allowed to query');
  }
}

const autoQueryMidelware = async function (req, res, next) {
  
  let decoded;

  try {
    decoded = decode(req, res);
  }
  catch(err) { return }

  if(decoded.auto_query) {
    next() // pass the execution off to whatever request the client intended
  } else {
    res.status(401).send('Not allowed to autoQuery');
  }
}

const deleteMidelware = async function (req, res, next) {
  
  let decoded;

  try {
    decoded = decode(req, res);
  }
  catch(err) { return }

  if(decoded.delete) {
    next() // pass the execution off to whatever request the client intended
  } else {
    res.status(401).send('Not allowed to delet');
  }
}

const modifyMidelware = async function (req, res, next) {
  
  let decoded;

  try {
    decoded = decode(req, res);
  }
  catch(err) { return }

  if(decoded.modify) {
    next() // pass the execution off to whatever request the client intended
  } else {
    res.status(401).send('Not allowed to modify');
  }
}

module.exports = { userAuthMidelware, userAdminMidelware, uploadMidelware, contentMidelware, anonMidelware, exportLocalMidelware,
  exportExternMidelware, queryMidelware, autoQueryMidelware, deleteMidelware, modifyMidelware}    