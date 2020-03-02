const request = require('request-promise-native')
const Options = require('./Options')

class ReverseProxy {

      getOrthancAddress () {
        let orthancSettings = Options.getOrthancConnexionSettings()
        this.address = orthancSettings['OrthancAdress']
        this.port = orthancSettings['OrthancPort']
        this.username = orthancSettings['OrthancUsername']
        this.password = orthancSettings['OrthancPassword']

        return this.address+ ':' +this.port
      }

      getOrthancApis (api , res) {
        request.get(this.getOrthancAddress() + api, {
            auth: {
                user: this.username,
                password: this.password
            }
        }).on('response', function (response) {
            if (response.statusCode === 200) {
                response.pipe(res)
            }else{
                res.status(response.statusCode).send(response.statusMessage);
            }
        }).catch((error) => {
            console.log(error)
            res.status(error.statusCode).send(error.statusMessage);
        } )
    }
}

function getOrthancApis ( api , res ) {
    if(ReverseProxy.instance == undefined){
        ReverseProxy.instance = new ReverseProxy()
    }

    ReverseProxy.instance.getOrthancApis(api, res)

}

module.exports = {getOrthancApis}