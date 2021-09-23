const Exporter = require("../export/Exporter");
const Orthanc = require("../Orthanc");
const TaskType = require("../TaskType");
const Queue = require("../../adapter/bullAdapter");
const {v4: uuid} = require('uuid');
const Endpoint = require('../export/Endpoint');
const ReverseProxy = require('../ReverseProxy');
const fs = require('fs');

let orthanc = new Orthanc();
let exporter = new Exporter();

const JOBS_PROGRESS_INTERVAL = 200;

class ExportTask {
    /**
     * Create the export task
     * @param {string} creator username of the creator of the task
     * @param {[any]} studies studies to be exported
     * @param {Endpoint} endpoint endpoint to export the studies to
     * @param {string} transcoding transcoding to be used to create the archive
     * @returns {Promise<String>} the uuid of the task
     */
    static createTask(creator, studies, endpoint, transcoding = null) {
        let taskId = 'e-' + uuid();
        let fileName = String(Date.now()) + '.zip';
        return archiveQueue.addJob({
            creator,
            taskId,
            orthancIds: studies,
            transcoding,
            endpoint,
            fileName
        }).then(() => taskId);
    }

    /**
     * return the task corresponding to the task ID
     * @param {string} id the uuid of the task to be returned
     * @returns {Task} the task info
     */
    static async getTask(id) {
        //Searching for the relevant Jobs
        let archiveJob = (await archiveQueue.getJobs()).filter(job => job.data.taskId === id);
        let sendJob = await exporter.getUploadJobs(id);

        //If no jobs of this task exist then the task doesn't exist 
        if (!archiveJob[0] && !sendJob[0]) return null;

        //Computing the sub-states
        let archiveState = (archiveJob[0] ? await archiveJob[0].getState() : 'waiting')
        let sendState = (sendJob[0] ? await sendJob[0].getState() : 'waiting')

        //Computing the states
        let state;
        if (archiveState === 'waiting' && archiveState === sendState) state = 'pending archiving'
        else if (archiveState === 'active' && sendState === 'waiting') state = 'archiving'
        else if (archiveState === 'completed' && sendState === 'waiting') state = 'pending sending'
        else if (archiveState === 'completed' && sendState === 'active') state = 'sending'
        else if (archiveState === 'completed' && archiveState === sendState) state = 'completed'
        else state = 'failed'

        return {
            id,
            type: TaskType.EXPORT,
            creator: archiveJob[0].data.creator,
            progress: {
                archiving: (archiveJob[0] ? await archiveJob[0].progress() : 0),
                sending: (sendJob[0] ? await sendJob[0].progress() : 0)
            },
            state,
            details: {
                result: archiveJob[0].data.fileName
            }
        }
    }

    /**
     * get the task corresponding of user
     * @param {string} user creator of the task to be returned
     * @returns {string} task uuid of the user
     */
    static async getUserTask(user) {
        let archiveJobs = (await archiveQueue.getJobs()).filter(job => job.data.creator === user);
        if (archiveJobs.length === 0) return null;
        return archiveJobs[0].data.taskId;
    }

    /**
     * get the tasks of this type
     * @returns {[string]} tasks of this type
     */
    static async getTasks() {
        let jobs = await archiveQueue.getJobs();
        let ids = [];

        //Makes a set of the ids of the task
        for (const job of jobs) {
            if (!(ids.includes(job.data.taskId))) {
                ids.push(job.data.taskId);
            }
        }

        return await Promise.all(ids.map(id => ExportTask.getTask(id)));
    }

    /**
     * Remove all jobs for export
     */
    static async flush() {
        await archiveQueue.clean();
        await exporter.sendQueue.clean();
    }

    /**
     * Processor that generate an archive based on orthanc ids
     * @param {object} job
     * @param {fn} done
     */
    static async _getArchiveDicom(job, done) {
        let orthancIds = job.data.orthancIds;
        let transcoding = job.data.transcoding;

        let payload;

        if (transcoding) {
            payload = {
                "Synchronous": false,
                "Transcode": transcoding,
                "Resources": orthancIds
            }
        } else {
            payload = {
                "Synchronous": false,
                "Resources": orthancIds
            }
        }

        //Request the creation of an archive
        let r = await ReverseProxy.getAnswer('/tools/create-archive', 'POST', payload)
        let jobPath = r.Path

        //Monitor the orthanc job
        await orthanc.monitorJob(jobPath, (response) => {
            job.progress(response.Progress)
        }, JOBS_PROGRESS_INTERVAL).then((response) => {
            const destination = './data/export_dicom/' + Math.random()
                .toString(36).substr(2, 5) + '.zip';
            const streamWriter = fs.createWriteStream(destination);
            ReverseProxy.streamToFileWithCallBack(jobPath + '/archive', 'GET', {}, streamWriter, () => {
                done(null, {path: destination});
            }).catch((error) => {
                console.err(error)
            });
        }).catch((error) => {
            console.error('error in a task :');
            console.error(error);
            done(error);
        })
    }
}

let archiveQueue = new Queue('archive', ExportTask._getArchiveDicom, Number(process.env.EXPORT_ATTEMPTS) || 3, Number(process.env.EXPORT_BACKOFF) || 2000);
archiveQueue.on("completed", async (job, result) => {
    let endpoint
    if (job.data.endpoint == -1) {
        endpoint = {
            id: -1,
            label: 'local',
            protocol: 'local',
        }
    } else {
        endpoint = await Endpoint.getFromId(job.data.endpoint);
    }
    await exporter.uploadFile(job.data.taskId, endpoint, result.path, job.data.fileName).catch((err) => {
        job.moveToFailed(err)
    });
});

module.exports = ExportTask