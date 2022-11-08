import {toast} from 'react-toastify'
import apis from '../services/apis'

export default class MonitorJob {

    state = {
        intervalID: null
    }

    finishCallback = () => {}
    updateCallBack = () => {}
 
    constructor(jobID, interval = 1000) {
        this.jobID = jobID
        this.interval = interval
        this.continue = false
    }


    onFinish(callback) {
        this.finishCallback = callback
    }

    onUpdate(callback) {
        this.updateCallBack = callback
    }

    startMonitoringJob() {
        this.continue = true;
        this.jobMonitoring(this.jobID)

        this.state.intervalID = setInterval(() => {
            this.jobMonitoring(this.jobID)
        }, this.interval)
    }

    stopMonitoringJob() {
        this.continue = false;
        clearInterval(this.state.intervalID)
    }

    async cancelJob() {
        await apis.jobs.cancelJob(this.jobID).catch(error => {
            toast.error(error.statusText)
        })
        toast.success('Job Cancelled')
        this.stopMonitoringJob()
    }

    async jobMonitoring(jobUID) {
        let jobData
        let queryStartTime = Date.now();

        try {
            jobData = await apis.jobs.getJobInfos(jobUID)
        } catch (error) {
            console.error(error)
            this.stopMonitoringJob()
            toast.error('Monitoring Failed')
            return
        }

        const currentStatus = jobData.State

        this.updateCallBack(jobData.Progress)

        if (this.continue) {
            setTimeout(() => {
                this.jobMonitoring(this.jobID)
            }, this.interval - (Date.now() - queryStartTime))
        }

        if (currentStatus === MonitorJob.Success || currentStatus === MonitorJob.Failure) {
            this.stopMonitoringJob()
            this.finishCallback(currentStatus)
        }


    }
}

MonitorJob.Success = 'Success'
MonitorJob.Failure = 'Failure'
MonitorJob.Pending = 'Pending'