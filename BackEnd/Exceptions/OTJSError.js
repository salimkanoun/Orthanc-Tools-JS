class OTJSError extends Error {

    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
    }

    getJsonPayload() {
        return {
            errorMessage : this.message
        }
    }

    getStatusCode(){
        return this.statusCode
    }
}

module.exports = OTJSError