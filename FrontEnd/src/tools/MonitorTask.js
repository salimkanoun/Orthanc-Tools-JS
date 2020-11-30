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
        const task = await apis.task.getTask(jobUuid)

        this.updateCallBack(task)

        if (task.state === 'completed') {
            this.stopMonitoringJob()
            this.finishCallback(task)
        }
    }
}
