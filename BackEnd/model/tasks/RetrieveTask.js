const {OTJSForbiddenException, OTJSNotFoundException, OTJSBadRequestException} = require("../../Exceptions/OTJSErrors");
const Orthanc = require("../Orthanc");
const TaskType = require("../TaskType");
const Queue = require("../../adapter/bullAdapter");
const OrthancQueryAnswer = require("../OrthancData/queries-answer/OrthancQueryAnswer");
const {v4: uuid} = require('uuid');
const schedule = require('node-schedule');
const Options = require('../Options');
const time = require('../../utils/time');

let orthanc = new Orthanc();

const JOBS_TTL = 5;

class RetrieveTask {

    /**
     * Get the progress of a task based on its jobs
     * @param {[Jobs]} validationJobs validation jobs of the task
     * @param {[Jobs]} retrieveJobs retrive jobs of the task
     * @returns {any} objecting containing the progress of the task
     */
    static async getProgress(validationJobs, retrieveJobs) {
        let validation = 0;
        for (const job of validationJobs) {
            validation += await job.progress();
        }
        validation /= validationJobs.length;

        let retrieve = 0;
        for (const job of retrieveJobs) {
            let jobProgress = await job.progress()
            if (jobProgress != null) retrieve += jobProgress
        }

        retrieve /= (retrieveJobs.length === 0 ? 1 : retrieveJobs.length);
        return {
            validation,
            retrieve,
        }
    }

    /**
     * Create the retrieve task
     * @param {string} creator username of the creator of the task
     * @param {string} projectName name of the retrieve project
     * @param {[any]} answers querry answers from the aet to be retrieve from the aet
     * @returns {string} the uuid of the task
     */
    static async createTask(creator, projectName, answers) {
        let task = await RetrieveTask.getUserTask(creator).then(ids => (ids ? RetrieveTask.getTask(ids[0]) : null));
        // Checking for existing task of the user 
        if (!!task && !['completed', 'failed'].includes(task.state)) {
            throw new OTJSForbiddenException("Cant create two retrieval simulteanously");
        }

        //Removing the oldest task and decreasing the ttl of other task
        await RetrieveTask.decay(creator);

        //Creating the corresponding jobs
        return RetrieveTask._createJobs(creator, projectName, answers);
    }

    static _createJobs(creator, projectName, items) {
        let taskId = 'r-' + uuid();

        // Checking for duplicate
        let curratedItems = items.reduce((aggregation, item) => {
            if (item.Level === OrthancQueryAnswer.LEVEL_STUDY) {
                for (const existingItem of aggregation) {
                    if (item.StudyInstanceUID === existingItem.StudyInstanceUID) return aggregation;
                }
                aggregation.push(item);
            } else if (item.Level === OrthancQueryAnswer.LEVEL_SERIES) {
                for (const existingItem of aggregation) {
                    if (item.StudyInstanceUID === existingItem.StudyInstanceUID && item.SeriesInstanceUID === existingItem.SeriesInstanceUID) return aggregation;
                }
                aggregation.push(item);
            }
            return aggregation;
        }, []);

        let jobs = curratedItems.map(item => {
            return {
                data: {
                    taskId,
                    creator,
                    projectName,
                    ttl: JOBS_TTL,
                    item
                }
            }
        });

        return validationQueue.addJobs(jobs).then(() => taskId);
    }


    static _getValidationJobs(taskId) {
        return validationQueue.getJobs()
            .then(jobs => jobs.filter(job => job.data.taskId === taskId));
    }

    static _getRetrieveJobs(taskId) {
        return retrieveQueue.getJobs()
            .then(jobs => jobs.filter(job => job.data.taskId === taskId));
    }

    /**
     * give the administrator approbation to the retrieve task
     * @param {string} id username of the creator of the task
     */
    static async validateTask(id) {
        let task = await RetrieveTask.getTask(id);

        if (task === null) throw new OTJSNotFoundException("No task of this kind");
        if (task.progress.validation != 100) throw OTJSBadRequestException("Items validation still in progress")
        let jobs = await RetrieveTask._getValidationJobs(id)

        let jobsData = [];
        for (const job of jobs) {
            jobsData.push(
                {
                    data: job.data
                }
            );
        }
        await retrieveQueue.addJobs(jobsData);
    }

