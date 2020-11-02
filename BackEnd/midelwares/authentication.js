const jwt = require("jsonwebtoken")

function getToken (req) {
  const JWT = req.cookies.tokenOrthancJs
    if (!JWT) {
      throw "No token"
    }

  return JWT
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

  try {
    decode(req, res);
  }
  catch(err) { return }

  next() // pass the execution off to whatever request the client intended;
}

const isCurrentUserOrAdminMidelWare = function (req, res, next){

  let decoded;

  try {
    decoded = decode(req, res);
  }
  catch(err) { return }

  if(decoded.admin || decoded.username === req.params.username) {
    next() // pass the execution off to whatever request the client intended
  } else {
    res.status(401).send('Unauthorized');
  }

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

const importMidelware = async function (req, res, next) {
  
  let decoded;

  try {
    decoded = decode(req, res);
  }
  catch(err) { return }

  if(decoded.import) {
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

module.exports = { userAuthMidelware, userAdminMidelware, importMidelware, contentMidelware, anonMidelware, exportLocalMidelware,
  exportExternMidelware, queryMidelware, autoQueryMidelware, deleteMidelware, modifyMidelware, isCurrentUserOrAdminMidelWare}    