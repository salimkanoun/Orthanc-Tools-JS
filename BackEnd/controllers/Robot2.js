const {robot} = require('../model/robot/Robot')
const JobRetrieve = require('../model/robot/JobRetrieve')
const Job = require('../model/robot/Job')
const JobItemRetrieve = require('../model/robot/JobItemRetrieve')
const Orthanc = require('../model/Orthanc')

const getRobotDetails = async function (req, res) {
    try {
        let retrieveJob = robot.getJob(req.params.username, Job.TYPE_RETRIEVE)
        retrieveJob.getProgression()
        res.json(retrieveJob)
    } catch (error) {
        res.json({
            items: []
        })
    }

}

const getAllRobotDetails = async function (req, res) {
    let data = []
    res.json(data)
}

const removeQueryFromJob = async function (req, res) {
    let retrieveJob = robot.getJob(req.params.username, Job.TYPE_RETRIEVE)
    if (req.params.username !== undefined) {
        retrieveJob.removeItem(req.params.index)
    }
    res.json(retrieveJob)
}

const deleteRobotJob = async function (req, res) {
    if (req.params.username !== undefined) {
        robot.removeJob(req.params.username)
    }
    res.end()
}

const validateRobotJob = async function (req, res) {
    let retrieveJob = robot.getJob(req.params.username, Job.TYPE_RETRIEVE)
    retrieveJob.validateRobotJob()
    res.json(true)
}

const addRobotJob = async function (req, res) {
    const body = req.body
    let retrieveJob = new JobRetrieve( "salim", new Orthanc() )
    body.retrieveArray.forEach( (retrieveQuery) => {
        retrieveItem = new JobItemRetrieve(retrieveQuery)
        retrieveJob.addItem(retrieveQuery)
    })
    robot.addJob(retrieveJob)
    console.log(retrieveJob)
    res.json( robot.getJob("salim", Job.TYPE_RETRIEVE) )
}

module.exports = { addRobotJob, getRobotDetails, getAllRobotDetails, deleteRobotJob, removeQueryFromJob, validateRobotJob }