    /**
     * return the task corresponding to the task ID
     * @param {string} id the uuid of the task to be returned
     * @returns {Task} the task info
     */
    static async getTask(id) {
        const sorter = (a, b) => {
            if (a.data.AnswerId === b.data.AnswerId) {
                if (a.data.AnswerNumber === b.data.AnswerNumber) {
                    return 0;
                } else if (a.data.AnswerNumber > b.data.AnswerNumber) {
                    return 1;
                } else {
                    return -1;
                }
            } else if (a.data.AnswerId > b.data.AnswerId) {
                return 1;
            } else {
                return -1;
            }
        };
        //Gathering the jobs of the corresponding task
        let validationJobs = (await RetrieveTask._getValidationJobs(id)).sort(sorter);
        if (validationJobs.length === 0) return null; //If no jobs of this task exist then the task doesn't exist
        let retrieveJobs = (await RetrieveTask._getRetrieveJobs(id)).sort(sorter);
        let progress = await RetrieveTask.getProgress(validationJobs, retrieveJobs);

        //Making state
        let state = null

        if (progress.validation < 100) {
            state = 'validating robot';
        } else if (progress.validation === 100 && progress.retrieve === 0 && retrieveJobs.length === 0) {
            state = 'waiting admin validation'
        } else if (progress.validation === 100 && progress.retrieve < 100 && retrieveJobs.length !== 0) {
            state = 'retrieving';
        } else if (progress.validation === 100 && progress.retrieve === 100 && retrieveJobs.length !== 0) {
            state = 'completed';
        } else {
            state = 'failed';
        }
        for (const job of validationJobs) {
            if ((await job.getState()) === Queue.JOB_STATES.FAILED) state = 'failed';
        }
        for (const job of retrieveJobs) {
            if ((await job.getState()) === Queue.JOB_STATES.FAILED) state = 'failed';
        }

        //Check for the validation of the task and gather the items
        let valid = true;
        let items = []
        for (let i = 0; i < validationJobs.length; i++) {
            const validateJob = validationJobs[i];
            const retrieveJob = retrieveJobs[i];
            let Validated = (await validateJob.getState() === 'completed' ? await validateJob.finished() : null);
            valid = valid && !!Validated;
            const state = (retrieveJob ? await retrieveJob.getState() : 'waiting');
            items.push({
                ...validateJob.data.item,
                Validated,
                Status: state,
                RetrievedOrthancId: (state === "completed" ? await retrieveJob.finished() : null)
            })
        }
        let approved = valid && retrieveJobs.length > 0

        return {
            id,
            type: TaskType.RETRIEVE,
            creator: validationJobs[0].data.creator,
            progress,
            state,
            details: {
                projectName: validationJobs[0].data.projectName,
                valid,
                approved,
                items
            },
            ttl: validationJobs[0].data.ttl
        }
    }

