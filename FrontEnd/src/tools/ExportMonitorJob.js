import apis from '../services/apis'
import MonitorJob from './MonitorJob'

export default class MonitorTask extends MonitorJob{
    constructor(jobID,interval=1000){
        super(jobID,interval)
    }

    cancel(){
        console.warn("export job supression not implemented")
    }

    async jobMonitoring(jobUuid){
        const taskProgress = await apis.task.getTaskProgress(jobUuid);
        const taskStatus = await apis.task.getTaskStatus(jobUuid)

        this.updateCallBack({taskProgress,taskStatus})

        if (taskProgress.total === 100) {
            this.stopMonitoringJob()
            this.finishCallback({taskProgress,taskStatus})
        }
    }
}
