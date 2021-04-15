const BullQueue = require('bull');
const event = require('events');

const REDIS_OPTIONS = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
}

const CLEAN_GRACE = 1;

class Queue extends event.EventEmitter {
    /**
     * Constructor that create the job
     * @param queueName name of the queue
     * @param fn function.s that process the job
     */
    constructor(queueName, fn) {
        super();
        this._queue = new BullQueue(queueName, {redis: REDIS_OPTIONS});
        if (typeof fn === "object") {
            this._processPromise = this._queue.isReady()
                .then(() => Promise.all(
                    Object.entries(fn).map(entry => this._queue.process(entry[0], entry[1]))
                ));
        } else {
            this._processPromise = this._queue.isReady()
                .then(() => this._queue.process(fn));
        }
        this._queue.on('completed', (job, result) => {
            this.emit('completed', job, result);
        });
    }

    /**
     * Returns a promise completed when the queue is ready
     * @returns {Promise}
     */
    isReady = () => this._queue.isReady();

    /**
     * Add a job to the queue
     * @param {String} name processor name
     * @param {Object} jobData data for the process
     * @returns {Promise<Object>} Promise returning the job;
     */
    addJob = (jobData, name = null) => {
        if (name) {
            return this.isReady().then(() => this._queue.add(name, jobData));
        } else {
            return this.isReady().then(() => this._queue.add(jobData));
        }
    }

    /**
     * Add jobs to the que
     * @param jobsData data for the process
     * @param {String } name of the processor
     * @returns {Promise<Object[]>} Promise returning the jobs
     */
    addJobs = (jobsData, name = null) => {
        if (name) {
            return this.isReady().then(() => this._queue.addBulk(name, jobsData));
        } else {
            return this.isReady().then(() => this._queue.addBulk(jobsData));
        }
    }

    /**
     * Returns a list of jobs contained in the queue
     * @returns {Promise<Object[]>} Promise returning the jobs of the queue
     */
    getJobs = () => this.isReady().then(() => this._queue.getJobs(Object.values(Queue.JOB_STATES)));

    /**
     * Remove all jobs of the queue
     * @returns {Promise<>} Promise resolved when the clean is done
     */
    clean = () => Promise.all(Object.values(Queue._JOB_STATES_CLEAN).map(x => this._queue.clean(CLEAN_GRACE, x)));
}

Queue.JOB_STATES = {
    COMPLETED: 'completed',
    FAILED: 'failed',
    DELAYED: 'delayed',
    WAITING: 'waiting',
    ACTIVE: 'active',
    PAUSE: 'pause'
}

Queue._JOB_STATES_CLEAN = {
    COMPLETED: 'completed',
    FAILED: 'failed',
    DELAYED: 'delayed',
    WAITING: 'wait',
    ACTIVE: 'active'
}

module.exports = Queue