const {robot} = require('../model/robot/Robot')
const JobRetrieve = require('../model/robot/JobRetrieve')
const JobAnonymize = require('../model/robot/JobAnonymize')
const JobDelete = require('../model/robot/JobDelete')
const Job = require('../model/robot/Job')
const JobItemRetrieve = require('../model/robot/JobItemRetrieve')
const JobItemAnon = require('../model/robot/JobItemAnon')
const JobItemDelete = require('../model/robot/JobItemDelete')
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
    if(anonJob != undefined && anonJob.status == Job.STATUS_RUNNING) {
        res.status(401).send("Anon Robot is already processing, wait finish before starting a new one")
        return
    }
    let orthanc = new Orthanc()

    anonJob = new JobAnonymize(req.params.username, orthanc)
    robot.addJob(anonJob)

    for(let anonRequest of body){
        let studiesData = await orthanc.getOrthancDetails('studies', anonRequest.orthancStudyID)
        let anonItem = new JobItemAnon(anonRequest.orthancStudyID, 
            anonRequest.profile, 
            anonRequest.newPatientName, 
            anonRequest.newPatientID, 
            anonRequest.newStudyDescription, 
            anonRequest.newAccessionNumber,
            studiesData.PatientMainDicomTags.PatientName,
            studiesData.PatientMainDicomTags.PatientID,
            studiesData.MainDicomTags.StudyDescription,
            studiesData.MainDicomTags.AccessionNumber)
        anonJob.addItem(anonItem)

    }

    body.forEach( (anonRequest) => {
        
    })
    console.log(anonJob)
    robot.getJob(req.params.username, Job.TYPE_ANONYMIZE).execute()
    res.json(true)

}

const getAnonJob = async function(req, res){

    try {
        let anonJob = robot.getJob(req.params.username, Job.TYPE_ANONYMIZE)
        anonJob.getProgression()
        res.json(anonJob)
    } catch (error) {
        console.log(error)
        res.json({
            items: []
        })
    }

}

const getDeleteJob = async function(req, res){

    try {
        let deleteJob = robot.getJob(req.params.username, Job.TYPE_DELETE)
        deleteJob.getProgression()
        res.json(deleteJob)
    } catch (error) {
        console.log(error)
        res.json({
            items: []
        })
    }

}

const addDeleteJob = async function (req, res){
    const body = req.body
    let deleteJob = robot.getJob(req.params.username, Job.TYPE_DELETE)
    if(deleteJob != undefined && deleteJob.status == Job.STATUS_RUNNING) {
        res.status(401).send("Delete Robot is already processing, wait finish before starting a new one")
        return
    }
    
    deleteJob = new JobDelete(req.params.username, new Orthanc())
    
    body.forEach( (deleteOrthancID) => {
        let deleteItem = new JobItemDelete(deleteOrthancID)
        deleteJob.addItem(deleteItem)
    })
    
    robot.addJob(deleteJob)
    console.log(deleteJob)
    robot.getJob(req.params.username, Job.TYPE_DELETE).execute()
    res.json(true)

}

module.exports = { addRobotJob, getRobotDetails, getAllRobotDetails, deleteRobotJob, removeQueryFromJob, validateRobotJob, addAnonJob, getAnonJob, getDeleteJob, addDeleteJob }
