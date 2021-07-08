const BullQueue = require('bull');
const event = require('events');

const REDIS_OPTIONS = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
}

const queues = [];
const CLEAN_GRACE = 0;

class Queue extends event.EventEmitter {
    /**
     * Constructor that create the queue
     * @param queueName name of the queue
     * @param fn function.s that process the jobs
     * @param attempts number of time a job should be retried [optional]
     * @param backoffType type of backoff for the jobs retry ('fixed'|'exponential') [optional]
     * @param backoff base backoff duration [optional]
     */
    constructor(queueName, fn, attempts = 1, backoff = 2000, backoffType = 'fixed') {
        super();
        this._queue = new BullQueue(queueName, {
            redis: REDIS_OPTIONS, defaultJobOptions: {
                attempts,
                backoff
            }
        });
        this._invalidated = true;
        this._cachedJobs = [];
        if (typeof fn === "object") {
            this._queue.isReady()
                .then(() => Promise.all(
                    Object.entries(fn).map(entry => this._queue.process(entry[0], entry[1]))
                ));
        } else {
            this._queue.isReady()
                .then(() => this._queue.process(fn));
        }
        this._queue.on('completed', (job, result) => {
            this._invalidated = true;
            this.emit('completed', job, result);

        });
        this._queue.on('progress', (job, progress) => {
            this._invalidated = true;
            this.emit('progress', job, progress);
        });
        this._queue.on('error', (err) => {
            if (err.code === "ECONNREFUSED") {
                console.error(`Could not connect to redis at ${err.address}:${err.port}. The feature requiring bull will respond 500`);
                return;
            }
            if (err.message.includes("Redis version needs to be greater than ") || err.message.includes("ERR unknown command")) {
                console.error(`${err.message}. The feature requiring bull will respond 500`);
                return;
            }
            this._invalidated = true;
            this.emit('error', err);
        });
        this._queue.on('failed', (job, err) => {
            console.log(err);
            this._invalidated = true;
            this.emit('failed', job, err);
        });
        this._queue.on('removed', (job) => {
            this._invalidated = true;
        });
        queues.push(this);
    }

    /**
     * Returns a promise completed when the queue is ready
     * @returns {Promise}
     */
    isReady = () => this._queue.isReady().then(() => true);

    /**
     * Add a job to the queue
     * @param {String} name processor name
     * @param {Object} jobData data for the process
     * @returns {Promise<Object>} Promise returning the job;
     */
    addJob = (jobData, name = null) => {
        this._invalidated = true;
        if (name) {
            return this.isReady().then(() => this._queue.add(name, jobData)).then(job => new Job(job));
        } else {
            return this.isReady().then(() => this._queue.add(jobData)).then(job => new Job(job));
        }
    }

    /**
     * Add jobs to the queue
     * @param jobsData data for the process
     * @param {String } name of the processor
     * @returns {Promise<Object[]>} Promise returning the jobs
     */
    addJobs = (jobsData, name = null, poolSize = DEFAULT_POOL_SIZE) => {
        this._invalidated = true;
        let jobData = []
        if (poolSize < 2) {
            return this.isReady().then(() => this._queue.addBulk(jobsData)).then(jobs => jobs.map(j => new Job(j)));
        } else {
            if (name) {
                for (let i = 0; i < jobsData.length; i += poolSize) {
                    jobData.push({
                        name: name + "__bulk",
                        data: {
                            jobs: jobsData.slice(i, i + poolSize).map(j => j.data),
                            results: [],
                            errors: []
                        }
                    })
                }
            } else {
                for (let i = 0; i < jobsData.length; i += poolSize) {
                    jobData.push({
                        name: "__default__bulk",
                        data: {
                            jobs: jobsData.slice(i, i + poolSize).map(j => j.data),
                            results: [],
                            errors: []
                        }
                    })
                }
            }
            return this.isReady().then(() => this._queue.addBulk(jobData)).then(jobs => jobs.map(job => job.data.jobs.map((j, i) => new BatchedJob(job, i))).flat());
        }
      
    }

    /**
     * Returns a list of jobs contained in the queue
     * @returns {Promise<Object[]>} Promise returning the jobs of the queue
     */
    getJobs = () => this.isReady().then(() => {
        if (!this._invalidated) return this._cachedJobs;
        return this._queue.getJobs(Object.values(Queue.JOB_STATES)).then(
            jobs => {
                this._cachedJobs = jobs.map((job) => (job.data.jobs === undefined ? new Job(job) : job.data.jobs.map((j, i) => new BatchedJob(job, i)))).flat()
                this._invalidated = false;
                return this._cachedJobs;
            }
        )
    });


    /**
     * Remove all jobs of the queue
     * @returns {Promise<>} Promise resolved when the clean is done
     */
    clean = async () => {
        this._invalidated = true;
        await Promise.all(Object.values(Queue._JOB_STATES_CLEAN).map(x => this._queue.clean(CLEAN_GRACE, x)))

        await this._queue.getActive().then(
            jobs => Promise.all(jobs.map(job => job.releaseLock().then(
                () => job.remove()))));

    };