    /**
     * get the corresponding tasks of user
     * @param {string} user creator of the task to be returned
     * @returns {[id]} tasks uuids of the user
     */
    static async getUserTask(user) {
        let validateJobs = await validationQueue.getJobs()
            .then(jobs => jobs.filter(job => job.data.creator === user));

        if (validateJobs.length === 0) return null;

        let ids = [];
        for (const job of validateJobs) {
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
        let jobs = await validationQueue.getJobs();
        let ids = [];
        for (const job of jobs) {
            if (!(ids.includes(job.data.taskId))) {
                ids.push(job.data.taskId);
            }
        }
        return await Promise.all(ids.map(id => RetrieveTask.getTask(id)));
    }

    /**
     * delete an item of the retrieve task
     * @param {string} taskId uuid of the task
     * @param {string} itemId id of the item to be deleted
     */
    static async deleteItem(taskId, itemId) {
        let retrieveJobs = await RetrieveTask._getRetrieveJobs(taskId);
        if (retrieveJobs.length !== 0) throw new OTJSForbiddenException("Can't delete a robot already in progress");
        let validateJobs = await RetrieveTask._getValidationJobs(taskId);
        let answerId = itemId.split(':')[1];
        let answerNumber = itemId.split(':')[0];
        let job = validateJobs.filter(job => job.data.item.AnswerNumber == answerNumber && job.data.item.AnswerId == answerId)[0];
        if (!job) throw new OTJSNotFoundException("Item not found");
        await job.remove();
    }

    /**
     * retry a failed item of the retrieve task
     * @param {string} taskId uuid of the task
     * @param {string} itemId id of the item to be retried
     */
    static async retryItem(taskId, itemId) {
        let validateJobs = await RetrieveTask._getValidationJobs(taskId);
        let answerId = itemId.split(':')[1];
        let answerNumber = itemId.split(':')[0];
        let job = validateJobs.filter(job => job.data.item.AnswerNumber == answerNumber && job.data.item.AnswerId == answerId)[0];
        if (!job) throw new OTJSNotFoundException("Item not found");
        if (await job.getState() !== "failed") throw new OTJSBadRequestException("Can't retry a job that isn't failed");
        await job.retry();
    }

    /**
     * delete the task of a given id
     * @param {string} taskId uuid of the task to be deleted
     */
    static async delete(taskId) {
        let retrieveJobs = await RetrieveTask._getRetrieveJobs(taskId);

        //Checking if all the jobs are finished
        let stateComplete = (await Promise.all(retrieveJobs.map(job => job.getState()))).reduce((acc, x) => acc && (x === 'completed' || x === 'failed'), true);

        if (retrieveJobs.length !== 0 && !stateComplete) throw new OTJSForbiddenException("Can't delete a robot already in progress");
        let validateJobs = await RetrieveTask._getValidationJobs(taskId);

        await Promise.all(validateJobs.map(job => job.remove()));
        await Promise.all(retrieveJobs.map(job => job.remove()));
    }

    /**
     * Remove all jobs for retrieval
     */
    static async flush() {
        await retrieveQueue.clean();
        await validationQueue.clean();
    }


    /**
     * reduce the time to live of all the jobs of an user
     */
    static async decay(user) {
        let validateJobs = await validationQueue.getJobs()
            .then(jobs => jobs.filter(job => job.data.creator === user));
        let retrieveJobs = await retrieveQueue.getJobs()
            .then(jobs => jobs.filter(job => job.data.creator === user));

        await Promise.all(validateJobs.map(x => {
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
        await Promise.all(retrieveJobs.map(x => {
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
     * Processor that check the study of a given query
     * @param {object} job
     * @param {object} done
     */
    static async _validateItem(job, done) {
        try {
            orthanc.buildDicomQuery(job.data.item)

            //Querry the dicom
            const answerDetails = await orthanc.makeDicomQuery(job.data.item.OriginAET);

            // checking the answer compte
            if (answerDetails.length === 1) {
                job.progress(100);
                done(null, true);
            } else {
                job.progress(100)
                done(null, false);
            }
        } catch (e) {
            console.error(e);
            done(e);
        }

    }

    /**
     * Processor that retrieve the study of a given query
     * @param {object} job
     * @param {object} done
     */
    static async _retrieveItem(job, done) {
        orthanc.buildDicomQuery(job.data.item)

        //Retrieve the item
        try {
            const answerDetails = await orthanc.makeDicomQuery(job.data.item.OriginAET)
            const answer = answerDetails[0]
            const retrieveAnswer = await orthanc.makeRetrieve(answer.AnswerId, answer.AnswerNumber, await orthanc.getOrthancAetName(), false)

            //Monitor the orthanc job
            await orthanc.monitorJob(retrieveAnswer.Path, (response) => {
                job.progress(response.Progress)
                if (response.State === 'Failure') throw "Orthanc Error : " + response.ErrorDescription;
            }, 2000).then(async (response) => {
                const orthancResults = await orthanc.findInOrthancByUid(response.Content['Query'][0]['0020,000d'])
                done(null, orthancResults[0].ID)
            }).catch((error) => {
                console.error(error)
                done(error)
            })
        } catch (error) {
            done(error)
        }
    }
}

let pauser = null;
let resumer = null;

async function setupRetrieveSchedule() {
    const optionsParameters = await Options.getOptions()
    let now = new Date(Date.now());

    //Remove previous set schedule
    if (pauser) pauser.cancel()
    if (resumer) resumer.cancel()

    //Pausing or unpausing the aet queue
    if (time.isTimeInbetween(now.getHours(), now.getMinutes(), optionsParameters.hour_start, optionsParameters.min_start, optionsParameters.min_stop, optionsParameters.hour_stop)) {
        retrieveQueue.resume().catch((err) => {
        })
    } else {
        retrieveQueue.pause().catch((err) => {
        })
    }

    //Schedule for the queue to be paused and unpaused
    this.resumer = schedule.scheduleJob(optionsParameters.min_start + ' ' + optionsParameters.hour_start + ' * * *', () => {
        retrieveQueue.resume()
    })
    this.pauser = schedule.scheduleJob(optionsParameters.min_stop + ' ' + optionsParameters.hour_stop + ' * * *', () => {
        retrieveQueue.pause()
    })
}

Options.optionEventEmiter.on('schedule_change', () => {
    setupRetrieveSchedule()
})

setupRetrieveSchedule();

let validationQueue = new Queue("validation", RetrieveTask._validateItem, Number(process.env.RETRIEVE_ATTEMPTS) || 3, Number(process.env.RETRIEVE_BACKOFF) || 2000, Number(process.env.RETRIEVE_WORKERS) || 3);
let retrieveQueue = new Queue("retrieve", RetrieveTask._retrieveItem, Number(process.env.RETRIEVE_ATTEMPTS) || 3, Number(process.env.RETRIEVE_BACKOFF) || 2000, Number(process.env.RETRIEVE_WORKERS) || 3);


module.exports = RetrieveTask