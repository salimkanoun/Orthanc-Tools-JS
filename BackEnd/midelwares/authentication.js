const jwt = require("jsonwebtoken")
const { OTJSForbiddenException } = require("../Exceptions/OTJSErrors")
const Task = require("../model/Task")


const userAuthMidelware = function (req, res, next) {
  if (process.env.NODE_ENV == 'test') {
    next()
  }
  else {
    try {
      let authorizationHeaders = req.headers['authorization']
      const token = authorizationHeaders && authorizationHeaders.split(' ')[1]
      let payload = jwt.verify(token, process.env.TOKEN_SECRET)
      req.roles = payload.roles
      req.username = payload.username
      next()
    } catch (err) {
      console.log(err)
      res.sendStatus(401);
      return
    }
  }


}

const isCurrentUserOrAdminMidelWare = function (req, res, next) {
  if (process.env.NODE_ENV == 'test') {
    next()
  }
  else if (req.roles.admin || req.username === req.params.username) {
    next()
  } else {
    res.sendStatus(403);
  }

}

const userAdminMidelware = async function (req, res, next) {
  if (process.env.NODE_ENV == 'test') {
    next()
  }
  else if (req.roles.admin) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const importMidelware = async function (req, res, next) {
  if (process.env.NODE_ENV == 'test') {
    next()
  }
  else if (req.roles.import) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const contentMidelware = async function (req, res, next) {
  if (process.env.NODE_ENV == 'test') {
    next()
  } else if (req.roles.content) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const anonMidelware = async function (req, res, next) {
  if (process.env.NODE_ENV == 'test') {
    next()
  }
  else if (req.roles.anon) {
    next()
  } else {
    res.sendStatus(403);
  }

}

const exportLocalMidelware = async function (req, res, next) {
  if (process.env.NODE_ENV == 'test') {
    next()
  }
  else if (req.roles.exportLocal) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const exportRemoteMidelware = async function (req, res, next) {
  if (process.env.NODE_ENV == 'test') {
    next()
  }
  else if (req.roles.exportRemote) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const queryMidelware = async function (req, res, next) {
  if (process.env.NODE_ENV == 'test') {
    next()
  }
  else if (req.roles.query) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const autoQueryMidelware = async function (req, res, next) {
  if (process.env.NODE_ENV == 'test') {
    next()
  }
  else if (req.roles.autoQuery) {
    next()
  } else {
    res.sendStatus(403);
  }

}

const deleteMidelware = async function (req, res, next) {
  if (process.env.NODE_ENV == 'test') {
    next()
  }
  else if (req.roles.delete) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const modifyMidelware = async function (req, res, next) {
  if (process.env.NODE_ENV == 'test') {
    next()
  }
  else if (req.roles.modify) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const cdBurnerMidelware = async function (req, res, next) {
  if (process.env.NODE_ENV == 'test') {
    next()
  }
  else if (req.roles.cdBurner) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const autoroutingMidelware = async function (req, res, next) {
  if (process.env.NODE_ENV == 'test') {
    next()
  }
  else if (req.roles.autorouting) {
    next()
  } else {
    res.sendStatus(403);
  }
}

const ownTaskOrIsAdminMidelware = async function (req, res, next) {
  if (process.env.NODE_ENV == 'test') {
    next()
  }
  else {
    let task = await Task.getTask(req.params.id);
    if (task.creator !== req.username && !req.roles.admin) throw new OTJSForbiddenException("Task not owned");
    next();
  }
}

const roleAccessLabelMidelware = async function (req, res, next) {
  if (process.env.NODE_ENV === 'test') {
    next()
  }
  else {
    const RoleLabel = require('../model/RoleLabel')
    const role_label = await RoleLabel.getLabelsFromRoleName(req.roles.name)
    let access = false

    for (var i = 0; i < role_label.length; i++) {
      if (req.params.name === role_label[i].label_name) {
        access = true
        break
      }
    }

    if (access) {
      next()
    } else {
      userAdminMidelware(req, res, next)
    }
  }
}


module.exports = {
  userAuthMidelware, userAdminMidelware, importMidelware, contentMidelware, anonMidelware, exportLocalMidelware,
  exportRemoteMidelware, queryMidelware, autoQueryMidelware, deleteMidelware, modifyMidelware, cdBurnerMidelware, isCurrentUserOrAdminMidelWare,
  ownTaskOrIsAdminMidelware, roleAccessLabelMidelware, autoroutingMidelware
}    