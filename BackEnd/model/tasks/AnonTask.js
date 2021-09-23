const {OTJSForbiddenException} = require("../../Exceptions/OTJSErrors");
const TaskType = require("../TaskType");
const Queue = require('../../adapter/bullAdapter');
const Orthanc = require('../Orthanc');
const {v4: uuid} = require('uuid');

let orthanc = new Orthanc();
const JOBS_TTL = 5;

const JOBS_PROGRESS_INTERVAL = 200;

class AnonTask {
    /**
     * Get the average progress of all the jobs of a task
     * @param {[Jobs]} jobs jobs of the task
     * @returns {number} number between 0 and 100 of the progress
     */
    static async getProgress(jobs) {
        let progress = 0
        let length = jobs.length
        for (let i = 0; i < length; i++) {
            const job = jobs[i]
            progress += (['completed', 'failed'].includes(await job.getState()) ? 100 : await job.progress())
        }
        return progress / length;
    }

    /**
     * Create the anonimization task
     * @param {string} creator username of the creator of the task
     * @param {[any]} studies studies to be anonymised
     * @returns {string} the uuid of the task
     */
    static async createTask(creator, studies) {
        let task = await AnonTask.getUserTask(creator).then(ids => (ids ? AnonTask.getTask(ids[0]) : null));
        // Checking for existing task of the user
        if (!!task && !['completed', 'failed'].includes(task.state)) {
            throw new OTJSForbiddenException("Cant create two retrieval simulteanously");
        }

        //Removing the oldest task and decreasing the ttl of other task
        await AnonTask.decay(creator);

        //Creating the corresponding jobs
        return AnonTask._createJobs(creator, studies);
    }

    static _createJobs(creator, items) {
        let taskId = 'a-' + uuid();
        let jobs = items.map(item => {
            return {
                data: {
                    taskId,
                    creator,
                    item,
                    ttl: JOBS_TTL
                }
            }
        });
        return anonQueue.addJobs(jobs).then(() => taskId);
    }

    static _getJobs(taskId) {
        return anonQueue.getJobs().then(jobs => jobs.filter(job => job.data.taskId === taskId));
    }

    static _getUserJobs(user) {
        return anonQueue.getJobs().then(jobs => jobs.filter(job => job.data.creator === user));
    }

    /**
     * return the task corresponding to the task ID
     * @param {string} id the uuid of the task to be returned
     * @returns {Task} the task info
     */
    static async getTask(id) {
        //Gathering the jobs of the corresponding task
        let jobs = await AnonTask._getJobs(id);

        //If no jobs of this task exist then the task doesn't exist
        if (jobs.length === 0) return null;

        let progress = await AnonTask.getProgress(jobs);

        //making state
        let state = null;
        if (progress === 0) {
            state = 'wait'
        } else if (progress === 100) {
            for (const job of jobs) {
                if (job.getState() === 'failed') state = 'failed';
            }
            if (state === null) state = 'completed';
        } else {
            state = 'active'
        }

        return {
            id,
            type: TaskType.ANONYMIZE,
            creator: jobs[0].data.creator,
            progress,
            state,
            details: {
                items: // Format jobs into usable info about the items
                    await Promise.all(jobs.map(async job => {
                        let state = await job.getState()
                        let item = {
                            source: job.data.item.sourceOrthancStudyID,
                            state,
                            result: (state === "completed" ? await job.finished() : null)
                        }
                        return item;
                    }))
            },
            ttl: jobs[0].data.ttl
        }
    }

    /**
     * get the tasks  of a corresponding user
     * @param {string} user creator of the task to be returned
     * @returns {[id]} tasks uuids of the user
     */
    static async getUserTask(user) {
        let anonJobs = await AnonTask._getUserJobs(user);
        if (anonJobs.length === 0) return null;

        let ids = [];
        for (const job of anonJobs) {
            if (!(ids.includes(job.data.taskId))) {
                ids[JOBS_TTL - job.data.ttl] = job.data.taskId;
            }
        }
        return ids;
    }

