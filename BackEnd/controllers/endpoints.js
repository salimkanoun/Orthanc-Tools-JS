const Endpoint = require('../model/export/Endpoint')

const newEndpoint = async function(req, res){
    let endpoint = new Endpoint(req.body)
    await endpoint.createEndpoint()
    res.json(endpoint);
}

const allEndpoints = async function(req, res){
    let endpoints = (await Endpoint.getAllEndpoints())
    let response = []
    for (let index = 0; index < endpoints.length; index++) {
        const element = endpoints[index];
        let j = element.toJSON();
        if(j.sshKey) j.sshKey = (await element.getSshKey()).toJSON();
        response.push(j);
    }
    res.json(response);
}

const updateEndpoint = async function(req,res){
    let endpoint = await Endpoint.getFromId(req.body.id);
    endpoint.set(req.body)
    res.send(endpoint)
}

const removeEndpoint = async function(req,res){
    let endpoint = await Endpoint.getFromId(req.body.id)
    await endpoint.removeEndpoint()
    res.sendStatus(200)
}

module.exports = { allEndpoints, updateEndpoint, newEndpoint, removeEndpoint }