
const {Exporter} = require("../model/exporter");


const exporter = new Exporter();

//////////////////////////////////////////////////////////////////////
////////////////////////////// Controllers ///////////////////////////
//////////////////////////////////////////////////////////////////////

const exportFtp = async function(req, res){
    let studies = req.body.Resources

    res.json(exporter.ftpExport(studies));
}


const exportWebDav = async function(req, res){
    let studies = req.body.Resources
    res.json(exporter.webdavExport(studies));
}

const getExportProgress = async function(req, res){
    let uuid = req.body.uuid
    if(exporter.taskMap[uuid]===undefined){
        res.status(400).send("Bad request the task uuid is unknown")
        return
    }

    res.json(exporter.taskMap[uuid].getSendable());
}

module.exports = {exportFtp, exportWebDav, getExportProgress}