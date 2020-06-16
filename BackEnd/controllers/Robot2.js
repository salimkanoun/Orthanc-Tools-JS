const {robot} = require('../model/robot/Robot')
const JobRetrieve = require('../model/robot/JobRetrieve')
const Job = require('../model/robot/Job')
const JobItemRetrieve = require('../model/robot/JobItemRetrieve')
const JobItemAnon = require('../model/robot/JobItemAnon')
const Orthanc = require('../model/Orthanc')

const getRobotDetails = async function (req, res) {
    try {
        let retrieveJob = robot.getJob(req.params.username, Job.TYPE_RETRIEVE)
        retrieveJob.getProgression()
        res.json(retrieveJob)
    } catch (error) {
        console.log(error)
        res.json({
            items: []
        })
    }

}

const getAllRobotDetails = async function (req, res) {
    let retrieveJobs = robot.getRetrieveJobs()
    let answer = []
    for (let username in retrieveJobs){
        retrieveJobs[username].getProgression()
        let jsonDetails = retrieveJobs[username].toJSON()
        jsonDetails['username'] = username

        answer.push(retrieveJobs[username].toJSON())
    }
    res.json(answer)
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
        robot.removeJob(req.params.username, req.params.type)
    }
    res.end()
}

const validateRobotJob = async function (req, res) {
    let retrieveJob = robot.getJob(req.params.username, Job.TYPE_RETRIEVE)
    retrieveJob.validateRetrieveJob()
    res.json(true)
}

const addRobotJob = async function (req, res) {
    const body = req.body
    let retrieveJob = robot.getJob(req.params.username, Job.TYPE_RETRIEVE)
    if(retrieveJob == undefined) retrieveJob = new JobRetrieve(req.params.username, new Orthanc())
    retrieveJob.setProjectName(body.projectName)
    body.retrieveArray.forEach( (retrieveQuery) => {
        let retrieveItem = new JobItemRetrieve(retrieveQuery)
        retrieveJob.addItem(retrieveItem)
    })
    robot.addJob(retrieveJob)
    res.json( robot.getJob(req.params.username, Job.TYPE_RETRIEVE) )
}

const addAnonJob = async function (req, res){
    const body = req.body
    let anonJob = robot.getJob(req.params.username, Job.TYPE_ANONYMIZE)
    if(anonJob == undefined) anonJob = new JobRetrieve(req.params.username, new Orthanc())
    body.anonArray.forEach( (anonRequest) => {
        let anonItem = new JobItemAnon(anonRequest.orthancStudyID, 
            anonRequest.profile, 
            anonRequest.newPatientName, 
            anonRequest.newPatientID, 
            anonRequest.newStudyDescription, 
            anonRequest.newAccessionNumber)
        anonJob.addItem(anonItem)
        

    })

    robot.addJob(anonItem)
    robot.getJob(req.params.username, Job.TYPE_ANONYMIZE).execute()
    res.json(true)

}

module.exports = { addRobotJob, getRobotDetails, getAllRobotDetails, deleteRobotJob, removeQueryFromJob, validateRobotJob }
