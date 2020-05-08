import apis from '../services/apis'

export default class MonitorJob {

    constructor(jobID, interval=2000){
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

    cancelJob(){
        //SK AAJOUTER ICI APPEL POUR ARRETER LE JOB
        this.stopMonitoringJob()
    }

    async jobMonitoring(jobUID) {

        const jobData = await apis.jobs.getJobInfos(jobUID)
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