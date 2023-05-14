const { OTJSInternalServerError } = require('../Exceptions/OTJSErrors')
const Options = require('./Options')
const got = require('got')
const http = require('node:http')

const ReverseProxy = {

    getOrthancAddress() {
        const orthancSettings = Options.getOrthancConnexionSettings()
        this.address = orthancSettings.orthancAddress
        this.port = orthancSettings.orthancPort
        this.username = orthancSettings.orthancUsername
        this.password = orthancSettings.orthancPassword
        return this.address + ':' + this.port
    },

    makeOptions2(method, api) {
        const orthancSettings = Options.getOrthancConnexionSettings()
        const address = orthancSettings.orthancAddress
        const port = orthancSettings.orthancPort
        const username = orthancSettings.orthancUsername
        const password = orthancSettings.orthancPassword

        const protocolAndHostname = address.split('//')

        let options = {}
        options.method = method
        options.protocol = protocolAndHostname[0]
        options.hostname = protocolAndHostname[1]
        options.port = port
        options.path = api
        options.auth = username + ':' + password

        if (method === 'GET' || method === 'DELETE') {
            options.headers = {
                'Forwarded': 'by=localhost;for=localhost;host=' + process.env.DOMAIN_ADDRESS + '/api;proto=' + process.env.DOMAIN_PROTOCOL
            }

        } else {
            options.headers = {
                'Content-Type': 'application/json'
            }
        }

        return options
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

    streamToResGet(api, res) {
        return new Promise((resolve, reject) => {
            console.log(this.makeOptions2('GET', api))
            const req = http.get(this.makeOptions2('GET', api), (response) => {
                console.log(response)
                // write status
                if (response.statusCode === 200) {
                    res.status = response.statusCode
                    // write headers
                    Object.keys(response.headers).forEach((headerName) => {
                        res.setHeader(headerName, response.headers[headerName])
                    })
                    //Pipe data to response stream
                    response.pipe(res)
                } else if (response.statusCode === 401) {
                    res.status(403).send("Bad orthanc credentials")
                } else {
                    res.status(response.statusCode).send(response.statusMessage)
                }
            })

            req.on('error', (e) => {
                reject(`problem with request: ${e.message}`);
            });

            resolve()

        })

    },

    streamToRes(api, method, data, res) {
        const readStream = got(this.makeOptions(method, api, data))
        return readStream.on('response', response => {

            if (response.statusCode === 200) {
                //res.send(Buffer.from(response.rawBody, 'base64'));
                response.pipe(res)

                //response.pipe(res)
            } else if (response.statusCode === 401) {
                res.status(403).send("Bad orthanc credentials")
            } else {
                res.status(response.statusCode).send(response.statusMessage)
            }
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
