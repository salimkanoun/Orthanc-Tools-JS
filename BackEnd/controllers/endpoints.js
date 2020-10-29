const Endpoint = require('../model/export/Endpoint')

const newEndpoint = async function(req, res){
    try {
        let endpoint = new Endpoint(req.body)
        await endpoint.createEndpoint()
        res.json(endpoint.getSendable());
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const allEndpoints = async function(req, res){
    try {
        let endpoints = (await Endpoint.getAllEndpoints())
        let response = []
        for (let index = 0; index < endpoints.length; index++) {
            const element = endpoints[index];
            response.push(await element.getSendable())
        }
        res.json(response);
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const updateEndpoint = async function(){
    try {
        let endpoint = await Endpoint.getFromId(req.body.id);
        endpoint.set(res.body)
        res.send(endpoint.getSendable())
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const removeEndpoint = async function(req,res){
    try {
        let endpoint = await Endpoint.getFromId(req.body.id)
        await endpoint.removeEndpoint()
        res.send('Done')
    } catch(error){

        console.error(error)
        res.status(400).send(error)
    }
}

module.exports = { allEndpoints, updateEndpoint, newEndpoint, removeEndpoint }