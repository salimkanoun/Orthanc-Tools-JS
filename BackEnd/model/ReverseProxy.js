const { OTJSInternalServerError } = require('../Exceptions/OTJSErrors')
const Options = require('./Options')
const got = require('got')

const ReverseProxy = {

    getOrthancAddress() {
        const orthancSettings = Options.getOrthancConnexionSettings()
        this.address = orthancSettings.orthancAddress
        this.port = orthancSettings.orthancPort
        this.username = orthancSettings.orthancUsername
        this.password = orthancSettings.orthancPassword
        return this.address + ':' + this.port
    },

    makeOptions(method, api, data) {
        const serverString = this.getOrthancAddress() + api

        let options = null

        if (method === 'GET' || method === 'DELETE') {
            options = {
                method: method,
                url: serverString,
                headers: {
                    'Forwarded': 'by=localhost;for=localhost;host=' + process.env.DOMAIN_ADDRESS + '/api;proto=' + process.env.DOMAIN_PROTOCOL
                },
                username: this.username,
                password: this.password,
            }
        } else {
            options = {
                method: method,
                url: serverString,
                username: this.username,
                password: this.password,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        }
        return options
    },

    makeOptionsUpload(method, api, data, plain) {
        const serverString = this.getOrthancAddress() + api

        const options = {
            method: method,
            url: serverString,
            username: this.username,
            password: this.password,
            headers: {
                'Content-Type': plain ? 'text/plain' : 'application/dicom',
                'Content-Length': data.length
            },
            body: data
        }

        return options
    },

    makeOptionsDownload(method, api, data) {
        const serverString = this.getOrthancAddress() + api

        const options = {
            method: method,
            url: serverString,
            username: this.username,
            password: this.password,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': data.length,
                'Accept': 'application/dicom'
            },
            body: (method !== 'GET' ? JSON.stringify(data) : undefined)
        }

        return options
    },

    streamToRes(api, method, data, res) {
        
        return got(this.makeOptions(method, api, data))
            .on('response', function (response) {
                if (response.statusCode === 200) {
                    response.pipe(res)
                } else if (response.statusCode === 401) {
                    res.status(403).send("Bad orthanc credentials")
                } else {
                    res.status(response.statusCode).send(response.statusMessage)
                }
            }).catch((error) => {
                console.error(error)
            })
    },

    streamToResPlainText(api, method, data, res) {
        return got(this.makeOptionsUpload(method, api, data, true))
            .on('response', function (response) {
                if (response.statusCode === 200) {
                    response.pipe(res)
                } else if (response.statusCode === 401) {
                    res.status(403).send("Bad orthanc credentials")
                } else {
                    res.status(response.statusCode).send(response.statusMessage)
                }
            }).catch((error) => {
                console.error(error)
            })
    },

    streamToResUploadDicom(api, method, data, res) {
        return got(this.makeOptionsUpload(method, api, data, false))
            .on('response', function (response) {
                if (response.statusCode === 200) {
                    response.pipe(res)
                } else if (response.statusCode === 401) {
                    res.status(403).send("Bad orthanc credentials")
                } else {
                    res.status(response.statusCode).send(response.statusMessage)
                }
            }).catch((error) => {
                console.error(error)
            })
    },

    streamToFile(api, method, data, streamWriter) {
        return got(this.makeOptions(method, api, data))
            .on('response', function (response) {
                if (response.statusCode === 200) {
                    response.pipe(streamWriter)
                        .on('finish', function () {
                            console.log('Writing Done')
                        })
                }
            }).catch((error) => {
                console.error(error)
            })
    },

    streamToFileWithCallBack(api, method, data, streamWriter, finishCallBack) {
        return got(this.makeOptionsDownload(method, api, data))
            .on('response', function (response) {
                if (response.statusCode === 200) {
                    response.pipe(streamWriter)
                        .on('finish', () => {
                            finishCallBack();
                        });
                }
            })
            .catch((error) => {
                throw new OTJSInternalServerError(error.message);
            })
    },

    getAnswer(api, method, data) {
        return got(this.makeOptions(method, api, data)).then((response) => {
            return JSON.parse(response.body)
        }).catch((error) => {
            throw new OTJSInternalServerError(error.message)
        })
    },

    getAnswerPlainText(api, method, data) {
        return got(this.makeOptions(method, api, data)).then((response) => {
            return response.body
        }).catch((error) => {
            throw new OTJSInternalServerError(error.message)
        })
    }

}

module.exports = ReverseProxy