    /**
     * get the tasks of this type
     * @returns {[Task]} tasks of this type
     */
    static async getTasks() {
        let jobs = await anonQueue.getJobs();

        //Makes a set of the ids of the task
        let ids = [];
        for (const job of jobs) {
            if (!(ids.includes(job.data.taskId))) {
                ids.push(job.data.taskId);
            }
        }

        return await Promise.all(ids.map(id => AnonTask.getTask(id)));
    }

    /**
     * delete the task of a given id
     * @param {string} taskId uuid of the task to be deleted
     */
    static async delete(taskId) {
        let anonJobs = await AnonTask._getJobs(taskId);
        anonJobs.forEach(job => {
            job.remove()
        }); //Delete jobs of the task
    }

    /**
     * Remove all jobs for anonimization
     */
    static async flush() {
        await anonQueue.clean();
    }

    /**
     * reduce the time to live of all the jobs of an user
     */
    static async decay(user) {
        let jobs = await AnonTask._getUserJobs(user);

        await Promise.all(jobs.map(x => {
            if (x.data.ttl === 1) {
                return x.remove();
            } else {
                return x.update(
                    {
                        ...x.data,
                        ttl: x.data.ttl - 1
                    }
                );
            }
        }));
    }

    /**
     * Processor that anonymize the study of a given id
     * @param {object} job
     * @param {object} done
     */
    static async _anonymizeItem(job, done) {
        let item = job.data.item

        //Requesting orthanc API to anonymize a study


        let anonAnswer = await orthanc.makeAnon('studies', item.orthancStudyID, item.profile, item.newAccessionNumber, item.newPatientID, item.newPatientName, item.newStudyDescription, false).catch((err) => {
            console.error(item)
            console.error(err);
            done(err);
        })

        //Monitor orthanc job
        orthanc.monitorJob(anonAnswer.Path, (response) => {
            job.progress(response.Progress)
        }, JOBS_PROGRESS_INTERVAL).then(async (answer) => {
            if (answer.Content.PatientID !== undefined) {
                //If default, remove the secondary capture SOPClassUID
                if (item.profile === 'Default') {
                    let anonymizedStudyDetails = await orthanc.getOrthancDetails('studies', answer.Content.ID)
                    for (let seriesOrthancID of anonymizedStudyDetails['Series']) {
                        let seriesDetails = await orthanc.getOrthancDetails('series', seriesOrthancID)
                        let firstInstanceID = seriesDetails['Instances'][0]
                        try {
                            let sopClassUID = await orthanc.getSopClassUID(firstInstanceID)
                            if (AnonTask.isSecondaryCapture(sopClassUID)) {
                                await orthanc.deleteFromOrthanc('series', seriesOrthancID)
                            }
                        } catch (ignore) {

                        }
                    }
                }
                job.progress(100);
                done(null, answer.Content.ID);
            } else {
                console.error("Orthanc Error Anonymizing");
                done("Orthanc Error Anonymizing");
            }
        }).catch((err) => {
            console.error(err);
            done(err);
        })
    }

    static isSecondaryCapture(sopClassUid) {

        let secondaryCapturySopClass = [
            "1.2.840.10008.5.1.4.1.1.7",
            "1.2.840.10008.5.1.4.1.1.7.1",
            "1.2.840.10008.5.1.4.1.1.7.2",
            "1.2.840.10008.5.1.4.1.1.7.3",
            "1.2.840.10008.5.1.4.1.1.7.4",
            "1.2.840.10008.5.1.4.1.1.88.11",
            "1.2.840.10008.5.1.4.1.1.88.22",
            "1.2.840.10008.5.1.4.1.1.88.33",
            "1.2.840.10008.5.1.4.1.1.88.40",
            "1.2.840.10008.5.1.4.1.1.88.50",
            "1.2.840.10008.5.1.4.1.1.88.59",
            "1.2.840.10008.5.1.4.1.1.88.65",
            "1.2.840.10008.5.1.4.1.1.88.67"
        ]

        return secondaryCapturySopClass.includes(sopClassUid)

    }
}

let anonQueue = new Queue('anon', AnonTask._anonymizeItem);

module.exports = AnonTask
