import { toast } from 'react-toastify'
import apis from '../services/apis'

export default class MonitorJob {

    constructor(jobID, interval=1000){
        this.jobID = jobID
        this.interval = interval
        this.finishCallback = function(status){}
        this.updateCallBack = function(progress){}
    }

    onFinish(callback){
        this.finishCallback = callback
    }

    onUpdate(callback){
        this.updateCallBack = callback
    }

    startMonitoringJob() {
        this.intervalChcker = setInterval(() => this.jobMonitoring(this.jobID), this.interval)
    }

    stopMonitoringJob() {
        if(this.intervalChcker !== undefined) clearInterval(this.intervalChcker)
    }

    async cancelJob(){
        await apis.jobs.cancelJob(this.jobID).catch(error => {toast.error(error.statusText)})
        toast.success('Job Cancelled')
        this.stopMonitoringJob()
    }

    async jobMonitoring(jobUID) {
        let jobData

        try{
             jobData = await apis.jobs.getJobInfos(jobUID)
        } catch(error){
            console.error(error)
            this.stopMonitoringJob()
            toast.error('Monitoring Failed')
            return
        }
        
        const currentStatus = jobData.State
    
        this.updateCallBack(jobData.Progress)
    
        if (currentStatus === MonitorJob.Success || currentStatus === MonitorJob.Failure ) {
          this.stopMonitoringJob()
          this.finishCallback(currentStatus)
        }
    
    }
}

MonitorJob.Success = 'Success'
MonitorJob.Failure = 'Failure'
MonitorJob.Pending = 'Pending'