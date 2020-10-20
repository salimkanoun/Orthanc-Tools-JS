const {v4:uuidv4 } = require("uuid")


const uuid  = {
    getUuid : function() {
        return uuidv4()    
    }
}

module.exports = uuid