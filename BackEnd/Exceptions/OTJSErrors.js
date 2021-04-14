const OTJSError = require('./OTJSError')

class OTJSBadRequestException extends OTJSError {

    constructor(message) {
        super(message, 400)
    }

}

class OTJSConflictException extends OTJSError {

    constructor(message) {
        super(message, 409)
    }

}

class OTJSForbiddenException extends OTJSError {

    constructor(message) {
        super(message, 403)
    }

}

class OTJSUnauthorizedException extends OTJSError {

    constructor(message) {
        super(message, 401)
    }

}

class OTJSNotFoundException extends OTJSError {

    constructor(message) {
        super(message, 404)
    }

}

class OTJSInternalServerError extends OTJSError {

    constructor(message) {
        super(message, 500)
    }

}

class OTJSDBEntityNotFoundException extends OTJSError {
    constructor(message) {
        super(message, 404)
    }
}

module.exports = {
    OTJSBadRequestException,
    OTJSDBEntityNotFoundException,
    OTJSForbiddenException,
    OTJSUnauthorizedException,
    OTJSNotFoundException,
    OTJSConflictException,
    OTJSInternalServerError
}