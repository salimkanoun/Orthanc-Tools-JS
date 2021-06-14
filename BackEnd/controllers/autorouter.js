const Autorouter = require('../model/Autorouters')
const { OTJSBadRequestException } = require('../Exceptions/OTJSErrors')
  /**
 * Create an autorouter
 * @param {*} req express request
 * @param {*} res request result
 */
  createAutorouter = async function(req,res){
    let name = req.params.name
    let body = req.body
    if(!body.rules || !body.destination || !name) throw new OTJSBadRequestException('A Name must be specified in parameters, an Autorouter request Rules and a Destination!')
    await Autorouter.createAutorouters(name, body.condition, body.rules, null, body.destination)
    res.sendStatus(201)
  }

  /**
 * Get all autorouters
 * @param {*} req express request
 * @param {*} res request result
 */
  getAutorouters = async function(req,res){
    let autorouters = await Autorouter.getAllAutorouters()
    res.json(autorouters)
  }

  /**
 * Get an autorouter and its details using its ID
 * @param {*} req express request
 * @param {*} res request result
 */
  getAutorouterById = async function(req,res){
    let autorouter = await Autorouter.getAutorouterById(req.params.id)
    res.json(autorouter)
  }

  /**
 * Turn on/off an autorouter
 * @param {*} req express request
 * @param {*} res request result
 */
  switchOnOff = async function(req,res){
    let running = req.body.running
    await Autorouter.switchRunning(req.params.id,running)
    res.sendStatus(200)
  }

  /**
 * Modify an autorouter
 * @param {*} req express request
 * @param {*} res request result
 */
  modifyAutorouter = async function(req,res){
    let body = req.body
    await Autorouter.modifyAutorouter(req.params.id, body.name || null, body.condition || null , body.rules || null, body.target || null, body.destination || null)
    res.sendStatus(200)
  }

  /**
 * Delete an autorouter
 * @param {*} req express request
 * @param {*} res request result
 */
  deleteAutorouter = async function(req,res){
    await Autorouter.deleteAutorouter(req.params.id)
    res.sendStatus(200)
  }

module.exports={createAutorouter,getAutorouters,getAutorouterById,switchOnOff,modifyAutorouter,deleteAutorouter}