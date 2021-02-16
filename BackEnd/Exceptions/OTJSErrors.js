const OTJSError =  require('./OTJSError')

class OTJSBadRequestException extends OTJSError {

    constructor(message){
        super(message, 400)
    }

}

class OTJSConflictException extends OTJSError {

    constructor(message){
        super(message, 209)
    }

}

class OTJSForbiddenException extends OTJSError {

    constructor(message){
        super(message, 403)
    }

}

class OTJSUnauthorizedException extends OTJSError {

    constructor(message){
        super(message, 401)
    }

}

class OTJSNotFoundException extends OTJSError {

    constructor(message){
        super(message, 404)
    }

}

class OTJSInternalServerError extends OTJSError {

    constructor(message){
        super(message, 500)
    }

}

module.exports = {OTJSBadRequestException, OTJSForbiddenException, OTJSUnauthorizedException, OTJSNotFoundException, OTJSConflictException, OTJSInternalServerError}