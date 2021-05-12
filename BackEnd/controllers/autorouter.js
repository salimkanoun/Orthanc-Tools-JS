const Autorouter = require('../model/Autorouters')
const { OTJSBadRequestException } = require('../Exceptions/OTJSErrors')

  createAutorouter = async function(req,res){
    let name = req.params.name
    let body = req.body
    if(!body.target || !body.rules || !name) throw new OTJSBadRequestException('A Name must be specified in parameters, an Autorouter request a Target and Rules !')
    await Autorouter.createAutorouters(name,body.rules,body.target)
    res.sendStatus(201)
  }

  getAutorouters = async function(req,res){
    let autorouters = await Autorouter.getAllAutorouters()
    res.json(autorouters)
  }

  getAutorouterById = async function(req,res){
    let autorouter = await Autorouter.getAutorouterById(req.params.id)
    res.json(autorouter)
  }

  switchOnOff = async function(req,res){
    let running = req.body.running
    await Autorouter.switchRunning(req.params.id,running)
    res.sendStatus(200)
  }

  modifyAutorouter = async function(req,res){
    let body = req.body
    await Autorouter.modifyAutorouter(req.params.id,body.name,body.rules,body.target)
    res.sendStatus(200)
  }

  deleteAutorouter = async function(req,res){
    await Autorouter.deleteAutorouter(req.params.id)
    res.sendStatus(200)
  }

module.exports={createAutorouter,getAutorouters,getAutorouterById,switchOnOff,modifyAutorouter,deleteAutorouter}