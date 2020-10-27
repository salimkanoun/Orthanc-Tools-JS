const SshKey = require("../model/export/SshKey");

const newKey = async function(req, res){
    try {
        let key = new SshKey(req.body)
        await key.createSshKey()
        res.json(key.getSendable());
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const allKeys = async function(req, res){
    try {
        res.json((await SshKey.getAllSshKey()).map(x=>x.getSendable()));
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const updateKey = async function(req, res){
    try {
        let key = await SshKey.getFromId(req.body.id);
        key.set(req.body)
        res.json(key.getSendable())
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
}

const uploadKey = async function(req, res){
    try {
        let key = await SshKey.getFromId(req.params.id)
        await key.setKeyContent(req.body)
        res.send('Done')
    } catch(error){

        console.error(error)
        res.status(400).send(error)
    }
}

const removeKey = async function(req,res){
    try {
        let key = await SshKey.getFromId(req.body.id)
        await key.deleteSshKey()
        res.send('Done')
    } catch(error){

        console.error(error)
        res.status(400).send(error)
    }
}

module.exports = { newKey, allKeys, updateKey, uploadKey, removeKey}