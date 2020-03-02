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

      prepareOptions(method, api, data){
        const serverString = this.getOrthancAddress() + api

        let options = null

        if (method === 'GET' || method === 'DELETE') {
            options = {
                method: method,
                url: serverString,
                auth: {
                user: this.username,
                password: this.password
                }
            }
        } else {
            options = {
                method: method,
                url: serverString,
                auth: {
                user: this.username,
                password: this.password
                },
                headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
                },
                body: data
            }
        }

        return options
      }

      getAnswer (api, method, data , res) {
        
        request.get(this.getOrthancAddress() + api, options)
                .on('response', function (response) {
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

function getOrthancApis ( api, res ) {
    if(ReverseProxy.instance == undefined){
        ReverseProxy.instance = new ReverseProxy()
    }
    ReverseProxy.instance.getAnswer('GET', api, undefined , res)
}

function deleteOrthancApis ( api, res ){
    if(ReverseProxy.instance == undefined){
        ReverseProxy.instance = new ReverseProxy()
    }

    ReverseProxy.instance.getAnswer('DELETE', api, undefined, res)

}

module.exports = {getOrthancApis, deleteOrthancApis}