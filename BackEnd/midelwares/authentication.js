const jwt = require("jsonwebtoken")
const { OTJSForbiddenException } = require("../Exceptions/OTJSErrors")
const Task = require("../model/Task")

const userAuthMidelware = function (req, res, next) {

  try {
    let token = req.cookies.tokenOrthancJs
    let payload = jwt.verify(token, process.env.TOKEN_SECRET)
    req.roles = payload
    next()
  } catch (err) {
    res.sendStatus(401);
    return
  }

}

const isCurrentUserOrAdminMidelWare = function (req, res, next) {

  if (req.roles.admin || req.roles.username === req.params.username) {
    next()
  } else {
    res.sendStatus(403);
  }

}

const userAdminMidelware = async function (req, res, next) {
  if (req.roles.admin) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const importMidelware = async function (req, res, next) {

  if (req.roles.import) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const contentMidelware = async function (req, res, next) {
  if (req.roles.content) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const anonMidelware = async function (req, res, next) {

  if (req.roles.anon) {
    next()
  } else {
    res.sendStatus(403);
  }

}

const exportLocalMidelware = async function (req, res, next) {

  if (req.roles.export_local) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const exportExternMidelware = async function (req, res, next) {

  if (req.roles.export_extern) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const queryMidelware = async function (req, res, next) {

  if (req.roles.query) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const autoQueryMidelware = async function (req, res, next) {

  if (req.roles.auto_query) {
    next()
  } else {
    res.sendStatus(403);
  }

}

const deleteMidelware = async function (req, res, next) {

  if (req.roles.delete) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const modifyMidelware = async function (req, res, next) {

  if (req.roles.modify) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const cdBurnerMidelware = async function (req, res, next) {
  if (req.roles.cd_burner) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const ownTaskOrIsAdminMidelware = async function (req,res,next){
  let task = await Task.getTask(req.params.id);
  if(task.creator !== req.roles.username && !req.roles.admin) throw new OTJSForbiddenException("Task not owned");
  next();
}


module.exports = {
  userAuthMidelware, userAdminMidelware, importMidelware, contentMidelware, anonMidelware, exportLocalMidelware,
  exportExternMidelware, queryMidelware, autoQueryMidelware, deleteMidelware, modifyMidelware, cdBurnerMidelware, isCurrentUserOrAdminMidelWare,
  ownTaskOrIsAdminMidelware
}    