import apis from '../services/apis'
import MonitorJob from './MonitorJob'

export default class ExportMonitorJob extends MonitorJob{
    constructor(jobID,interval=1000){
        super(jobID,interval)
    }

    cancel(){
        console.warn("export job supression not implemented")
    }

    async jobMonitoring(jobUuid){
        const taskData = await apis.exportTask.getTaskInfos(jobUuid);
        const taskStatus = taskData.status

        this.updateCallBack((taskStatus === ExportMonitorJob.Sending ? Math.round(taskData.sent/taskData.size*100):0))

        if (taskStatus === ExportMonitorJob.Success || taskStatus < 0 ) {
            this.stopMonitoringJob()
            this.finishCallback((taskStatus === ExportMonitorJob.Success ? MonitorJob.Success : MonitorJob.Failure))
        }
    }
}

ExportMonitorJob.Success = 3
ExportMonitorJob.Sending = 2
