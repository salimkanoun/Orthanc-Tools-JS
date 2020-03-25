const request = require('request-promise-native')
const Options = require('./Options')

const ReverseProxy  = {

      getOrthancAddress () {
        let orthancSettings = Options.getOrthancConnexionSettings()
        this.address = orthancSettings['OrthancAddress']
        this.port = orthancSettings['OrthancPort']
        this.username = orthancSettings['OrthancUsername']
        this.password = orthancSettings['OrthancPassword']
        return this.address+ ':' +this.port
      },

      makeOptions(method, api, data){
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
                body: JSON.stringify(data)
            }
        }

        return options
      },

      makeOptionsUpload(method, api, data){
        const serverString = this.getOrthancAddress() + api

        let options = {
                method: method,
                url: serverString,
                auth: {
                    user: this.username,
                    password: this.password
                },
                headers: {
                'Content-Type': 'application/dicom',
                'Content-Length': data.length
                },
                body: data
            }
        

        return options
      },

    streamToRes (api, method, data , res) {
        request( this.makeOptions(method, api, data) )
                .on('response', function (response) {
                    if (response.statusCode === 200) {
                        response.pipe(res)
                    }else{
                        res.status(response.statusCode).send(response.statusMessage);
                    }
                }).catch((error) => {
                    console.log(error)
                    res.status(500).send(error.statusMessage);
                } )
    },

    streamToResUploadDicom(api, method, data, res){
        request( this.makeOptionsUpload(method, api, data) )
                .on('response', function (response) {
                    if (response.statusCode === 200) {
                        response.pipe(res)
                    }else{
                        res.status(response.statusCode).send(response.statusMessage);
                    }
                }).catch((error) => {
                    console.log(error)
                    res.status(500).send(error.statusMessage);
                } )
    },

    streamToFile(api, method, data, streamWriter){

        request(this.makeOptions(method, api, data))
                .on('response', function (response) {
                    if (response.statusCode === 200) {
                        response.pipe(streamWriter)
                        .on('finish', function () { console.log('Writing Done') })
                    }
                }).catch((error) => {
                    console.log(error)
                } )

    },

    async getAnswer(api, method, data){
        const requestPromise = request(this.makeOptions(method, api, data)).then(function (body) {
            return JSON.parse(body)
        }).catch((error) => { console.log('Error Orthanc communication' + error); return false })
        
        return await requestPromise

    },

    async getAnswerPlainText(api, method, data){
        const requestPromise = request(this.makeOptions(method, api, data)).then(function (body) {
            return body
        }).catch((error) => { console.log('Error Orthanc communication' + error); return false })

        return await requestPromise
    }

}

module.exports = ReverseProxy