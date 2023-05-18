const axios = require("axios")
const Options = require("./Options")

const OrthancReverseProxyService = {

    makeConfig: (method, url, data, headers = {}, getAsStream = false) => {
        const orthancSettings = Options.getOrthancConnexionSettings()
        const address = orthancSettings.orthancAddress
        const port = orthancSettings.orthancPort
        const username = orthancSettings.orthancUsername
        const password = orthancSettings.orthancPassword

        let options = {
            method: method,
            baseURL: address + ':' + port,
            url: url,
            auth: {
                username: username,
                password: password
            },
            headers: {
                'Forwarded': 'by=localhost;for=localhost;host=' + process.env.DOMAIN_ADDRESS + '/api;proto=' + process.env.DOMAIN_PROTOCOL,
                ...headers
            }
        }

        if (data) {
            options.data = data
        }

        if (getAsStream) {
            options.responseType = 'stream'
        }

        return options
    },

    reverseProxyStreamToRes: (url, method, data, headers, res) => {
        const config = OrthancReverseProxyService.makeConfig(method, url, data, headers, true)
        return axios.request(config).then(response => {
            res.setHeader('content-type', response.headers['content-type'])
            response.data.pipe(res)
        }).catch(function (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    res.status(403).send("Bad orthanc credentials")
                } else {
                    res.status(error.response.status).send(error.response.statusMessage)
                }
            }
        })
    },

    streamToFileWithCallBack(url, method, data, streamWriter, finishCallBack) {
        const config = OrthancReverseProxyService.makeConfig(method, url, data, {}, true)
        return axios.request(config).then((response) => {
            response.pipe(streamWriter).on('finish', () => {
                finishCallBack();
            });

        }).catch((error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    res.status(403).send("Bad orthanc credentials")
                } else {
                    throw new OTJSInternalServerError(error.message);
                }
            }
        })
    },

    reverseProxyGetAnswer: (url, method, data) => {
        const config = OrthancReverseProxyService.makeConfig(method, url, data, {}, false)
        return axios.request(config).then((response) => {
            return response.data
        }).catch((error) => {
            if (error.response) {
                if (error.response.status === 401) {
                    throw new OTJSInternalServerError("Bad orthanc credentials")
                } else {
                    throw new OTJSInternalServerError(error.message)
                }
            }
        })
    },
}

module.exports = OrthancReverseProxyService