import { toast } from 'react-toastify'
import apis from '../services/apis'

export default class MonitorJob {

    interval = null
    jobID = null
    intervalID = null

    finishCallback = () => { }
    updateCallBack = () => { }

    constructor(jobID, interval = 1000) {
        this.jobID = jobID
        this.interval = interval
    }

    onFinish = (callback) => {
        this.finishCallback = callback
    }

    onUpdate = (callback) => {
        this.updateCallBack = callback
    }

    startMonitoringJob = () => {
        this.intervalID = setInterval(() => {
            this.jobMonitoring(this.jobID)
        }, this.interval)
    }

    stopMonitoringJob = () => {
        clearInterval(this.intervalID)
    }

    cancelJob = async () => {
        await apis.jobs.cancelJob(this.jobID).catch(error => {
            toast.error(error.statusText, {data:{type:'notification'}})
        })
        toast.success('Job Cancelled', {data:{type:'notification'}})
        this.stopMonitoringJob()
    }

    jobMonitoring = async (jobUID) => {
        let jobData = {}

        
        try {
            jobData = await apis.jobs.getJobInfos(jobUID)
        } catch (error) {
            console.error(error)
            this.stopMonitoringJob()
            toast.error('Monitoring Failed', {data:{type:'notification'}})
            return
        }

        const currentStatus = jobData.State

        this.updateCallBack(jobData.Progress)

        if (currentStatus === MonitorJob.Success || currentStatus === MonitorJob.Failure) {
            this.stopMonitoringJob()
            this.finishCallback(currentStatus)
        }


    }
}

MonitorJob.Success = 'Success'
MonitorJob.Failure = 'Failure'
MonitorJob.Pending = 'Pending'