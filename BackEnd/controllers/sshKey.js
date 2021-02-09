const SshKey = require("../model/export/SshKey");

const newKey = async function(req, res){
    let key = new SshKey(req.body)
    await key.createSshKey()
    res.json(key);
}

const allKeys = async function(req, res){
    res.json((await SshKey.getAllSshKey()));
}

const updateKey = async function(req, res){
    let key = await SshKey.getFromId(req.body.id);
    key.set(req.body)
    res.json(key)
}

const uploadKey = async function(req, res){
    let key = await SshKey.getFromId(req.params.id)
    await key.setKeyContent(req.body)
    res.send('Done')
}

const removeKey = async function(req,res){
    let key = await SshKey.getFromId(req.body.id)
    await key.deleteSshKey()
    res.send('Done')
}

module.exports = { newKey, allKeys, updateKey, uploadKey, removeKey}