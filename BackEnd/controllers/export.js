
const Endpoint = require("../model/export/Endpoint");
const {Exporter} = require("../model/export/Exporter");
const ExportTask = require("../model/tasks/ExportTask");


const exporter = new Exporter();

//////////////////////////////////////////////////////////////////////
////////////////////////////// Controllers ///////////////////////////
//////////////////////////////////////////////////////////////////////

const exportFtp = async function(req, res){
    let studies = req.body.Resources

    res.json({id : exporter.ftpExport(studies)});
}


const exportWebDav = async function(req, res){
    let studies = req.body.Resources
    res.json({id : exporter.webdavExport(studies)});
}

const getExportProgress = async function(req, res){
    let uuid = req.params.uuid
    if(exporter.taskMap[uuid]===undefined){
        res.status(400).send("Bad request the task uuid is unknown")
        return
    }

    res.json(exporter.taskMap[uuid].getSendable());
}

const exportArchive = async function(req,res){
    let studies = req.body.Resources
    let task = new ExportTask(req.params.user, studies, await Endpoint.getFromId(req.body.endpoint))
    task.run()
    res.json({id:task.id})
}

module.exports = {exportFtp, exportWebDav, getExportProgress, exportArchive}