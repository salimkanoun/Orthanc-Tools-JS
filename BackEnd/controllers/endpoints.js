const Endpoint = require('../model/export/Endpoint')

const newEndpoint = async function(req, res){
    let endpoint = new Endpoint(req.body)
    await endpoint.createEndpoint()
    res.json(endpoint.toJSON());
}

const allEndpoints = async function(req, res){
    let endpoints = (await Endpoint.getAllEndpoints())
    let response = []
    for (let index = 0; index < endpoints.length; index++) {
        const element = endpoints[index];
        let j = element.toJSON();
        j.sshKey = (await element.getSshKey()).toJSON();
        response.push(j);
    }
    res.json(response);
}

const updateEndpoint = async function(){
    let endpoint = await Endpoint.getFromId(req.body.id);
    endpoint.set(res.body)
    res.send(endpoint.toJSON())
}

const removeEndpoint = async function(req,res){
    let endpoint = await Endpoint.getFromId(req.body.id)
    await endpoint.removeEndpoint()
    res.send('Done')
}

module.exports = { allEndpoints, updateEndpoint, newEndpoint, removeEndpoint }