    /**
     * Returns a promise completed when the queue is ready
     * @returns {Promise}
     */
    static isAllReady() {
        return Promise.all(queues.map(queue => queue.isReady())).then(readies => readies.reduce((previousValue, currentValue) => previousValue && currentValue));
    }

    /**
     * Pauses the execution of the queue
     * @returns {Promise} promise that resolve once the queue is paused
     */
    pause = () => this._queue.isReady().then(() => this._queue.pause());

    /**
     * resume the execution of the queue
     * @returns {Promise} promise that resolve once the queue is resumed
     */
    resume = () => this._queue.isReady().then(() => this._queue.resume());

    static _batch_processor(processor) {
        return async (job, done) => {
            let isRetry = job.data.errors.filter(x => !(x === undefined || x === null)).length !== 0;
            let retries = job.data.errors.map(x => !(x === undefined || x === null));
            job.data.errors = new Array(job.data.jobs.length).fill(null);
            if (!isRetry) job.progress(new Array(job.data.jobs.length).fill(null));
            await job.update(job.data);
            let subJobs = job.data.jobs.map((j, i) => {
                return {
                    data: j,
                    progress: async (progress = null) => {
                        let prog = await job.progress();
                        if (progress) {
                            prog[i] = progress;
                            await job.progress(prog);
                        }
                        return prog[i];
                    }
                }
            });

            let failed = false;
            let i = 0
            for (let j of subJobs) {
                if (!isRetry || retries[i]) await new Promise((resolve, reject) => {
                    try {
                        processor(j, (err, res) => {
                            job.data.errors[i] = err;
                            job.data.results[i] = res;
                            job.update(job.data).then(() => resolve());
                            if (!!err) failed = true;
                        });
                    } catch (e) {
                        failed = true;
                        job.data.errors[i] = e;
                        job.update(job.data).then(() => resolve());
                    }
                })
                i++;
            }

            done(failed ? job.data.errors : null, true);
        }
    }

}

class Job {
    constructor(bullJob) {
        this._bullJob = bullJob;
        this._bullJob._cachedState = null
        this.data = bullJob.data;
        this._bullJob._cacheRes = null;
        this._bullJob._cachedProgress = null;
    }

    async progress() {
        if (this._bullJob._cachedProgress !== null) return this._bullJob._cachedProgress;
        this._bullJob._cachedProgress = await this._bullJob.progress();
        return this._bullJob._cachedProgress;
    }

    async getState() {
        if (this._bullJob._cachedState !== null) {
            return this._bullJob._cachedState;
        }
        return await this._bullJob.getState().then(state => {
            this._bullJob._cachedState = state;
            return state;
        });
    }

    async finished() {
        if (this._bullJob._cacheRes !== null) return this._bullJob._cacheRes;
        return await this._bullJob.finished().then(res => {
            this._bullJob._cacheRes = res;
            return res;
        });
    }

    update(data) {
        return this._bullJob.update(data);
    }

    remove() {
        return this._bullJob.remove()
    }

    moveToFailed(error) {
        return this._bullJob.moveToFailed(error, true);
    }

    async progress() {
        return (await super.progress())[this._i];
    }

    getState() {
        return super.getState().then(state => {
            if (this._bullJob.data.results[this._i] !== null && this._bullJob.data.results[this._i] !== undefined) return Queue.JOB_STATES.COMPLETED;
            if (this._bullJob.data.errors[this._i] !== null && this._bullJob.data.errors[this._i] !== undefined) return (state === Queue.JOB_STATES.DELAYED || state === Queue.JOB_STATES.ACTIVE ? Queue.JOB_STATES.DELAYED : Queue.JOB_STATES.FAILED);
            if (this._i === 0 ||
                this._bullJob.data.results[this._i - 1] !== null && this._bullJob.data.results[this._i - 1] !== undefined ||
                this._bullJob.data.errors[this._i - 1] !== null && this._bullJob.data.errors[this._i - 1] !== undefined) return Queue.JOB_STATES.ACTIVE;
            return Queue.JOB_STATES.WAITING;
        });
    }

    async finished() {
        return this._bullJob.data.results[this._i];
    }

    update(data) {
        this._bullJob.data.jobs[this._i] = data;
        return this._bullJob.update(this._bullJob.data);
    }

}

Queue.Job = Job;

Queue.JOB_STATES = {
    COMPLETED: 'completed',
    FAILED: 'failed',
    DELAYED: 'delayed',
    WAITING: 'waiting',
    ACTIVE: 'active',
    PAUSE: 'paused'
}

Queue._JOB_STATES_CLEAN = {
    COMPLETED: 'completed',
    FAILED: 'failed',
    DELAYED: 'delayed',
    WAITING: 'wait',
    ACTIVE: 'active',
    PAUSE: 'paused'
}

module.exports = Queue